import Link from "next/link";
import Image from "next/image";
import type { LocationService } from "@/data/schemas/index";
import type { ContentRecord } from "@/lib/content";
import { getTemplateBreadcrumb } from "@/lib/content";
import FAQSection from "@/components/shared/FAQSection";
import RelatedLinks from "@/components/shared/RelatedLinks";
import CTASection from "@/components/shared/CTASection";
import JsonLd from "@/components/shared/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  record: ContentRecord;
  related: ContentRecord[];
}

export default function LocationServiceTemplate({ record, related }: Props) {
  const c = record.content as LocationService;

  // JSON-LD: ItemList of local businesses + FAQPage
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.h1,
      description: c.meta_description,
      itemListElement: c.top_picks.map((pick, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MedicalClinic",
          name: pick.name,
          description: pick.description,
          priceRange: pick.price_range,
          ...(pick.address_area && { address: { "@type": "PostalAddress", addressLocality: pick.address_area } }),
          ...(pick.phone && { telephone: pick.phone }),
          ...(pick.website && { url: pick.website }),
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]">
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/clinics" className="hover:text-[var(--color-forest-700)] transition-colors">
            {getTemplateBreadcrumb(record.template)}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">{c.h1}</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl leading-tight">
            {c.h1}
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">{c.intro}</p>

          {/* Hero image */}
          {c.hero_image && (
            <div className="mt-6 overflow-hidden rounded-2xl">
              <Image
                src={c.hero_image.path}
                alt={c.hero_image.alt}
                width={800}
                height={400}
                className="w-full object-cover max-h-[400px]"
                priority
              />
            </div>
          )}
        </header>

        {/* Local context callout */}
        <div className="mb-8 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--color-forest-800)]">
            <span className="font-semibold">📍 Local context: </span>
            {c.local_context}
          </p>
        </div>

        {/* Top picks */}
        <section aria-labelledby="picks-heading" className="mb-10">
          <h2 id="picks-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6">
            Our Top Picks
          </h2>
          <div className="flex flex-col gap-5">
            {c.top_picks.map((pick, i) => (
              <article
                key={i}
                className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[var(--color-bark)]">
                        {pick.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--color-bark-muted)] italic">{pick.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pick.covered_by_insurance && (
                      <span className="rounded-full bg-[var(--color-forest-100)] px-3 py-1 text-xs font-semibold text-[var(--color-forest-700)]">
                        ✓ Insurance covered
                      </span>
                    )}
                    <span className="rounded-full bg-[var(--color-parchment)] px-3 py-1 text-xs font-medium text-[var(--color-bark-soft)]">
                      {pick.price_range}
                    </span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-4">
                  {pick.description}
                </p>

                {/* Services */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {pick.services_offered.map((svc, j) => (
                    <span
                      key={j}
                      className="rounded-full border border-[var(--color-forest-200)] bg-[var(--color-forest-50)] px-3 py-0.5 text-xs text-[var(--color-forest-700)]"
                    >
                      {svc}
                    </span>
                  ))}
                </div>

                {/* Pros / Cons */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-[var(--color-forest-700)] uppercase tracking-wide">Pros</p>
                    <ul className="space-y-1">
                      {pick.pros.map((pro, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--color-bark-soft)]">
                          <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-red-600 uppercase tracking-wide">Cons</p>
                    <ul className="space-y-1">
                      {pick.cons.map((con, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--color-bark-soft)]">
                          <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs text-[var(--color-bark-muted)]">
                    <span className="font-medium">Best for:</span> {pick.best_for}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-bark-muted)]">
                    {pick.address_area && (
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5 2.5 7.5 6 11 6 11s3.5-3.5 3.5-6.5C9.5 2.567 7.933 1 6 1zm0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
                        </svg>
                        {pick.address_area}
                      </span>
                    )}
                    {pick.website && (
                      <a
                        href={pick.website}
                        rel="nofollow noreferrer"
                        target="_blank"
                        className="text-[var(--color-forest-600)] hover:underline font-medium"
                      >
                        Visit website ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* What to look for */}
        <section aria-labelledby="criteria-heading" className="mb-10">
          <h2 id="criteria-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            What to Look for in a Weight Loss Clinic
          </h2>
          <ul className="space-y-3">
            {c.what_to_look_for.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-[var(--color-parchment)] px-4 py-3">
                <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-white text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cost & Insurance */}
        <section aria-labelledby="cost-heading" className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
            <h2 id="cost-heading" className="font-display text-base font-bold text-[var(--color-bark)] mb-2 flex items-center gap-2">
              <span className="text-[var(--color-forest-600)]">💰</span> Cost Context
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.average_cost_context}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
            <h2 className="font-display text-base font-bold text-[var(--color-bark)] mb-2 flex items-center gap-2">
              <span className="text-[var(--color-forest-600)]">🏥</span> Insurance &amp; OHIP
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.insurance_notes}</p>
          </div>
        </section>

        {/* FAQ */}
        <div className="mb-10">
          <FAQSection faqs={c.faqs} />
        </div>

        {/* Related links */}
        {related.length > 0 && (
          <div className="mb-10">
            <RelatedLinks records={related} />
          </div>
        )}

        {/* CTA */}
        <CTASection heading={c.cta_heading} body={c.cta_body} />

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-[var(--color-bark-muted)]">
          Information on this page is for general informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional before starting any weight loss program.
        </p>
      </main>

      <Footer />
    </>
  );
}
