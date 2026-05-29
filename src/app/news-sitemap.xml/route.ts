/**
 * Google News Sitemap — /news-sitemap.xml
 * Serves a valid Google News sitemap for semaglutide articles in Supabase.
 * Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */

export const dynamic = "force-dynamic";

const SITE_BASE = "https://weight-loss.ca";

type NewsRow = {
  id: string;
  title: string;
  published_at: string;
  source: string;
};

function escapeXml(str: string): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const key = serviceKey || anonKey;

  let articles: NewsRow[] = [];
  let debugMsg = "";

  if (!supabaseUrl || !key) {
    debugMsg = `missing-env url=${!!supabaseUrl} key=${!!key}`;
  } else {
    try {
      const endpoint = `${supabaseUrl}/rest/v1/semaglutide_news?select=id,title,published_at,source&order=published_at.desc&limit=500`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json() as NewsRow[];
        articles = Array.isArray(data) ? data : [];
        debugMsg = `ok count=${articles.length}`;
      } else {
        debugMsg = `http-${res.status}`;
      }
    } catch (e) {
      debugMsg = `error:${String(e).slice(0, 80)}`;
    }
  }

  const urls = articles.map((a) => {
    const loc     = `${SITE_BASE}/semaglutide-news`;
    const pubDate = new Date(a.published_at).toISOString();
    const name    = escapeXml((a.source ?? "weight-loss.ca").slice(0, 100));
    const title   = escapeXml((a.title ?? "").slice(0, 200));

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

  void debugMsg; // used during debugging, kept to avoid TS unused-var
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
