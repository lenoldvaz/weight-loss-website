import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const RSS_QUERIES = [
  "generic semaglutide canada",
  "generic ozempic canada",
  "apo-semaglutide canada",
];

type Article = {
  title: string;
  url: string;
  source: string;
  published_at: string | null;
  summary: string | null;
};

function rssUrl(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-CA&gl=CA&ceid=CA:en`;
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return (m?.[1] ?? m?.[2] ?? "").trim();
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"));
  return (m?.[1] ?? "").trim();
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Google News wraps the real URL in a redirect — extract source domain from <source> tag
function parseSource(itemXml: string): string {
  const s = extractTag(itemXml, "source");
  return s || "Unknown";
}

function parseItems(xml: string): Article[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];
  return items.flatMap((item) => {
    const title = stripHtml(extractTag(item, "title"));
    const link = extractTag(item, "link") || extractAttr(item, "link", "href");
    const pubDate = extractTag(item, "pubDate");
    const description = stripHtml(extractTag(item, "description")).slice(0, 400) || null;
    const source = parseSource(item);

    if (!title || !link) return [];

    return [{
      title,
      url: link,
      source,
      published_at: pubDate ? new Date(pubDate).toISOString() : null,
      summary: description,
    }];
  });
}

async function fetchRss(query: string): Promise<Article[]> {
  try {
    const res = await fetch(rssUrl(query), {
      headers: { "User-Agent": "weight-loss.ca news aggregator" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml);
  } catch {
    return [];
  }
}

async function getExistingUrls(): Promise<Set<string>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/semaglutide_news?select=url`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  if (!res.ok) return new Set();
  const rows = (await res.json()) as { url: string }[];
  return new Set(rows.map((r) => r.url));
}

async function insertArticles(articles: Article[]): Promise<number> {
  if (articles.length === 0) return 0;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/semaglutide_news`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify(articles),
  });
  return res.ok ? articles.length : 0;
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch from all RSS sources in parallel
  const allArticles = (await Promise.all(RSS_QUERIES.map(fetchRss))).flat();

  // Deduplicate by URL within this batch
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // Filter out URLs already in Supabase
  const existingUrls = await getExistingUrls();
  const newArticles = unique.filter((a) => !existingUrls.has(a.url));

  const inserted = await insertArticles(newArticles);

  return NextResponse.json({
    ok: true,
    fetched: allArticles.length,
    new: inserted,
    skipped: unique.length - newArticles.length,
  });
}
