#!/usr/bin/env tsx
/**
 * Seed the Supabase indexing_queue table from the live sitemap.
 * Safe to re-run — uses upsert with ignore-duplicates so existing rows aren't touched.
 *
 * Usage:
 *   npx tsx scripts/seo/seed-indexing-queue.ts
 *   npx tsx scripts/seo/seed-indexing-queue.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITEMAP_URL = "https://weight-loss.ca/sitemap.xml";
const DRY_RUN = process.argv.includes("--dry-run");

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

async function fetchSitemapUrls(): Promise<string[]> {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) ?? [];
  return matches.map((m) => m.replace(/<\/?loc>/g, "").trim());
}

async function insertUrls(urls: string[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const rows = urls.map((url) => ({ url, status: "pending" }));

  const res = await fetch(`${supabaseUrl}/rest/v1/indexing_queue`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${text}`);
  }

  return rows.length;
}

async function getQueueStats() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const res = await fetch(`${supabaseUrl}/rest/v1/indexing_queue?select=status`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) return;
  const rows = await res.json() as Array<{ status: string }>;
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  console.log("\nQueue stats after seed:");
  for (const [status, count] of Object.entries(counts)) {
    console.log(`  ${status}: ${count}`);
  }
  console.log(`  TOTAL: ${rows.length}`);
  const days = Math.ceil((counts["pending"] ?? 0) / 10);
  if (days > 0) console.log(`\n→ At 10/day, queue clears in ~${days} days`);
}

async function main() {
  await loadEnv();

  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap`);

  if (DRY_RUN) {
    console.log("\n[Dry run] Would insert:");
    urls.forEach((u) => console.log(`  ${u}`));
    return;
  }

  console.log(`Inserting ${urls.length} URLs into indexing_queue (skipping duplicates)...`);
  const count = await insertUrls(urls);
  console.log(`✅ Done — ${count} rows sent (duplicates ignored)`);

  await getQueueStats();
  console.log("\nCron will submit 10 URLs/day automatically.");
  console.log("To trigger manually: curl -H \"Authorization: Bearer $CRON_SECRET\" https://weight-loss.ca/api/cron/index-urls");
}

main().catch((err) => { console.error(err); process.exit(1); });
