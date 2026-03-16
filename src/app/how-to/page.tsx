import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weight Loss How-To Guides for Canadians",
  description:
    "Step-by-step weight loss guides written for Canadians. Evidence-based advice on diet, exercise, medications, and lifestyle strategies.",
  alternates: { canonical: "https://weight-loss.ca/how-to" },
};

export default function HowToIndexPage() {
  const pages = getAllSlugs()
    .filter((s) => s.template === "how-to")
    .map(({ slug }) => ({ slug, record: getContent("how-to", slug) }))
    .filter((item): item is { slug: string; record: NonNullable<typeof item.record> } => item.record !== null);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]">
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">How-To Guides</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Weight Loss How-To Guides for Canadians
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            Step-by-step guides written specifically for Canadians — covering diet strategies,
            exercise, medications, and lifestyle changes backed by clinical evidence and Canadian
            health guidelines.
          </p>
        </header>

        {pages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
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
      </main>
      <Footer />
    </>
  );
}
