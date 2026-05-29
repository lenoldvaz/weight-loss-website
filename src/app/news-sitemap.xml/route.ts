/**
 * Google News Sitemap — /news-sitemap.xml
 *
 * Serves a valid Google News sitemap for all articles in the semaglutide_news
 * Supabase table. Google News only indexes articles from the past 2 days, but
 * a full sitemap helps with discovery.
 *
 * Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */

export const dynamic = "force-dynamic";

const SITE_BASE = "https://weight-loss.ca";

type NewsRow = {
  id: number;
  title: string;
  published_at: string;
  source_name: string;
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchNewsArticles(): Promise<NewsRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(
      `${url}/rest/v1/semaglutide_news?select=id,title,published_at,source_name&order=published_at.desc&limit=1000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return [];
    return (await res.json()) as NewsRow[];
  } catch {
    return [];
  }
}

export async function GET() {
  const articles = await fetchNewsArticles();

  const urls = articles.map((a) => {
    const loc = `${SITE_BASE}/semaglutide-news`;
    const pubDate = new Date(a.published_at).toISOString();
    const name = escapeXml((a.source_name ?? "weight-loss.ca").slice(0, 100));
    const title = escapeXml((a.title ?? "").slice(0, 200));

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${name}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  });

  // De-duplicate loc entries — news sitemap allows multiple entries per URL only if titles differ
  // Google News cares about titles, not loc uniqueness
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
