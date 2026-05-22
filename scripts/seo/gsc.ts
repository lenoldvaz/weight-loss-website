#!/usr/bin/env tsx
/**
 * Google Search Console CLI — weight-loss.ca
 *
 * Usage:
 *   npx tsx scripts/seo/gsc.ts report                — full weekly digest
 *   npx tsx scripts/seo/gsc.ts analytics [--days=28] — top pages by clicks
 *   npx tsx scripts/seo/gsc.ts queries  [--days=28]  — top queries + positions
 *   npx tsx scripts/seo/gsc.ts wins                  — pages/queries that moved up this week
 *   npx tsx scripts/seo/gsc.ts check-indexed         — indexing status of key cluster pages
 *   npx tsx scripts/seo/gsc.ts queue                 — Supabase indexing queue stats
 *   npx tsx scripts/seo/gsc.ts coverage              — inspect top priority pages
 *   npx tsx scripts/seo/gsc.ts inspect <url>         — inspect a single URL
 *   npx tsx scripts/seo/gsc.ts sitemaps              — sitemap status
 *   npx tsx scripts/seo/gsc.ts errors                — impressions with zero clicks
 *   npx tsx scripts/seo/gsc.ts index [url]           — submit URL(s) to Indexing API
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as https from "https";

// ─── Config ───────────────────────────────────────────────────────────────────

const SITE_URL  = "sc-domain:weight-loss.ca";
const SITE_BASE = "https://weight-loss.ca";
const KEY_PATH  =
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ??
  "docs/academic-empire-462216-p6-46948c402fb2.json";

// Pages we care most about for the generic semaglutide cluster
const CLUSTER_PAGES = [
  "/generic-semaglutide-canada",
  "/generic-semaglutide-vs-ozempic",
  "/generic-semaglutide-weight-loss-canada",
  "/generic-semaglutide-coverage-by-province",
  "/generic-semaglutide-ontario",
  "/generic-semaglutide-bc",
  "/generic-semaglutide-alberta",
  "/how-to-get-generic-semaglutide-in-canada",
  "/generic-semaglutide-canada-tracker",
];

// ─── Auth ─────────────────────────────────────────────────────────────────────

function loadServiceAccount() {
  const keyPath = path.resolve(process.cwd(), KEY_PATH);
  if (!fs.existsSync(keyPath)) {
    console.error(`Service account JSON not found at: ${keyPath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(keyPath, "utf-8")) as {
    client_email: string;
    private_key: string;
  };
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(svc: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(
    Buffer.from(JSON.stringify({
      iss: svc.client_email,
      scope: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/indexing",
      ].join(" "),
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }))
  );
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = base64url(sign.sign(svc.private_key));
  const jwt = `${header}.${payload}.${sig}`;

  return new Promise((resolve, reject) => {
    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const req = https.request(
      {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          const parsed = JSON.parse(data) as { access_token?: string; error?: string };
          if (parsed.access_token) resolve(parsed.access_token);
          else reject(new Error(`Auth failed: ${JSON.stringify(parsed)}`));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function apiGet(token: string, url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function apiPost(token: string, url: string, body: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(url);
    const bodyStr = JSON.stringify(body);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(bodyStr),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AnalyticsRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
type AnalyticsRes = { rows?: AnalyticsRow[] };

function dateStr(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86400_000).toISOString().slice(0, 10);
}

async function fetchAnalytics(
  token: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 25,
  orderBy = "clicks"
): Promise<AnalyticsRow[]> {
  const res = await apiPost(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    { startDate, endDate, dimensions, rowLimit, orderBy: [{ fieldName: orderBy, sortOrder: "DESCENDING" }] }
  ) as AnalyticsRes;
  return res.rows ?? [];
}

// ─── Commands ─────────────────────────────────────────────────────────────────

async function cmdAnalytics(token: string, days: number) {
  const end   = dateStr(0);
  const start = dateStr(days);
  console.log(`\n📊 TOP PAGES BY CLICKS — last ${days} days (${start} → ${end})\n` + "─".repeat(90));

  const rows = await fetchAnalytics(token, start, end, ["page"], 25, "clicks");
  if (!rows.length) { console.log("No data yet."); return; }

  const header = `${"Page".padEnd(55)} ${"Clicks".padStart(7)} ${"Impr.".padStart(7)} ${"CTR%".padStart(6)} ${"Pos.".padStart(5)}`;
  console.log(header);
  console.log("─".repeat(header.length));
  for (const r of rows) {
    const page = r.keys[0].replace(SITE_BASE, "").padEnd(55) || "/".padEnd(55);
    console.log(`${page} ${String(r.clicks).padStart(7)} ${String(r.impressions).padStart(7)} ${(r.ctr * 100).toFixed(1).padStart(5)}% ${r.position.toFixed(1).padStart(5)}`);
  }
  const tc = rows.reduce((s, r) => s + r.clicks, 0);
  const ti = rows.reduce((s, r) => s + r.impressions, 0);
  console.log("─".repeat(header.length));
  console.log(`${"TOTAL (top 25)".padEnd(55)} ${String(tc).padStart(7)} ${String(ti).padStart(7)}`);
}

async function cmdQueries(token: string, days: number) {
  const end   = dateStr(0);
  const start = dateStr(days);
  console.log(`\n🔎 TOP QUERIES — last ${days} days (${start} → ${end})\n` + "─".repeat(90));

  const rows = await fetchAnalytics(token, start, end, ["query"], 30, "impressions");
  if (!rows.length) { console.log("No data yet."); return; }

  const header = `${"Query".padEnd(55)} ${"Clicks".padStart(7)} ${"Impr.".padStart(7)} ${"CTR%".padStart(6)} ${"Pos.".padStart(5)}`;
  console.log(header);
  console.log("─".repeat(header.length));
  for (const r of rows) {
    const q = r.keys[0].padEnd(55);
    const pos = r.position.toFixed(1);
    const flag = r.position <= 3 ? " 🏆" : r.position <= 10 ? " ✅" : r.position <= 20 ? " 📈" : "";
    console.log(`${q} ${String(r.clicks).padStart(7)} ${String(r.impressions).padStart(7)} ${(r.ctr * 100).toFixed(1).padStart(5)}% ${pos.padStart(5)}${flag}`);
  }
}

async function cmdWins(token: string) {
  console.log("\n🏆 WINS — pages & queries that moved up this week vs last week\n" + "─".repeat(80));

  // This week: days 0–7 | Last week: days 7–14
  const [pwThis, pwLast] = await Promise.all([
    fetchAnalytics(token, dateStr(7),  dateStr(0),  ["page"],  50, "impressions"),
    fetchAnalytics(token, dateStr(14), dateStr(7),  ["page"],  50, "impressions"),
  ]);
  const [qwThis, qwLast] = await Promise.all([
    fetchAnalytics(token, dateStr(7),  dateStr(0),  ["query"], 50, "impressions"),
    fetchAnalytics(token, dateStr(14), dateStr(7),  ["query"], 50, "impressions"),
  ]);

  function compareRows(thisWeek: AnalyticsRow[], lastWeek: AnalyticsRow[], keyLabel: string) {
    const lastMap = new Map(lastWeek.map((r) => [r.keys[0], r]));
    const moves: Array<{ key: string; posDelta: number; clickDelta: number; posNow: number }> = [];

    for (const r of thisWeek) {
      const prev = lastMap.get(r.keys[0]);
      if (!prev) continue;
      const posDelta = prev.position - r.position; // positive = moved up
      const clickDelta = r.clicks - prev.clicks;
      if (posDelta >= 0.5 || clickDelta > 0) {
        moves.push({ key: r.keys[0], posDelta, clickDelta, posNow: r.position });
      }
    }
    moves.sort((a, b) => b.posDelta - a.posDelta);

    if (!moves.length) { console.log(`  No significant ${keyLabel} movement this week.`); return; }

    console.log(`\n${keyLabel} movers:`);
    const header = `  ${"Key".padEnd(55)} ${"Pos↑".padStart(7)} ${"Now".padStart(5)} ${"Clicks+".padStart(8)}`;
    console.log(header);
    console.log("  " + "─".repeat(header.length - 2));
    for (const m of moves.slice(0, 15)) {
      const key  = m.key.replace(SITE_BASE, "").padEnd(55) || "/".padEnd(55);
      const delta = m.posDelta > 0 ? `+${m.posDelta.toFixed(1)}` : m.posDelta.toFixed(1);
      const clicks = m.clickDelta > 0 ? `+${m.clickDelta}` : String(m.clickDelta);
      console.log(`  ${key} ${delta.padStart(7)} ${m.posNow.toFixed(1).padStart(5)} ${clicks.padStart(8)}`);
    }
  }

  compareRows(pwThis, pwLast, "📄 Page");
  compareRows(qwThis, qwLast, "🔎 Query");

  // Also surface any new pages appearing for the first time
  const lastPageSet = new Set(pwLast.map((r) => r.keys[0]));
  const newAppearances = pwThis.filter((r) => !lastPageSet.has(r.keys[0]) && r.impressions > 0);
  if (newAppearances.length) {
    console.log("\n🆕 New pages with impressions (appeared this week):");
    for (const r of newAppearances) {
      console.log(`  ${r.keys[0].replace(SITE_BASE, "")} — ${r.impressions} impressions, pos ${r.position.toFixed(1)}`);
    }
  }
}

async function cmdCheckIndexed(token: string) {
  console.log("\n🔍 GENERIC SEMAGLUTIDE CLUSTER — indexing status\n" + "─".repeat(70));

  const results: Array<{ slug: string; verdict: string; state: string; lastCrawl: string; canonicalOk: boolean }> = [];

  for (const slug of CLUSTER_PAGES) {
    const url = `${SITE_BASE}${slug}`;
    process.stdout.write(`  Checking ${slug}...`);
    try {
      const res = await apiPost(
        token,
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        { inspectionUrl: url, siteUrl: SITE_URL }
      ) as {
        inspectionResult?: {
          indexStatusResult?: {
            verdict: string;
            coverageState: string;
            lastCrawlTime?: string;
            googleCanonical?: string;
            userCanonical?: string;
          };
        };
      };

      const r = res.inspectionResult?.indexStatusResult;
      const canonicalOk = !r?.googleCanonical || r.googleCanonical === url;
      results.push({
        slug,
        verdict: r?.verdict ?? "UNKNOWN",
        state: r?.coverageState ?? "Unknown",
        lastCrawl: r?.lastCrawlTime?.slice(0, 10) ?? "Never",
        canonicalOk,
      });
      const icon = r?.verdict === "PASS" ? "✅" : r?.verdict === "NEUTRAL" ? "⏳" : "⚠️";
      console.log(` ${icon} ${r?.verdict ?? "UNKNOWN"} — ${r?.coverageState ?? ""}`);
    } catch {
      results.push({ slug, verdict: "ERROR", state: "Error", lastCrawl: "—", canonicalOk: true });
      console.log(" ❌ ERROR");
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const indexed    = results.filter((r) => r.verdict === "PASS").length;
  const notIndexed = results.filter((r) => r.verdict !== "PASS").length;
  console.log(`\n  ${indexed}/${results.length} pages indexed | ${notIndexed} pending or not indexed`);

  const notOk = results.filter((r) => !r.canonicalOk);
  if (notOk.length) {
    console.log("\n⚠️  Canonical mismatch on:");
    for (const r of notOk) console.log(`    ${r.slug}`);
  }
}

async function cmdQueue() {
  console.log("\n📬 INDEXING QUEUE — Supabase\n" + "─".repeat(60));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Fall back to reading .env.local
    try {
      const env = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
      const getVar = (name: string) => env.match(new RegExp(`^${name}=(.+)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
      const supaUrl = getVar("NEXT_PUBLIC_SUPABASE_URL");
      const supaKey = getVar("SUPABASE_SERVICE_ROLE_KEY");
      if (!supaUrl || !supaKey) throw new Error("missing vars");
      return cmdQueueFetch(supaUrl, supaKey);
    } catch {
      console.log("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use this command.");
      return;
    }
  }
  return cmdQueueFetch(url, key);
}

async function cmdQueueFetch(supaUrl: string, supaKey: string) {
  const statuses = ["pending", "submitted", "failed"] as const;
  const counts: Record<string, number> = {};

  for (const status of statuses) {
    const res = await new Promise<{ count: number }>((resolve) => {
      const req = https.request(
        {
          hostname: new URL(supaUrl).hostname,
          path: `/rest/v1/indexing_queue?status=eq.${status}&select=url`,
          method: "HEAD",
          headers: {
            apikey: supaKey,
            Authorization: `Bearer ${supaKey}`,
            Prefer: "count=exact",
          },
        },
        (r) => {
          const range = r.headers["content-range"] ?? "";
          const total = parseInt(range.split("/")[1] ?? "0");
          resolve({ count: isNaN(total) ? 0 : total });
          r.resume();
        }
      );
      req.on("error", () => resolve({ count: 0 }));
      req.end();
    });
    counts[status] = res.count;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`  Total URLs in queue: ${total}`);
  console.log(`  ⏳ Pending:          ${counts.pending}`);
  console.log(`  ✅ Submitted:        ${counts.submitted}`);
  console.log(`  ❌ Failed:           ${counts.failed}`);

  const daysLeft = Math.ceil((counts.pending ?? 0) / 10);
  if (daysLeft > 0) {
    console.log(`\n  At 10/day, queue drains in ~${daysLeft} more day${daysLeft !== 1 ? "s" : ""}.`);
  } else {
    console.log("\n  ✅ Queue is empty — all URLs have been submitted.");
  }

  // Show last 5 submitted
  const recentRes: unknown = await new Promise((resolve) => {
    const req = https.request(
      {
        hostname: new URL(supaUrl).hostname,
        path: `/rest/v1/indexing_queue?status=eq.submitted&select=url,submitted_at&order=submitted_at.desc&limit=5`,
        method: "GET",
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
        },
      },
      (r) => {
        let data = "";
        r.on("data", (c) => (data += c));
        r.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve([]); } });
      }
    );
    req.on("error", () => resolve([]));
    req.end();
  });

  const recent = recentRes as Array<{ url: string; submitted_at: string }>;
  if (recent.length) {
    console.log("\n  Recent submissions:");
    for (const r of recent) {
      console.log(`    ${r.submitted_at.slice(0, 16)} UTC — ${r.url.replace(SITE_BASE, "")}`);
    }
  }
}

async function cmdReport(token: string) {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`\n${"═".repeat(80)}`);
  console.log(`  📋  WEIGHT-LOSS.CA — SEO WEEKLY REPORT  (${today})`);
  console.log(`${"═".repeat(80)}`);

  // Run all sections
  await cmdAnalytics(token, 7);
  await cmdQueries(token, 7);
  await cmdWins(token);
  await cmdCheckIndexed(token);
  await cmdQueue();
  await cmdSitemaps(token);

  console.log(`\n${"═".repeat(80)}\n`);
}

async function cmdSitemaps(token: string) {
  console.log("\n📄 SITEMAPS\n" + "─".repeat(60));
  const res = await apiGet(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps`
  ) as {
    sitemap?: Array<{
      path: string;
      lastSubmitted: string;
      lastDownloaded: string;
      isPending: boolean;
      contents?: Array<{ type: string; submitted: string; indexed: string }>;
    }>;
  };

  if (!res.sitemap?.length) { console.log("No sitemaps submitted."); return; }
  for (const sm of res.sitemap) {
    const submitted = sm.contents?.[0]?.submitted ?? "?";
    const indexed   = sm.contents?.[0]?.indexed   ?? "?";
    console.log(`URL:       ${sm.path}`);
    console.log(`Submitted: ${sm.lastSubmitted?.slice(0, 10)}  |  Downloaded: ${sm.lastDownloaded?.slice(0, 10)}`);
    console.log(`Pages — submitted: ${submitted}  |  indexed: ${indexed}`);
    console.log();
  }
}

async function cmdInspect(token: string, pageUrl: string) {
  console.log(`\n🔍 URL INSPECTION: ${pageUrl}\n` + "─".repeat(60));
  const res = await apiPost(
    token,
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    { inspectionUrl: pageUrl, siteUrl: SITE_URL }
  ) as {
    inspectionResult?: {
      inspectionResultLink?: string;
      indexStatusResult?: {
        verdict: string; coverageState: string; robotsTxtState: string;
        indexingState: string; lastCrawlTime?: string; pageFetchState?: string;
        googleCanonical?: string; userCanonical?: string; crawledAs?: string;
        referringUrls?: string[]; sitemap?: string[];
      };
      richResultsResult?: { detectedItems?: Array<{ richResultType: string; items?: Array<{ name: string; issues?: Array<{ issueMessage: string; severity: string }> }> }> };
      mobileUsabilityResult?: { verdict: string; issues?: Array<{ issueType: string; severity: string; message: string }> };
    };
    error?: { message: string };
  };

  if (res.error) { console.log(`Error: ${res.error.message}`); return; }

  const r = res.inspectionResult?.indexStatusResult;
  if (!r) { console.log("No result returned."); return; }

  console.log(`Verdict:          ${r.verdict}`);
  console.log(`Coverage state:   ${r.coverageState}`);
  console.log(`Indexing state:   ${r.indexingState}`);
  console.log(`Page fetch:       ${r.pageFetchState ?? "N/A"}`);
  console.log(`Crawled as:       ${r.crawledAs ?? "N/A"}`);
  console.log(`Last crawled:     ${r.lastCrawlTime?.slice(0, 16) ?? "Never"}`);
  console.log(`robots.txt:       ${r.robotsTxtState}`);
  console.log(`User canonical:   ${r.userCanonical ?? "N/A"}`);
  console.log(`Google canonical: ${r.googleCanonical ?? "N/A"}`);
  if (r.sitemap?.length) console.log(`Sitemaps:         ${r.sitemap.join(", ")}`);

  const mobile = res.inspectionResult?.mobileUsabilityResult;
  if (mobile) {
    console.log(`\nMobile usability: ${mobile.verdict}`);
    for (const i of mobile.issues ?? []) console.log(`  ⚠ ${i.issueType}: ${i.message}`);
  }

  const rich = res.inspectionResult?.richResultsResult;
  if (rich?.detectedItems?.length) {
    console.log(`\nRich results:`);
    for (const item of rich.detectedItems) {
      console.log(`  • ${item.richResultType}`);
      for (const i of item.items ?? [])
        for (const issue of i.issues ?? [])
          console.log(`    ⚠ [${issue.severity}] ${issue.issueMessage}`);
    }
  }

  if (res.inspectionResult?.inspectionResultLink)
    console.log(`\nGSC link: ${res.inspectionResult.inspectionResultLink}`);
}

async function cmdCoverage(token: string) {
  console.log("\n📋 COVERAGE — top priority pages\n" + "─".repeat(80));

  const priorityPages = [
    `${SITE_BASE}/`,
    `${SITE_BASE}/generic-semaglutide-canada`,
    `${SITE_BASE}/glp1-prices`,
    `${SITE_BASE}/generic-semaglutide-canada-tracker`,
    `${SITE_BASE}/ozempic-review`,
    `${SITE_BASE}/wegovy-review`,
    `${SITE_BASE}/contrave-review`,
    `${SITE_BASE}/how-to-lose-belly-fat`,
    `${SITE_BASE}/coverage-checker`,
    `${SITE_BASE}/telehealth`,
  ];

  const results: Array<{ url: string; verdict: string; state: string; lastCrawl: string }> = [];

  for (const url of priorityPages) {
    process.stdout.write(`  Checking ${url.replace(SITE_BASE, "") || "/"}...`);
    try {
      const res = await apiPost(
        token,
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        { inspectionUrl: url, siteUrl: SITE_URL }
      ) as { inspectionResult?: { indexStatusResult?: { verdict: string; coverageState: string; lastCrawlTime?: string } } };
      const r = res.inspectionResult?.indexStatusResult;
      results.push({ url: url.replace(SITE_BASE, "") || "/", verdict: r?.verdict ?? "UNKNOWN", state: r?.coverageState ?? "Unknown", lastCrawl: r?.lastCrawlTime?.slice(0, 10) ?? "Never" });
      console.log(` ${r?.verdict ?? "?"}`);
    } catch {
      results.push({ url, verdict: "ERROR", state: "Error", lastCrawl: "—" });
      console.log(" ERROR");
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\n" + "─".repeat(80));
  console.log(`${"URL".padEnd(50)} ${"Verdict".padEnd(12)} ${"State".padEnd(30)} Last Crawl`);
  console.log("─".repeat(80));
  for (const r of results) {
    const icon = r.verdict === "PASS" ? "✅" : r.verdict === "FAIL" ? "❌" : "⚠️ ";
    console.log(`${icon} ${r.url.padEnd(48)} ${r.verdict.padEnd(12)} ${r.state.padEnd(30)} ${r.lastCrawl}`);
  }
}

async function cmdSitemapResubmit(token: string) {
  console.log("\n📤 RESUBMITTING SITEMAP\n" + "─".repeat(60));
  const siteEnc = encodeURIComponent(SITE_URL);
  const smEnc   = encodeURIComponent(`${SITE_BASE}/sitemap.xml`);
  const res = await new Promise<{ status: number }>((resolve, reject) => {
    const req = https.request(
      {
        hostname: "www.googleapis.com",
        path: `/webmasters/v3/sites/${siteEnc}/sitemaps/${smEnc}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Length": 0 },
      },
      (r) => { resolve({ status: r.statusCode ?? 0 }); r.resume(); }
    );
    req.on("error", reject);
    req.end();
  });
  if (res.status === 204) {
    console.log(`  ✅ Sitemap resubmitted — Google will re-download ${SITE_BASE}/sitemap.xml shortly.`);
  } else {
    console.log(`  ❌ Unexpected status: ${res.status}`);
  }
}

async function cmdErrors(token: string) {
  console.log("\n❌ IMPRESSIONS WITH ZERO CLICKS (last 28 days)\n" + "─".repeat(70));
  const rows = await fetchAnalytics(token, dateStr(28), dateStr(0), ["page"], 50, "impressions");
  if (!rows.length) { console.log("No search data yet."); return; }
  const lowCtr = rows.filter((r) => r.impressions > 5 && r.clicks === 0);
  if (!lowCtr.length) { console.log("None — all impression pages have clicks."); return; }
  for (const r of lowCtr) {
    console.log(`  ${r.keys[0].replace(SITE_BASE, "").padEnd(60)} ${r.impressions} impr, pos ${r.position.toFixed(1)}`);
  }
}

const NEW_PAGES = [
  `${SITE_BASE}/glp1-prices`,
  `${SITE_BASE}/coverage-checker`,
  `${SITE_BASE}/savings-cards`,
  `${SITE_BASE}/telehealth`,
  `${SITE_BASE}/semaglutide-news`,
  `${SITE_BASE}/generic-semaglutide-canada-tracker`,
  `${SITE_BASE}/generic-semaglutide-canada`,
  `${SITE_BASE}/how-to-get-generic-semaglutide-in-canada`,
  `${SITE_BASE}/generic-semaglutide-vs-ozempic`,
  `${SITE_BASE}/generic-semaglutide-weight-loss-canada`,
  `${SITE_BASE}/generic-semaglutide-coverage-by-province`,
  `${SITE_BASE}/generic-semaglutide-ontario`,
  `${SITE_BASE}/generic-semaglutide-bc`,
  `${SITE_BASE}/generic-semaglutide-alberta`,
];

async function cmdIndex(token: string, urls: string[]) {
  console.log(`\n🚀 INDEXING REQUESTS — ${urls.length} URL(s)\n` + "─".repeat(60));
  let ok = 0, failed = 0;
  for (const url of urls) {
    process.stdout.write(`  Submitting ${url.replace(SITE_BASE, "")}...`);
    try {
      const res = await apiPost(
        token,
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        { url, type: "URL_UPDATED" }
      ) as { urlNotificationMetadata?: { latestUpdate?: { notifyTime: string } }; error?: { message: string; status: string } };

      if (res.error) {
        console.log(` ❌ ${res.error.status}: ${res.error.message}`);
        failed++;
      } else {
        console.log(` ✅ ${res.urlNotificationMetadata?.latestUpdate?.notifyTime?.slice(0, 19) ?? "submitted"}`);
        ok++;
      }
    } catch (e) {
      console.log(` ❌ ${e}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\n${"─".repeat(60)}\n✅ Submitted: ${ok}  ❌ Failed: ${failed}`);
  if (ok > 0) console.log("\nGoogle typically crawls submitted URLs within 24–48 hours.");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd  = args[0] ?? "report";

  // Queue command doesn't need GSC auth
  if (cmd === "queue") {
    await cmdQueue();
    return;
  }

  const svc = loadServiceAccount();
  console.log(`🔑 Authenticating as ${svc.client_email}...`);
  const token = await getAccessToken(svc);
  console.log("✅ Authenticated");

  const daysArg = args.find((a) => a.startsWith("--days="));
  const days    = daysArg ? parseInt(daysArg.split("=")[1]) : 28;

  switch (cmd) {
    case "report":
      await cmdReport(token);
      break;
    case "analytics":
      await cmdAnalytics(token, days);
      break;
    case "queries":
      await cmdQueries(token, days);
      break;
    case "wins":
      await cmdWins(token);
      break;
    case "check-indexed":
      await cmdCheckIndexed(token);
      break;
    case "sitemaps":
      await cmdSitemaps(token);
      break;
    case "coverage":
      await cmdCoverage(token);
      break;
    case "errors":
      await cmdErrors(token);
      break;
    case "inspect": {
      const url = args[1];
      if (!url) { console.error("Usage: gsc.ts inspect <url>"); process.exit(1); }
      await cmdInspect(token, url.startsWith("http") ? url : `${SITE_BASE}/${url}`);
      break;
    }
    case "sitemap-resubmit":
      await cmdSitemapResubmit(token);
      break;
    case "index": {
      const urlArg = args[1];
      await cmdIndex(token, urlArg
        ? [urlArg.startsWith("http") ? urlArg : `${SITE_BASE}/${urlArg}`]
        : NEW_PAGES
      );
      break;
    }
    default:
      console.log("Commands: report | analytics | queries | wins | check-indexed | queue | coverage | inspect <url> | sitemaps | sitemap-resubmit | errors | index [url]");
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
