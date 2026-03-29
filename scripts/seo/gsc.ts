#!/usr/bin/env tsx
/**
 * Google Search Console CLI
 * Usage:
 *   npx tsx scripts/seo/gsc.ts coverage          — full coverage/indexing report
 *   npx tsx scripts/seo/gsc.ts inspect <url>     — inspect a specific URL
 *   npx tsx scripts/seo/gsc.ts analytics          — top pages by clicks (last 28 days)
 *   npx tsx scripts/seo/gsc.ts analytics --days=90
 *   npx tsx scripts/seo/gsc.ts sitemaps           — sitemap status
 *   npx tsx scripts/seo/gsc.ts errors             — pages with crawl errors
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as https from "https";

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE_URL = "sc-domain:weight-loss.ca";
const SITE_BASE = "https://weight-loss.ca";
const KEY_PATH =
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ??
  "docs/academic-empire-462216-p6-46948c402fb2.json";

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

// ─── Auth ─────────────────────────────────────────────────────────────────────

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(svc: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(
    Buffer.from(
      JSON.stringify({
        iss: svc.client_email,
        scope: [
          "https://www.googleapis.com/auth/webmasters.readonly",
          "https://www.googleapis.com/auth/webmasters",
        ].join(" "),
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    )
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
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(data); }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function apiPost(token: string, url: string, body: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
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
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(data); }
        });
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

// ─── Commands ─────────────────────────────────────────────────────────────────

async function cmdSitemaps(token: string) {
  console.log("\n📄 SITEMAPS\n" + "─".repeat(60));
  const res = await apiGet(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps`
  ) as { sitemap?: Array<{ path: string; lastSubmitted: string; lastDownloaded: string; isPending: boolean; isSitemapsIndex: boolean; contents?: Array<{ type: string; submitted: string; indexed: string }> }> };

  if (!res.sitemap || res.sitemap.length === 0) {
    console.log("No sitemaps submitted.");
    return;
  }
  for (const sm of res.sitemap) {
    const submitted = sm.contents?.[0]?.submitted ?? "?";
    const indexed = sm.contents?.[0]?.indexed ?? "?";
    console.log(`URL:       ${sm.path}`);
    console.log(`Submitted: ${sm.lastSubmitted?.slice(0, 10)}`);
    console.log(`Downloaded:${sm.lastDownloaded?.slice(0, 10)}`);
    console.log(`Pages submitted: ${submitted}  |  Pages indexed: ${indexed}`);
    console.log();
  }
}

async function cmdAnalytics(token: string, days: number) {
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  console.log(`\n📊 SEARCH ANALYTICS — last ${days} days (${startDate} → ${endDate})\n` + "─".repeat(80));

  const res = await apiPost(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 25,
      orderBy: [{ fieldName: "clicks", sortOrder: "DESCENDING" }],
    }
  ) as { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };

  if (!res.rows || res.rows.length === 0) {
    console.log("No data yet — site may not have any clicks in this period.");
    return;
  }

  const header = `${"Page".padEnd(60)} ${"Clicks".padStart(7)} ${"Impr.".padStart(7)} ${"CTR".padStart(6)} ${"Pos.".padStart(5)}`;
  console.log(header);
  console.log("─".repeat(header.length));

  for (const row of res.rows) {
    const page = row.keys[0].replace("https://weight-loss.ca", "").padEnd(60);
    console.log(
      `${page} ${String(row.clicks).padStart(7)} ${String(row.impressions).padStart(7)} ${(row.ctr * 100).toFixed(1).padStart(5)}% ${row.position.toFixed(1).padStart(5)}`
    );
  }

  // Totals
  const totalClicks = res.rows.reduce((s, r) => s + r.clicks, 0);
  const totalImpr = res.rows.reduce((s, r) => s + r.impressions, 0);
  console.log("─".repeat(header.length));
  console.log(`${"TOTAL (top 25)".padEnd(60)} ${String(totalClicks).padStart(7)} ${String(totalImpr).padStart(7)}`);
}

async function cmdInspect(token: string, pageUrl: string) {
  console.log(`\n🔍 URL INSPECTION: ${pageUrl}\n` + "─".repeat(60));

  const res = await apiPost(
    token,
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      inspectionUrl: pageUrl,
      siteUrl: SITE_URL,
    }
  ) as {
    inspectionResult?: {
      inspectionResultLink?: string;
      indexStatusResult?: {
        verdict: string;
        coverageState: string;
        robotsTxtState: string;
        indexingState: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
        googleCanonical?: string;
        userCanonical?: string;
        crawledAs?: string;
        referringUrls?: string[];
        sitemap?: string[];
      };
      richResultsResult?: { detectedItems?: Array<{ richResultType: string; items?: Array<{ name: string; issues?: Array<{ issueMessage: string; severity: string }> }> }> };
      mobileUsabilityResult?: { verdict: string; issues?: Array<{ issueType: string; severity: string; message: string }> };
    };
    error?: { message: string };
  };

  if (res.error) {
    console.log(`Error: ${res.error.message}`);
    return;
  }

  const r = res.inspectionResult?.indexStatusResult;
  if (!r) { console.log("No result returned."); return; }

  console.log(`Verdict:         ${r.verdict}`);
  console.log(`Coverage state:  ${r.coverageState}`);
  console.log(`Indexing state:  ${r.indexingState}`);
  console.log(`Page fetch:      ${r.pageFetchState ?? "N/A"}`);
  console.log(`Crawled as:      ${r.crawledAs ?? "N/A"}`);
  console.log(`Last crawled:    ${r.lastCrawlTime?.slice(0, 16) ?? "Never"}`);
  console.log(`robots.txt:      ${r.robotsTxtState}`);
  console.log(`User canonical:  ${r.userCanonical ?? "N/A"}`);
  console.log(`Google canonical:${r.googleCanonical ?? "N/A"}`);
  if (r.sitemap?.length) console.log(`Sitemaps:        ${r.sitemap.join(", ")}`);

  const mobile = res.inspectionResult?.mobileUsabilityResult;
  if (mobile) {
    console.log(`\nMobile usability: ${mobile.verdict}`);
    if (mobile.issues?.length) {
      for (const i of mobile.issues) console.log(`  ⚠ ${i.issueType}: ${i.message}`);
    }
  }

  const rich = res.inspectionResult?.richResultsResult;
  if (rich?.detectedItems?.length) {
    console.log(`\nRich results:`);
    for (const item of rich.detectedItems) {
      console.log(`  • ${item.richResultType}`);
      for (const i of item.items ?? []) {
        for (const issue of i.issues ?? []) {
          console.log(`    ⚠ [${issue.severity}] ${issue.issueMessage}`);
        }
      }
    }
  }

  if (res.inspectionResult?.inspectionResultLink) {
    console.log(`\nGSC link: ${res.inspectionResult.inspectionResultLink}`);
  }
}

async function cmdCoverage(token: string) {
  console.log("\n📋 COVERAGE REPORT\n" + "─".repeat(60));

  // Inspect our top priority pages
  const priorityPages = [
    "https://weight-loss.ca/",
    "https://weight-loss.ca/clinics",
    "https://weight-loss.ca/how-to",
    "https://weight-loss.ca/reviews",
    "https://weight-loss.ca/how-to-lose-belly-fat",
    "https://weight-loss.ca/how-to-lose-face-fat",
    "https://weight-loss.ca/how-to-speed-up-metabolism",
    "https://weight-loss.ca/how-to-lose-weight-without-exercise",
    "https://weight-loss.ca/contrave-review",
    "https://weight-loss.ca/dietitians-calgary",
  ];

  const results: Array<{ url: string; verdict: string; state: string; lastCrawl: string }> = [];

  for (const url of priorityPages) {
    process.stdout.write(`  Checking ${url.replace("https://weight-loss.ca", "")}...`);
    try {
      const res = await apiPost(
        token,
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        { inspectionUrl: url, siteUrl: SITE_URL }
      ) as { inspectionResult?: { indexStatusResult?: { verdict: string; coverageState: string; lastCrawlTime?: string } } };

      const r = res.inspectionResult?.indexStatusResult;
      results.push({
        url: url.replace("https://weight-loss.ca", "") || "/",
        verdict: r?.verdict ?? "UNKNOWN",
        state: r?.coverageState ?? "Unknown",
        lastCrawl: r?.lastCrawlTime?.slice(0, 10) ?? "Never",
      });
      console.log(` ${r?.verdict ?? "?"}`);
    } catch {
      results.push({ url, verdict: "ERROR", state: "Error", lastCrawl: "—" });
      console.log(" ERROR");
    }
    // Rate limit: 600 req/min, but be safe
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\n" + "─".repeat(80));
  console.log(`${"URL".padEnd(50)} ${"Verdict".padEnd(12)} ${"State".padEnd(30)} ${"Last Crawl"}`);
  console.log("─".repeat(80));
  for (const r of results) {
    const icon = r.verdict === "PASS" ? "✅" : r.verdict === "FAIL" ? "❌" : "⚠️ ";
    console.log(`${icon} ${r.url.padEnd(48)} ${r.verdict.padEnd(12)} ${r.state.padEnd(30)} ${r.lastCrawl}`);
  }
}

async function cmdErrors(token: string) {
  console.log("\n❌ CRAWL ERRORS\n" + "─".repeat(60));
  // Use search analytics to find pages with impressions but poor position (likely crawl issues)
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10);

  const res = await apiPost(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 50,
      orderBy: [{ fieldName: "impressions", sortOrder: "DESCENDING" }],
    }
  ) as { rows?: Array<{ keys: string[]; clicks: number; impressions: number; position: number }> };

  if (!res.rows || res.rows.length === 0) {
    console.log("No search data yet.");
    return;
  }

  console.log("Pages with impressions but zero clicks (low CTR / ranking issues):\n");
  const lowCtr = res.rows.filter((r) => r.impressions > 5 && r.clicks === 0);
  if (lowCtr.length === 0) {
    console.log("None found — all impression pages have clicks.");
  } else {
    for (const r of lowCtr) {
      console.log(`  ${r.keys[0].replace("https://weight-loss.ca", "")} — ${r.impressions} impressions, pos ${r.position.toFixed(1)}`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] ?? "analytics";

  const svc = loadServiceAccount();
  console.log(`🔑 Authenticating as ${svc.client_email}...`);
  const token = await getAccessToken(svc);
  console.log("✅ Authenticated\n");

  switch (cmd) {
    case "sitemaps":
      await cmdSitemaps(token);
      break;
    case "analytics": {
      const daysArg = args.find((a) => a.startsWith("--days="));
      const days = daysArg ? parseInt(daysArg.split("=")[1]) : 28;
      await cmdAnalytics(token, days);
      break;
    }
    case "inspect": {
      const url = args[1];
      if (!url) { console.error("Usage: gsc.ts inspect <full-url>"); process.exit(1); }
      await cmdInspect(token, url.startsWith("http") ? url : `https://weight-loss.ca/${url}`);
      break;
    }
    case "coverage":
      await cmdCoverage(token);
      break;
    case "errors":
      await cmdErrors(token);
      break;
    default:
      console.log("Commands: analytics, coverage, inspect <url>, sitemaps, errors");
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
