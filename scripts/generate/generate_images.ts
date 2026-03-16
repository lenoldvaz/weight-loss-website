/**
 * Standalone image generation script
 *
 * Scans content JSON files that have no hero_image and generates one for each.
 *
 * Usage:
 *   npx tsx scripts/generate/generate_images.ts --template location-service
 *   npx tsx scripts/generate/generate_images.ts --all
 *   npx tsx scripts/generate/generate_images.ts --template how-to --limit 5
 */

import fs from "fs";
import path from "path";
import { generateImage, saveImage, imageExists, buildImagePrompt } from "./image_generator.js";
import { updateContentWithImage } from "./write_content.js";
import type { AnySeed } from "./types.js";

// ─── Load .env.local (same pattern as run.ts) ─────────────────────────────────

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=["']?(.+?)["']?\s*$/);
    if (match) {
      process.env[match[1]] ??= match[2];
    }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentRecord {
  template: string;
  slug: string;
  generated_at: string;
  seed: AnySeed;
  content: Record<string, unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONTENT_BASE = path.resolve(process.cwd(), "src/data/content");

const ALL_TEMPLATES = [
  "location-service",
  "location-product",
  "product-review",
  "comparison",
  "how-to",
  "demographic-topic",
  "condition-topic",
  "best-list",
  "trending-article",
];

function getContentFilesWithoutImage(template: string): ContentRecord[] {
  const dir = path.join(CONTENT_BASE, template);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const results: ContentRecord[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const record = JSON.parse(raw) as ContentRecord;
    const content = record.content as Record<string, unknown>;

    // Skip if hero_image already set in the JSON
    if (content.hero_image != null) continue;

    // Also skip if the image file physically exists already
    const slug = file.replace(".json", "");
    if (imageExists(template, slug)) continue;

    results.push(record);
  }

  return results;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result: { template?: string; all: boolean; limit?: number } = {
    all: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--template":
        result.template = args[++i];
        break;
      case "--all":
        result.all = true;
        break;
      case "--limit":
        result.limit = parseInt(args[++i], 10);
        break;
    }
  }
  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.template && !args.all) {
    console.error("Please specify --template <name> or --all");
    console.error("Available templates:", ALL_TEMPLATES.join(", "));
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error(
      "No GEMINI_API_KEY or GOOGLE_AI_API_KEY found in environment.\n" +
        "Add one to .env.local to enable image generation."
    );
    process.exit(1);
  }

  const templates = args.all
    ? ALL_TEMPLATES
    : [args.template as string];

  // Validate template names
  for (const t of templates) {
    if (!ALL_TEMPLATES.includes(t)) {
      console.error(`Unknown template: "${t}"`);
      console.error("Available:", ALL_TEMPLATES.join(", "));
      process.exit(1);
    }
  }

  // Collect all records that need images
  let pending: Array<{ record: ContentRecord; template: string; slug: string }> = [];
  for (const template of templates) {
    const records = getContentFilesWithoutImage(template);
    for (const record of records) {
      pending.push({ record, template, slug: record.slug });
    }
  }

  if (args.limit) {
    pending = pending.slice(0, args.limit);
  }

  if (pending.length === 0) {
    console.log("No content files found that are missing a hero image.");
    return;
  }

  console.log(`\nweight-loss.ca Image Generator`);
  console.log(`─────────────────────────────────────`);
  console.log(`Templates: ${templates.join(", ")}`);
  console.log(`Pages needing images: ${pending.length}`);
  console.log(`─────────────────────────────────────\n`);

  let completed = 0;
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (const { record, template, slug } of pending) {
    completed++;
    const start = Date.now();

    // Double-check idempotency
    if (imageExists(template, slug)) {
      console.log(`  - [${completed}/${pending.length}] ${template}/${slug} (already exists, skipping)`);
      skipped++;
      continue;
    }

    try {
      const imageData = await generateImage(record.seed);

      if (!imageData) {
        console.log(`  - [${completed}/${pending.length}] ${template}/${slug} (no image data returned)`);
        failed++;
        continue;
      }

      const imagePath = await saveImage(template, slug, imageData.base64, imageData.mimeType);
      const imagePrompt = buildImagePrompt(record.seed);
      await updateContentWithImage(template, slug, imagePath, imagePrompt);

      const elapsed = Date.now() - start;
      console.log(`  + [${completed}/${pending.length}] ${template}/${slug} ${elapsed}ms`);
      succeeded++;

      // Delay between requests to avoid rate limits
      if (completed < pending.length) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      console.log(
        `  x [${completed}/${pending.length}] ${template}/${slug} — ERROR: ${(err as Error).message}`
      );
      failed++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  Generated: ${succeeded}`);
  console.log(`  Skipped (already existed): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${pending.length}`);
  console.log(`─────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
