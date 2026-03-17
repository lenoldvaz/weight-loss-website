import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";
import type { ProductReview } from "@/data/schemas/index";

export const metadata: Metadata = {
  title: "Weight Loss Product & Program Reviews Canada 2026 | weight-loss.ca",
  description:
    "Expert-reviewed weight loss medications, supplements, apps, and programs available in Canada. Honest scores, CAD pricing, Health Canada approval status, and side effect profiles.",
  alternates: { canonical: "https://weight-loss.ca/reviews" },
};

export default function ReviewsIndexPage() {
  const pages = getAllSlugs()
    .filter((s) => s.template === "product-review")
    .map(({ slug }) => ({ slug, record: getContent("product-review", slug) }))
    .filter(
      (item): item is { slug: string; record: NonNullable<typeof item.record> } =>
        item.record !== null
    );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://weight-loss.ca" },
      { "@type": "ListItem", position: 2, name: "Reviews", item: "https://weight-loss.ca/reviews" },
    ],
  };

  const itemListSchema = pages.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Weight Loss Product Reviews — Canada",
        url: "https://weight-loss.ca/reviews",
        numberOfItems: pages.length,
        itemListElement: pages.map(({ slug, record }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: getContentTitle(record),
          url: `https://weight-loss.ca/${slug}`,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {itemListSchema && <JsonLd data={itemListSchema} />}
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]"
        >
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">Reviews</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Weight Loss Reviews for Canadians
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            Evidence-based reviews of weight loss medications, supplements, apps, and programs
            available in Canada — with honest scores, CAD pricing, and Health Canada approval
            status. Reviewed by our registered dietitian and medical team.
          </p>
        </header>

        {/* Review cards */}
        {pages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm mb-12">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 mb-14">
            {pages.map(({ slug, record }) => {
              const c = record.content as ProductReview;
              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
                  >
                    {/* Score badge */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        c.overall_score >= 8
                          ? "bg-[var(--color-forest-600)]"
                          : c.overall_score >= 6
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    >
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

        {/* SEO content */}
        <section className="space-y-5 border-t border-[var(--color-forest-100)] pt-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)]">
            How we review weight loss products
          </h2>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            Every review on weight-loss.ca follows a structured assessment framework.
            Our registered dietitian editor and medical reviewer evaluate each product or
            program across five dimensions:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Clinical evidence", desc: "Peer-reviewed efficacy data and Health Canada approval status" },
              { label: "Canadian access", desc: "Availability by province, prescription requirements, and CAD cost" },
              { label: "Safety profile", desc: "Known side effects, contraindications, and long-term data" },
              { label: "Ease of use", desc: "Adherence rates, support resources, and realistic lifestyle fit" },
              { label: "Value", desc: "Cost-effectiveness compared to alternatives available in Canada" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] p-4"
              >
                <p className="font-semibold text-[var(--color-bark)] text-sm mb-1">{item.label}</p>
                <p className="text-xs text-[var(--color-bark-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--color-bark-muted)]">
            Scores are on a 10-point scale. Products are never paid to be reviewed or
            given a higher score. See our{" "}
            <Link
              href="/editorial-policy"
              className="text-[var(--color-forest-700)] underline underline-offset-2"
            >
              Editorial Policy
            </Link>{" "}
            for full methodology.
          </p>
        </section>

        {/* Cross-links */}
        <section className="mt-10 pt-8 border-t border-[var(--color-forest-100)]">
          <h2 className="font-display text-xl font-semibold text-[var(--color-bark)] mb-4">
            More resources
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/clinics"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              🏥 Find a Clinic
            </Link>
            <Link
              href="/how-to"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              📋 How-To Guides
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              👥 About our team
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
