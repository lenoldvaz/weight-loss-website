/**
 * Content generation CLI
 *
 * Usage:
 *   npm run generate -- --template location-service --limit 10
 *   npm run generate -- --template how-to
 *   npm run generate -- --template product-review --limit 5
 *   npm run generate -- --all --limit 10
 *
 * Options:
 *   --template <name>   Template to generate (or "all" for all templates)
 *   --all               Generate from all templates
 *   --limit <n>         Max pages to generate (default: unlimited)
 *   --concurrency <n>   Parallel API calls (default: 5)
 *   --dry-run           Print seeds without calling API
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { generateBatch, printSummary } from "./content_generator.js";
import type { AnySeed, TemplateName } from "./types.js";
import { locationServiceSeeds } from "./seeds/location-service.seeds.js";
import { howToSeeds } from "./seeds/how-to.seeds.js";
import { productReviewSeeds } from "./seeds/product-review.seeds.js";

// Load .env.local manually if dotenv doesn't find it
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

const ALL_SEEDS: Record<string, AnySeed[]> = {
  "location-service": locationServiceSeeds,
  "how-to": howToSeeds,
  "product-review": productReviewSeeds,
};

function parseArgs() {
  const args = process.argv.slice(2);
  const result: {
    template?: string;
    all: boolean;
    limit?: number;
    concurrency: number;
    dryRun: boolean;
  } = { all: false, concurrency: 1, dryRun: false };

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
      case "--concurrency":
        result.concurrency = parseInt(args[++i], 10);
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
    }
  }
  return result;
}

async function main() {
  const args = parseArgs();

  let seeds: AnySeed[] = [];

  if (args.all) {
    seeds = Object.values(ALL_SEEDS).flat();
  } else if (args.template) {
    const templateSeeds = ALL_SEEDS[args.template];
    if (!templateSeeds) {
      console.error(`Unknown template: "${args.template}"`);
      console.error(`Available: ${Object.keys(ALL_SEEDS).join(", ")}`);
      process.exit(1);
    }
    seeds = templateSeeds;
  } else {
    console.error("Please specify --template <name> or --all");
    console.error("Available templates:", Object.keys(ALL_SEEDS).join(", "));
    process.exit(1);
  }

  if (args.limit) {
    seeds = seeds.slice(0, args.limit);
  }

  console.log(`\nweight-loss.ca Content Generator`);
  console.log(`─────────────────────────────────────`);
  console.log(`Template: ${args.template ?? "all"}`);
  console.log(`Seeds: ${seeds.length}`);
  console.log(`Concurrency: ${args.concurrency}`);
  console.log(`Dry run: ${args.dryRun}`);
  console.log(`─────────────────────────────────────\n`);

  if (args.dryRun) {
    console.log("Seeds that would be generated:");
    seeds.forEach((s, i) => {
      console.log(
        `  ${i + 1}. [${s.template}]`,
        JSON.stringify(s).slice(0, 120),
      );
    });
    return;
  }

  let completed = 0;
  const results = await generateBatch(seeds, {
    concurrency: args.concurrency,
    onProgress: (result) => {
      completed++;
      const icon = result.status === "success" ? "✓" : "✗";
      const skipped =
        result.status === "success" && !result.duration_ms ? " (skipped)" : "";
      const time = result.duration_ms ? ` ${result.duration_ms}ms` : "";
      console.log(
        `  ${icon} [${completed}/${seeds.length}] ${result.template}/${result.slug}${skipped}${time}`,
      );
      if (result.status !== "success" && result.errors?.length) {
        result.errors.slice(0, 2).forEach(e => console.log(`    → ${e.slice(0, 200)}`));
      }
    },
  });

  printSummary(results);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
