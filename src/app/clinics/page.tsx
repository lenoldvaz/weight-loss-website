import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { getAllSlugs, getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weight Loss Clinics in Canada — Find a Clinic Near You | weight-loss.ca",
  description:
    "Find medically supervised weight loss clinics across Canada. Compare programs, pricing, and provincial coverage in Toronto, Vancouver, Calgary, Ottawa, and more.",
  alternates: { canonical: "https://weight-loss.ca/clinics" },
};

export default function ClinicsPage() {
  const locationPages = getAllSlugs()
    .filter((s) => s.template === "location-service" || s.template === "location-product")
    .map(({ slug, template }) => ({ slug, record: getContent(template, slug) }))
    .filter(
      (item): item is { slug: string; record: NonNullable<typeof item.record> } =>
        item.record !== null
    );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://weight-loss.ca" },
      { "@type": "ListItem", position: 2, name: "Clinics & Services", item: "https://weight-loss.ca/clinics" },
    ],
  };

  const itemListSchema = locationPages.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Weight Loss Clinics in Canada",
        url: "https://weight-loss.ca/clinics",
        numberOfItems: locationPages.length,
        itemListElement: locationPages.map(({ slug, record }, i) => ({
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

        {/* Page grid */}
        {locationPages.length === 0 ? (
          <p className="text-[var(--color-bark-muted)] text-sm mb-12">
            Content coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 mb-14">
            {locationPages.map(({ slug, record }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
                >
                  <span className="mt-1 shrink-0 text-[var(--color-forest-500)]">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path
                        d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75 3.75 11.25 9 16.5 9 16.5s5.25-5.25 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5zm0 6.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z"
                        fill="currentColor"
                      />
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

        {/* SEO content section */}
        <section className="space-y-6 border-t border-[var(--color-forest-100)] pt-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)]">
            Finding the right weight loss clinic in Canada
          </h2>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            Canada has a growing network of medically supervised weight loss programs —
            from primary care physicians offering GLP-1 prescriptions to full bariatric
            surgery programs at major teaching hospitals. The right clinic for you depends
            on your health history, your goals, and your provincial coverage.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] p-5">
              <h3 className="font-semibold text-[var(--color-bark)] mb-2">
                What to look for in a clinic
              </h3>
              <ul className="text-sm text-[var(--color-bark-soft)] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">✓</span>
                  Physician or registered dietitian on staff
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">✓</span>
                  Evidence-based protocols (not fad programs)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">✓</span>
                  Transparent pricing and billing in CAD
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">✓</span>
                  Provincial OHIP/MSP/AHCIP coverage where applicable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">✓</span>
                  Long-term maintenance support
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] p-5">
              <h3 className="font-semibold text-[var(--color-bark)] mb-2">
                Types of programs we cover
              </h3>
              <ul className="text-sm text-[var(--color-bark-soft)] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">→</span>
                  GLP-1 medication clinics (Wegovy, Ozempic, Saxenda)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">→</span>
                  Registered dietitian practices
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">→</span>
                  Bariatric surgery programs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">→</span>
                  Telehealth weight management services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-forest-600)] mt-0.5">→</span>
                  Hospital obesity medicine clinics
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="mt-10 pt-8 border-t border-[var(--color-forest-100)]">
          <h2 className="font-display text-xl font-semibold text-[var(--color-bark)] mb-4">
            More resources
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-forest-200)] bg-white px-4 py-2 text-sm text-[var(--color-bark-soft)] hover:border-[var(--color-forest-400)] hover:text-[var(--color-bark)] transition-all"
            >
              💊 Program Reviews
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
