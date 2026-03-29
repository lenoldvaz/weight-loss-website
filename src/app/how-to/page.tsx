import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weight Loss How-To Guides for Canadians | weight-loss.ca",
  description:
    "Step-by-step weight loss guides for Canadians — covering GLP-1 medications, calorie deficit, intermittent fasting, exercise, and navigating provincial health programs.",
  alternates: { canonical: "https://weight-loss.ca/how-to" },
};

export default function HowToIndexPage() {
  const pages = getAllSlugs()
    .filter((s) => s.template === "how-to")
    .map(({ slug }) => ({ slug, record: getContent("how-to", slug) }))
    .filter(
      (item): item is { slug: string; record: NonNullable<typeof item.record> } =>
        item.record !== null
    );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://weight-loss.ca" },
      { "@type": "ListItem", position: 2, name: "How-To Guides", item: "https://weight-loss.ca/how-to" },
    ],
  };

  const itemListSchema = pages.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Weight Loss How-To Guides for Canadians",
        url: "https://weight-loss.ca/how-to",
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
          <span className="text-[var(--color-bark-soft)]">How-To Guides</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Weight Loss How-To Guides for Canadians
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            Step-by-step guides written specifically for Canadians — covering diet strategies,
            exercise, medications, and lifestyle changes backed by clinical evidence and
            Canadian health guidelines. Reviewed by our registered dietitian team.
          </p>
        </header>

        {/* Guide cards */}
        {pages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm mb-12">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 mb-14">
            {pages.map(({ slug, record }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
                >
                  <span className="mt-1 shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-700)] text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors leading-snug">
                      {getContentTitle(record)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-bark-muted)]">How-To Guide</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* SEO content */}
        <section className="space-y-5 border-t border-[var(--color-forest-100)] pt-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)]">
            Weight loss guidance built for Canada
          </h2>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            Generic weight loss advice often misses the Canadian context — provincial drug
            coverage, availability of GLP-1 medications through provincial programs, OHIP
            eligibility for bariatric surgery, and which supplements are actually approved
            by Health Canada.
          </p>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            Every guide on this page is written with Canadian healthcare systems in mind —
            including references to Health Canada guidelines, the Canadian Obesity Network's
            clinical practice recommendations, and provincial health program eligibility.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: "💊", title: "Medications", desc: "GLP-1 agonists, appetite suppressants, and what's available by prescription in Canada" },
              { emoji: "🥗", title: "Diet strategies", desc: "Calorie deficit, low-carb, intermittent fasting — what the evidence actually says" },
              { emoji: "🏃", title: "Exercise", desc: "How much exercise you actually need and how to fit it into a Canadian lifestyle" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] p-4"
              >
                <p className="text-2xl mb-2">{item.emoji}</p>
                <p className="font-semibold text-[var(--color-bark)] text-sm mb-1">{item.title}</p>
                <p className="text-xs text-[var(--color-bark-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
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
              href="/reviews"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              💊 Program Reviews
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              📋 Editorial Standards
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
