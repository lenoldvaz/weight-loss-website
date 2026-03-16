import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, buildSlug, SYSTEM_PROMPT } from "./prompt_builder.js";
import { validateContent } from "./validate.js";
import { writeContent, contentExists } from "./write_content.js";
import type { AnySeed, GenerationResult } from "./types.js";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 4096;
const MAX_RETRIES = 2;
const CONCURRENCY = 5; // pages generated in parallel

let anthropic: Anthropic;

function getClient(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local and run: source .env.local"
      );
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

async function generateOne(seed: AnySeed): Promise<GenerationResult> {
  const slug = buildSlug(seed);
  const template = seed.template;
  const start = Date.now();

  // Skip if already generated (idempotent)
  if (contentExists(template, slug)) {
    return { seed, slug, template, status: "success" };
  }

  const prompt = buildPrompt(seed);
  let lastRaw = "";
  let lastErrors: string[] = [];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });

      const raw =
        response.content[0]?.type === "text" ? response.content[0].text : "";
      lastRaw = raw;

      const validation = validateContent(raw, template);
      if (validation.valid && validation.data) {
        const filePath = writeContent(template, slug, seed, validation.data);
        return {
          seed,
          slug,
          template,
          status: "success",
          content: validation.data,
          duration_ms: Date.now() - start,
        };
      } else {
        lastErrors = validation.errors ?? ["Unknown validation error"];
        if (attempt < MAX_RETRIES) {
          // Wait briefly before retry
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    } catch (err) {
      lastErrors = [(err as Error).message];
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }

  // If we get here, all retries failed
  if (lastErrors[0]?.startsWith("JSON parse error") || lastErrors[0]?.includes("validation")) {
    return {
      seed,
      slug,
      template,
      status: "validation_error",
      errors: lastErrors,
      raw: lastRaw,
      duration_ms: Date.now() - start,
    };
  }

  return {
    seed,
    slug,
    template,
    status: "api_error",
    errors: lastErrors,
    duration_ms: Date.now() - start,
  };
}

/** Run a batch of seeds with controlled concurrency */
export async function generateBatch(
  seeds: AnySeed[],
  options: { concurrency?: number; onProgress?: (result: GenerationResult) => void } = {}
): Promise<GenerationResult[]> {
  const concurrency = options.concurrency ?? CONCURRENCY;
  const results: GenerationResult[] = [];
  let index = 0;

  async function worker() {
    while (index < seeds.length) {
      const seed = seeds[index++];
      const result = await generateOne(seed);
      results.push(result);
      options.onProgress?.(result);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, seeds.length) }, worker);
  await Promise.all(workers);

  return results;
}

/** Print a summary of batch results */
export function printSummary(results: GenerationResult[]): void {
  const success = results.filter((r) => r.status === "success").length;
  const validationErrors = results.filter((r) => r.status === "validation_error").length;
  const apiErrors = results.filter((r) => r.status === "api_error").length;
  const skipped = results.filter((r) => r.status === "success" && !r.duration_ms).length;

  console.log("\n─────────────────────────────────────");
  console.log(`  Generated: ${success - skipped}`);
  console.log(`  Skipped (already exists): ${skipped}`);
  console.log(`  Validation errors: ${validationErrors}`);
  console.log(`  API errors: ${apiErrors}`);
  console.log(`  Total: ${results.length}`);
  console.log("─────────────────────────────────────\n");

  if (validationErrors > 0 || apiErrors > 0) {
    console.log("Failed pages:");
    results
      .filter((r) => r.status !== "success")
      .forEach((r) => {
        console.log(`  [${r.status}] ${r.template}/${r.slug}`);
        r.errors?.forEach((e) => console.log(`    → ${e}`));
      });
  }
}
