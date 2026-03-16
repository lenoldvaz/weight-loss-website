import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

function getContentPath(template: string, slug: string): string {
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  return path.join(process.cwd(), "src/data/content", safeTemplate, `${safeSlug}.json`);
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

// Dynamically import prompt_builder so we can call buildPrompt at runtime
async function buildPromptForSeed(seed: Record<string, unknown>): Promise<string> {
  // We use a dynamic require-style approach to call the script-side buildPrompt.
  // Since scripts use .js extensions for ESM, we resolve via the cwd.
  const promptBuilderPath = path.join(process.cwd(), "scripts/generate/prompt_builder.js");

  type PromptBuilderModule = { buildPrompt: (seed: unknown) => string };
  const mod = (await import(promptBuilderPath)) as PromptBuilderModule;
  return mod.buildPrompt(seed);
}

// Sanitize helper (mirrors validate.ts sanitize)
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; slug: string }> }
) {
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

  const { template, slug } = await params;
  const contentPath = getContentPath(template, slug);

  let existingRecord: Record<string, unknown>;
  try {
    const raw = await fs.readFile(contentPath, "utf-8");
    existingRecord = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }

  const seed = existingRecord.seed as Record<string, unknown>;
  if (!seed) {
    return NextResponse.json({ error: "Content record has no seed — cannot regenerate" }, { status: 400 });
  }

  let prompt: string;
  try {
    prompt = await buildPromptForSeed(seed);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to build prompt: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  let newContent: unknown;
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = sanitize(JSON.parse(cleaned));
    } catch (err) {
      return NextResponse.json(
        { error: `Claude returned invalid JSON: ${(err as Error).message}` },
        { status: 502 }
      );
    }

    newContent = parsed;
  } catch (err) {
    return NextResponse.json(
      { error: `Claude API error: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  // Preserve existing hero_image if present
  const existingContent = (existingRecord.content ?? {}) as Record<string, unknown>;
  const heroImage = existingContent.hero_image;

  const updatedContent = newContent as Record<string, unknown>;
  if (heroImage) {
    updatedContent.hero_image = heroImage;
  }

  const updatedRecord: Record<string, unknown> = {
    ...existingRecord,
    generated_at: new Date().toISOString(),
    content: updatedContent,
  };

  try {
    await fs.writeFile(contentPath, JSON.stringify(updatedRecord, null, 2) + "\n", "utf-8");
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to write regenerated content: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedRecord);
}
