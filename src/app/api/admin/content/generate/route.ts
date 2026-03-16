import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { SEED_SLUGS } from "../seeds-manifest";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 4096;

const SYSTEM_PROMPT = `You are a JSON content generator for weight-loss.ca, a Canadian health publication.
Your sole job is to produce valid JSON objects that match the exact schema provided in the user's prompt.

Rules:
1. Output ONLY raw JSON — no markdown code fences, no explanation, no preamble or postamble
2. Every required field must be present and non-empty
3. All string fields must meet the minimum character lengths specified
4. All arrays must have at least the minimum number of items specified
5. Numeric fields (scores, ranks, etc.) must be actual numbers, not strings
6. Boolean fields must be actual booleans (true/false), not strings
7. The response must start with { and end with }
8. Do not add any fields that are not in the schema
9. All content must be accurate, helpful, and appropriate for a Canadian health audience`;

// Mirrors validate.ts sanitize
const MAX_LENGTHS: Record<string, number> = {
  page_title: 65,
  meta_description: 160,
  h1: 70,
  intro: 400,
  local_context: 300,
  quick_answer: 200,
  verdict_summary: 200,
};

function sanitize(obj: unknown): unknown {
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof v === "string" && MAX_LENGTHS[k] !== undefined) {
        out[k] = v.length > MAX_LENGTHS[k] ? v.slice(0, MAX_LENGTHS[k]).trimEnd() : v;
      } else {
        out[k] = sanitize(v);
      }
    }
    return out;
  }
  return obj;
}

async function buildPromptForSeed(seed: Record<string, unknown>): Promise<string> {
  const promptBuilderPath = path.join(process.cwd(), "scripts/generate/prompt_builder.js");
  type PromptBuilderModule = { buildPrompt: (seed: unknown) => string };
  const mod = (await import(promptBuilderPath)) as PromptBuilderModule;
  return mod.buildPrompt(seed);
}

async function validateAndParse(
  rawText: string,
  template: string
): Promise<{ data: unknown } | { error: string }> {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = sanitize(JSON.parse(cleaned));
  } catch (err) {
    return { error: `Claude returned invalid JSON: ${(err as Error).message}` };
  }

  // Dynamically import the validate module (scripts-side ESM)
  const validatePath = path.join(process.cwd(), "scripts/generate/validate.js");
  type ValidateModule = {
    validateContent: (raw: string, template: string) => { valid: boolean; data?: unknown; errors?: string[] };
  };

  try {
    const validateMod = (await import(validatePath)) as ValidateModule;
    // validateContent expects the original raw string, not the already-parsed object,
    // so we re-serialize the sanitized result for validation.
    const result = validateMod.validateContent(JSON.stringify(parsed), template);
    if (result.valid && result.data) {
      return { data: result.data };
    }
    return { error: (result.errors ?? ["Validation failed"]).join("; ") };
  } catch {
    // Fallback: if validate.js not available, use the sanitized parsed value as-is
    return { data: parsed };
  }
}

/**
 * POST /api/admin/content/generate
 * Body: { template: string; slug: string }
 *
 * Finds the matching seed from the manifest, builds a prompt, calls Claude,
 * validates, and writes the result to disk.
 */
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  let body: { template?: string; slug?: string };
  try {
    body = (await request.json()) as { template?: string; slug?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { template, slug } = body;
  if (!template || !slug) {
    return NextResponse.json(
      { error: "Missing required fields: template, slug" },
      { status: 400 }
    );
  }

  // Validate template is in our manifest
  const knownSlugs = SEED_SLUGS[template];
  if (!knownSlugs) {
    return NextResponse.json(
      { error: `Unknown template: ${template}` },
      { status: 400 }
    );
  }

  if (!knownSlugs.includes(slug)) {
    return NextResponse.json(
      { error: `Slug "${slug}" not found in manifest for template "${template}"` },
      { status: 400 }
    );
  }

  // Check if already generated (idempotent)
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  const contentPath = path.join(
    process.cwd(),
    "src/data/content",
    safeTemplate,
    `${safeSlug}.json`
  );

  if (fs.existsSync(contentPath)) {
    return NextResponse.json({ ok: true, slug, alreadyExists: true });
  }

  // Dynamically load the seed from the seed file for this template
  type SeedsModule = { [key: string]: unknown[] };
  const seedFileMap: Record<string, string> = {
    "location-service": path.join(process.cwd(), "scripts/generate/seeds/location-service.seeds.js"),
    "how-to": path.join(process.cwd(), "scripts/generate/seeds/how-to.seeds.js"),
    "product-review": path.join(process.cwd(), "scripts/generate/seeds/product-review.seeds.js"),
  };

  const seedFilePath = seedFileMap[template];
  if (!seedFilePath) {
    return NextResponse.json(
      { error: `No seed file configured for template: ${template}` },
      { status: 400 }
    );
  }

  let seedsModule: SeedsModule;
  try {
    seedsModule = (await import(seedFilePath)) as SeedsModule;
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to load seed file: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // Find the buildSlug function to match the seed
  const promptBuilderPath = path.join(process.cwd(), "scripts/generate/prompt_builder.js");
  type PromptBuilderModule = {
    buildPrompt: (seed: unknown) => string;
    buildSlug: (seed: unknown) => string;
  };

  let promptBuilderMod: PromptBuilderModule;
  try {
    promptBuilderMod = (await import(promptBuilderPath)) as PromptBuilderModule;
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to load prompt_builder: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // Find the seed whose buildSlug matches the requested slug
  const allSeeds = Object.values(seedsModule).flat() as Record<string, unknown>[];
  const matchingSeed = allSeeds.find((s) => {
    try {
      return promptBuilderMod.buildSlug(s) === slug;
    } catch {
      return false;
    }
  });

  if (!matchingSeed) {
    return NextResponse.json(
      { error: `Could not find matching seed for slug "${slug}" in template "${template}"` },
      { status: 404 }
    );
  }

  // Build the prompt
  let prompt: string;
  try {
    prompt = await buildPromptForSeed(matchingSeed);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to build prompt: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // Call Claude
  const anthropic = new Anthropic({ apiKey });

  let rawText: string;
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    rawText = response.content[0]?.type === "text" ? response.content[0].text : "";
  } catch (err) {
    return NextResponse.json(
      { error: `Claude API error: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  // Validate and parse
  const parseResult = await validateAndParse(rawText, template);
  if ("error" in parseResult) {
    return NextResponse.json({ error: parseResult.error }, { status: 502 });
  }

  // Write to disk
  const contentDir = path.join(process.cwd(), "src/data/content", safeTemplate);
  const record = {
    template,
    slug: safeSlug,
    generated_at: new Date().toISOString(),
    seed: matchingSeed,
    content: parseResult.data,
  };

  try {
    await fsPromises.mkdir(contentDir, { recursive: true });
    await fsPromises.writeFile(
      contentPath,
      JSON.stringify(record, null, 2) + "\n",
      "utf-8"
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to write content: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, slug });
}
