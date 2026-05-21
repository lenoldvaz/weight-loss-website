import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Generic Semaglutide Canada — News & Updates (2026)",
  description:
    "Latest Canadian news on generic semaglutide and generic Ozempic — Health Canada approvals, pharmacy launches, pricing updates, and coverage decisions. Updated daily.",
  alternates: { canonical: "https://weight-loss.ca/semaglutide-news" },
};

type NewsArticle = {
  id: string;
  title: string;
  url: string;
  source: string | null;
  published_at: string | null;
  summary: string | null;
  fetched_at: string;
};

async function getArticles(): Promise<NewsArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(
      `${url}/rest/v1/semaglutide_news?order=published_at.desc.nullslast&limit=100`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as NewsArticle[];
  } catch {
    return [];
  }
}

function fmtDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function relativeDate(d: string | null): string {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return fmtDate(d) ?? "";
}

// Strip Google News redirect to get a clean source label
function cleanSource(source: string | null): string {
  if (!source) return "News";
  return source.replace(/\s*-\s*(Google News|CA)$/i, "").trim();
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Generic Semaglutide Canada — News & Updates",
  description:
    "Aggregated Canadian news on generic semaglutide, Apo-Semaglutide, and generic Ozempic. Updated daily.",
  url: "https://weight-loss.ca/semaglutide-news",
};

export default async function SemaglutideNewsPage() {
  const articles = await getArticles();

  const grouped = articles.reduce<Record<string, NewsArticle[]>>((acc, a) => {
    const key = fmtDate(a.published_at) ?? "Unknown date";
    (acc[key] ??= []).push(a);
    return acc;
  }, {});

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-700 font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
              Updated daily
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Generic Semaglutide Canada — News &amp; Updates
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Every Canadian news story about generic semaglutide, Apo-Semaglutide, and generic
              Ozempic — aggregated daily from CBC, Global News, BNN Bloomberg, and more.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2">
                <span className="font-bold text-slate-900">{articles.length}</span>
                <span className="text-slate-500 ml-1">articles tracked</span>
              </div>
              <a
                href="/generic-semaglutide-canada-tracker"
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-600 hover:border-slate-300 transition-colors"
              >
                ← Price &amp; availability tracker
              </a>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg mb-2">No articles yet</p>
              <p className="text-slate-400 text-sm">
                The daily fetch runs at 8am ET. Check back tomorrow or{" "}
                <a href="/api/cron/fetch-news" className="underline">trigger a manual fetch</a>.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {date}
                    </h2>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="space-y-3">
                    {items.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom links */}
        <section className="border-t border-slate-100 bg-slate-50 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Related</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: "/generic-semaglutide-canada-tracker", title: "Price & Availability Tracker", desc: "Compare every Canadian provider — Hims, Felix, Shoppers, Costco and more." },
                { href: "/generic-semaglutide-canada", title: "Generic Ozempic Explainer", desc: "Full breakdown of the Health Canada approvals and what they mean for you." },
                { href: "/how-to-get-generic-semaglutide-in-canada", title: "How to Get Generic Semaglutide", desc: "Step-by-step guide to switching from Ozempic and saving $150+/mo." },
                { href: "/ozempic-review", title: "Ozempic Review (Canada)", desc: "In-depth review of brand-name semaglutide for weight loss." },
              ].map((l) => (
                <a key={l.href} href={l.href} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-white transition-colors">
                  <div className="font-medium text-slate-900 text-sm mb-1">{l.title}</div>
                  <div className="text-slate-500 text-xs">{l.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const source = cleanSource(article.source);
  const age = relativeDate(article.published_at);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {source}
            </span>
            {age && (
              <span className="text-xs text-slate-400">{age}</span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-[var(--color-forest-700)] transition-colors mb-1">
            {article.title}
          </h3>
          {article.summary && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
        <span className="shrink-0 text-slate-300 group-hover:text-slate-500 transition-colors text-lg mt-0.5">
          →
        </span>
      </div>
    </a>
  );
}
