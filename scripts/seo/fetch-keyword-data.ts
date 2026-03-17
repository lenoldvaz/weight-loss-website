/**
 * fetch-keyword-data.ts
 *
 * Fetches search volume, keyword difficulty, and CPC for all seed slugs
 * from the DataForSEO API and writes results to src/data/seo/keyword-data.json.
 *
 * Usage:
 *   npx tsx scripts/seo/fetch-keyword-data.ts
 *   npx tsx scripts/seo/fetch-keyword-data.ts --template location-service
 *   npx tsx scripts/seo/fetch-keyword-data.ts --limit 20
 *   npx tsx scripts/seo/fetch-keyword-data.ts --refresh
 */

import fs from "fs";
import path from "path";
import https from "https";
import { SEED_SLUGS } from "../../src/app/api/admin/content/seeds-manifest.js";
import { slugToKeyword } from "./keyword-utils.js";

// ─── Load .env.local ──────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const KEYWORD_DATA_PATH = path.resolve(
  process.cwd(),
  "src/data/seo/keyword-data.json"
);
const DATAFORSEO_HOST = "api.dataforseo.com";
const LOCATION_CODE = 2124; // Canada
const LANGUAGE_CODE = "en";
const DATE_FROM = "2025-09-01";
const DATE_TO = "2026-02-01";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeywordEntry {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  competition: string;
  traffic_potential: number;
  fetched_at: string;
}

type KeywordDataMap = Record<string, KeywordEntry>;

interface SearchVolumeResult {
  keyword: string;
  search_volume: number;
  competition: number;
  competition_level: string;
  cpc: number;
}

interface KDResult {
  keyword: string;
  keyword_difficulty: number;
}

// ─── CLI Argument Parsing ─────────────────────────────────────────────────────

function parseArgs(): {
  template?: string;
  limit?: number;
  refresh: boolean;
} {
  const args = process.argv.slice(2);
  const result: { template?: string; limit?: number; refresh: boolean } = {
    refresh: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--template":
        result.template = args[++i];
        break;
      case "--limit":
        result.limit = parseInt(args[++i], 10);
        break;
      case "--refresh":
        result.refresh = true;
        break;
    }
  }

  return result;
}

// ─── HTTP Helper ──────────────────────────────────────────────────────────────

function httpsPost(
  urlPath: string,
  body: string,
  authHeader: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: DATAFORSEO_HOST,
      path: urlPath,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── DataForSEO API Calls ─────────────────────────────────────────────────────

async function fetchSearchVolume(
  keywords: string[],
  authHeader: string
): Promise<Map<string, { volume: number; competition: string; cpc: number }>> {
  const body = JSON.stringify([
    {
      keywords,
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
      date_from: DATE_FROM,
      date_to: DATE_TO,
    },
  ]);

  const results = new Map<
    string,
    { volume: number; competition: string; cpc: number }
  >();

  try {
    const raw = await httpsPost(
      "/v3/keywords_data/google_ads/search_volume/live",
      body,
      authHeader
    );

    const parsed = JSON.parse(raw) as {
      status_code?: number;
      status_message?: string;
      tasks?: Array<{
        status_code?: number;
        status_message?: string;
        result?: SearchVolumeResult[] | null;
      }>;
    };

    if (parsed.status_code && parsed.status_code !== 20000) {
      console.error(
        `  [search_volume] API error: ${parsed.status_message ?? "Unknown error"}`
      );
      return results;
    }

    const taskResults = parsed.tasks?.[0]?.result ?? [];
    if (!taskResults) return results;

    for (const item of taskResults) {
      results.set(item.keyword, {
        volume: item.search_volume ?? 0,
        competition: item.competition_level ?? "UNKNOWN",
        cpc: item.cpc ?? 0,
      });
    }
  } catch (err) {
    console.error(`  [search_volume] Request failed: ${(err as Error).message}`);
  }

  return results;
}

async function fetchKeywordDifficulty(
  keywords: string[],
  authHeader: string
): Promise<Map<string, number>> {
  const body = JSON.stringify([
    {
      keywords,
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
    },
  ]);

  const results = new Map<string, number>();

  try {
    const raw = await httpsPost(
      "/v3/dataforseo_labs/google/bulk_keyword_difficulty/live",
      body,
      authHeader
    );

    const parsed = JSON.parse(raw) as {
      status_code?: number;
      status_message?: string;
      tasks?: Array<{
        status_code?: number;
        status_message?: string;
        result?: KDResult[] | null;
      }>;
    };

    if (parsed.status_code && parsed.status_code !== 20000) {
      console.error(
        `  [keyword_difficulty] API error: ${parsed.status_message ?? "Unknown error"}`
      );
      return results;
    }

    const taskResults = parsed.tasks?.[0]?.result ?? [];
    if (!taskResults) return results;

    for (const item of taskResults) {
      results.set(item.keyword, item.keyword_difficulty ?? 0);
    }
  } catch (err) {
    console.error(
      `  [keyword_difficulty] Request failed: ${(err as Error).message}`
    );
  }

  return results;
}

// ─── Batch Processing ─────────────────────────────────────────────────────────

async function processBatch(
  slugKeywordPairs: Array<{ slug: string; keyword: string }>,
  authHeader: string,
  existingData: KeywordDataMap,
  overallIndex: number,
  totalCount: number
): Promise<KeywordDataMap> {
  const keywords = slugKeywordPairs.map((p) => p.keyword);

  console.log(
    `\n  Fetching batch of ${keywords.length} keywords from DataForSEO...`
  );

  // Fetch both in parallel
  const [volumeMap, kdMap] = await Promise.all([
    fetchSearchVolume(keywords, authHeader),
    fetchKeywordDifficulty(keywords, authHeader),
  ]);

  const updatedData: KeywordDataMap = { ...existingData };
  const now = new Date().toISOString();

  for (let i = 0; i < slugKeywordPairs.length; i++) {
    const { slug, keyword } = slugKeywordPairs[i];
    const volData = volumeMap.get(keyword);
    const kd = kdMap.get(keyword) ?? 0;

    const volume = volData?.volume ?? 0;
    const competition = volData?.competition ?? "UNKNOWN";
    const cpc = volData?.cpc ?? 0;
    const traffic_potential = Math.round(volume * 0.3);

    updatedData[slug] = {
      keyword,
      volume,
      kd,
      cpc,
      competition,
      traffic_potential,
      fetched_at: now,
    };

    const currentIndex = overallIndex + i + 1;
    const volFormatted =
      volume >= 1000
        ? `${(volume / 1000).toFixed(1)}K`
        : volume.toString();

    console.log(
      `  ✓ [${currentIndex}/${totalCount}] ${slug} — vol: ${volFormatted} | KD: ${kd} | CPC: $${cpc.toFixed(2)}`
    );
  }

  return updatedData;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { template, limit, refresh } = parseArgs();

  // Validate credentials
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    console.error(
      "Error: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set in .env.local"
    );
    process.exit(1);
  }

  const authHeader = `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;

  // Load existing keyword data
  let existingData: KeywordDataMap = {};
  if (fs.existsSync(KEYWORD_DATA_PATH)) {
    try {
      const raw = fs.readFileSync(KEYWORD_DATA_PATH, "utf8");
      existingData = JSON.parse(raw) as KeywordDataMap;
    } catch {
      existingData = {};
    }
  }

  // Build list of slugs to process
  const templates = template
    ? [template]
    : Object.keys(SEED_SLUGS);

  const allSlugs: Array<{ slug: string; keyword: string; tmpl: string }> = [];

  for (const tmpl of templates) {
    const slugs = SEED_SLUGS[tmpl];
    if (!slugs) {
      console.warn(`Warning: Unknown template "${tmpl}" — skipping`);
      continue;
    }
    for (const slug of slugs) {
      // Skip already-fetched slugs unless --refresh
      if (!refresh && existingData[slug]) {
        continue;
      }
      allSlugs.push({ slug, keyword: slugToKeyword(slug), tmpl });
    }
  }

  // Apply limit
  const slugsToProcess = limit ? allSlugs.slice(0, limit) : allSlugs;
  const totalCount =
    Object.values(SEED_SLUGS)
      .flat()
      .filter((s) => templates.includes(
        Object.keys(SEED_SLUGS).find((t) => SEED_SLUGS[t].includes(s)) ?? ""
      )).length;

  const alreadyDone = totalCount - allSlugs.length;

  console.log(`\nKeyword Data Fetch`);
  console.log(`==================`);
  console.log(`Templates: ${templates.join(", ")}`);
  console.log(`Total seeds in scope: ${totalCount}`);
  console.log(`Already cached: ${alreadyDone}`);
  console.log(`To fetch: ${slugsToProcess.length}${limit ? ` (limited to ${limit})` : ""}`);
  if (refresh) console.log(`Mode: REFRESH (overwriting existing data)`);

  if (slugsToProcess.length === 0) {
    console.log(`\nAll keywords already cached. Use --refresh to re-fetch.`);
    return;
  }

  // Process in batches of 100 (DataForSEO max)
  const BATCH_SIZE = 100;
  let currentData = { ...existingData };
  let processedCount = 0;

  for (let i = 0; i < slugsToProcess.length; i += BATCH_SIZE) {
    const batch = slugsToProcess.slice(i, i + BATCH_SIZE);
    const pairs = batch.map(({ slug, keyword }) => ({ slug, keyword }));

    currentData = await processBatch(
      pairs,
      authHeader,
      currentData,
      processedCount,
      slugsToProcess.length
    );

    processedCount += batch.length;

    // Write after each batch for safety
    fs.writeFileSync(KEYWORD_DATA_PATH, JSON.stringify(currentData, null, 2));
    console.log(`\n  Saved ${processedCount}/${slugsToProcess.length} entries to keyword-data.json`);
  }

  console.log(`\nDone! Processed ${processedCount} keywords.`);
  console.log(`Data saved to: ${KEYWORD_DATA_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", (err as Error).message);
  process.exit(1);
});
