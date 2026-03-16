import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weight Loss Clinics in Canada — Find a Clinic Near You",
  description:
    "Find the best medically supervised weight loss clinics across Canada. Compare programs, pricing, and OHIP coverage by city.",
  alternates: { canonical: "https://weight-loss.ca/clinics" },
};

export default function ClinicsPage() {
  const locationPages = getAllSlugs()
    .filter((s) => s.template === "location-service" || s.template === "location-product")
    .map(({ slug, template }) => ({ slug, record: getContent(template, slug) }))
    .filter((item): item is { slug: string; record: NonNullable<typeof item.record> } => item.record !== null);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]">
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">Clinics &amp; Services</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Weight Loss Clinics &amp; Services in Canada
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            Find the best medically supervised weight loss clinics near you. We cover clinics,
            registered dietitians, bariatric programs, and telehealth services across Canada —
            with honest reviews, pricing, and provincial insurance information.
          </p>
        </header>

        {locationPages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {locationPages.map(({ slug, record }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
                >
                  <span className="mt-1 shrink-0 text-[var(--color-forest-500)]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75 3.75 11.25 9 16.5 9 16.5s5.25-5.25 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5zm0 6.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z" fill="currentColor"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors leading-snug">
                      {getContentTitle(record)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-bark-muted)]">
                      Clinics &amp; Services
                    </p>
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
