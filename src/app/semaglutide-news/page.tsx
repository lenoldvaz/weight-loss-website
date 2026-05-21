import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";
import Link from "next/link";

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
      `${url}/rest/v1/semaglutide_news?order=published_at.desc.nullslast&limit=120`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return (await res.json()) as NewsArticle[];
  } catch {
    return [];
  }
}

// Decode HTML entities and strip tags — handles dirty data from Google News RSS
function cleanText(s: string | null): string {
  if (!s) return "";
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanTitle(title: string, source: string | null): string {
  const t = cleanText(title);
  if (!source) return t;
  return t.replace(new RegExp(`\\s*[-–]\\s*${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "").trim();
}

// Discard summaries that are just Google News redirect links (no real content)
function cleanSummary(summary: string | null): string | null {
  if (!summary) return null;
  const clean = cleanText(summary);
  if (clean.includes("news.google.com") || clean.includes("CBMi") || clean.length < 40) return null;
  return clean.slice(0, 200);
}

function fmtDate(d: string | null) {
  if (!d) return null;
  const date = new Date(d);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function cleanSource(source: string | null): string {
  if (!source) return "News";
  return source.replace(/\s*-\s*(Google News|CA)$/i, "").trim();
}

// Deterministic colour per publication
const SOURCE_COLORS: Record<string, string> = {
  "CBC": "from-red-700 to-red-800",
  "Globe and Mail": "from-blue-800 to-blue-900",
  "The Globe and Mail": "from-blue-800 to-blue-900",
  "Financial Post": "from-red-800 to-rose-900",
  "Reuters": "from-orange-600 to-orange-700",
  "National Post": "from-blue-700 to-blue-800",
  "Global News": "from-slate-700 to-slate-800",
  "CTV News": "from-red-600 to-red-700",
  "Bloomberg": "from-zinc-800 to-zinc-900",
  "CNBC": "from-blue-900 to-indigo-900",
  "MarketWatch": "from-emerald-700 to-emerald-800",
  "BNN Bloomberg": "from-zinc-700 to-zinc-800",
  "CP24": "from-red-700 to-red-800",
  "Toronto Star": "from-red-800 to-red-900",
  "Vancouver Sun": "from-sky-700 to-sky-800",
  "Calgary Herald": "from-amber-700 to-amber-800",
  "Ottawa Citizen": "from-slate-600 to-slate-700",
};

function sourceGradient(source: string | null): string {
  const s = cleanSource(source);
  return SOURCE_COLORS[s] ?? "from-zinc-600 to-zinc-700";
}

function sourceInitial(source: string | null): string {
  const s = cleanSource(source);
  return s.charAt(0).toUpperCase();
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Generic Semaglutide Canada — News & Updates",
  description: "Aggregated Canadian news on generic semaglutide, Apo-Semaglutide, and generic Ozempic. Updated daily.",
  url: "https://weight-loss.ca/semaglutide-news",
};

export default async function SemaglutideNewsPage() {
  const articles = await getArticles();

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-12 pb-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs text-zinc-400 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Updated daily · {articles.length} articles
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl mb-4 tracking-tight">
              Generic Semaglutide News
            </h1>
            <p className="text-zinc-400 text-base max-w-2xl leading-relaxed mb-6">
              Every Canadian news story about generic semaglutide, Apo-Semaglutide, and generic
              Ozempic — aggregated daily from CBC, Global News, Reuters, Financial Post, and more.
            </p>
            <Link
              href="/generic-semaglutide-canada-tracker"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
            >
              ← Price &amp; availability tracker
            </Link>
          </div>
        </section>

        {/* Grid */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {articles.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-zinc-400 text-lg mb-2">No articles yet</p>
                <p className="text-zinc-500 text-sm">The daily fetch runs at 8am ET. Check back tomorrow.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {articles.map((article) => {
                  const source = cleanSource(article.source);
                  const title = cleanTitle(article.title, source);
                  const summary = cleanSummary(article.summary);
                  const date = fmtDate(article.published_at);

                  return (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Publication header */}
                      <div className={`bg-gradient-to-br ${sourceGradient(article.source)} px-4 py-5 flex items-end justify-between`}>
                        <div>
                          <div className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                            {source}
                          </div>
                          <div className="text-white text-3xl font-black leading-none opacity-20 select-none">
                            {sourceInitial(article.source)}
                          </div>
                        </div>
                        {date && (
                          <span className="text-white/50 text-xs font-medium bg-white/10 rounded-full px-2 py-0.5">
                            {date}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-4">
                        <h2 className="font-display text-sm font-bold text-zinc-900 leading-snug group-hover:text-[var(--color-forest-700)] transition-colors mb-2 flex-1">
                          {title}
                        </h2>
                        {summary && (
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mt-1 mb-3">
                            {summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
                          <span className="text-xs text-zinc-400">{source}</span>
                          <span className="text-xs font-semibold text-[var(--color-forest-600)] group-hover:text-[var(--color-forest-700)] transition-colors">
                            Read →
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-lg font-semibold text-zinc-900 mb-4">Related</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { href: "/generic-semaglutide-canada-tracker", title: "Price & Availability Tracker", desc: "Compare every Canadian provider — Hims, Felix, Shoppers, Costco and more." },
                { href: "/generic-semaglutide-canada", title: "Generic Ozempic Explainer", desc: "Full breakdown of Health Canada approvals and what they mean for you." },
                { href: "/how-to-get-generic-semaglutide-in-canada", title: "How to Get Generic Semaglutide", desc: "Step-by-step guide to switching from Ozempic and saving $150+/mo." },
                { href: "/glp1-prices", title: "Full GLP-1 Price Comparison", desc: "Ozempic, Wegovy, Mounjaro, Zepbound — 15+ pharmacies compared." },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all">
                  <div className="font-semibold text-zinc-900 text-sm mb-1">{l.title}</div>
                  <div className="text-zinc-500 text-xs">{l.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
