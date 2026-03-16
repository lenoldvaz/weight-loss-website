import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";
import type { ProductReview } from "@/data/schemas/index";

export const metadata: Metadata = {
  title: "Weight Loss Product & Program Reviews — Canada 2026",
  description:
    "Expert reviews of weight loss medications, supplements, apps, and programs available in Canada. Honest scores, Canadian pricing, and Health Canada status.",
  alternates: { canonical: "https://weight-loss.ca/reviews" },
};

export default function ReviewsIndexPage() {
  const pages = getAllSlugs()
    .filter((s) => s.template === "product-review")
    .map(({ slug }) => ({ slug, record: getContent("product-review", slug) }))
    .filter((item): item is { slug: string; record: NonNullable<typeof item.record> } => item.record !== null);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]">
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">Reviews</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Weight Loss Reviews for Canadians
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            Evidence-based reviews of weight loss medications, supplements, apps, and programs
            available in Canada — with honest scores, CAD pricing, and Health Canada approval status.
          </p>
        </header>

        {pages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {pages.map(({ slug, record }) => {
              const c = record.content as ProductReview;
              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
                  >
                    {/* Score badge */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${c.overall_score >= 8 ? "bg-[var(--color-forest-600)]" : c.overall_score >= 6 ? "bg-amber-500" : "bg-red-500"}`}>
                      {c.overall_score.toFixed(1)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors leading-snug">
                        {getContentTitle(record)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-bark-muted)]">
                        {c.key_facts.product_type} · {c.key_facts.price_cad}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
