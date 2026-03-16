import Link from "next/link";
import type { BestList } from "@/data/schemas/index";
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

export default function BestListTemplate({ record, related }: Props) {
  const c = record.content as BestList;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.h1,
      description: c.meta_description,
      itemListElement: c.ranked_list.map((item) => ({
        "@type": "ListItem",
        position: item.rank,
        name: item.name,
        description: item.description,
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
          <Link href="/best-lists" className="hover:text-[var(--color-forest-700)] transition-colors">
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
        </header>

        {/* Quick picks */}
        <div className="mb-8 rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Quick Picks
          </p>
          <div className="space-y-2">
            {c.quick_picks.map((pick, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-forest-800)] font-medium">{pick.category}</span>
                <span className="rounded-full bg-[var(--color-forest-600)] px-3 py-0.5 text-xs font-bold text-white">
                  {pick.winner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <section aria-labelledby="methodology-heading" className="mb-10">
          <h2 id="methodology-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            How We Selected These
          </h2>
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-4">{c.methodology.how_we_selected}</p>
            <p className="mb-2 text-xs font-semibold text-[var(--color-bark)] uppercase tracking-wide">Selection Criteria</p>
            <ul className="space-y-1 mb-4">
              {c.methodology.criteria.map((criterion, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                  <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                  {criterion}
                </li>
              ))}
            </ul>
            <div className="rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] px-4 py-2.5 text-xs text-[var(--color-forest-800)]">
              <span className="font-semibold">🍁 Canadian factors: </span>
              {c.methodology.canadian_factors}
            </div>
          </div>
        </section>

        {/* Ranked list */}
        <section aria-labelledby="ranked-list-heading" className="mb-10">
          <h2 id="ranked-list-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6">
            Our Ranked List
          </h2>
          <div className="flex flex-col gap-5">
            {c.ranked_list.map((item) => (
              <article
                key={item.rank}
                className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-3 flex-wrap">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-sm font-bold text-white">
                    {item.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-[var(--color-bark)]">{item.name}</h3>
                    <p className="text-xs text-[var(--color-bark-muted)] italic">{item.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--color-parchment)] px-3 py-1 text-xs font-medium text-[var(--color-bark-soft)]">
                    {item.price_cad}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-3">{item.description}</p>

                <div className="mb-3 rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] px-4 py-2.5 text-xs text-[var(--color-forest-800)]">
                  <span className="font-semibold">Why it made the list: </span>
                  {item.why_it_made_the_list}
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-[var(--color-forest-700)] uppercase tracking-wide">Pros</p>
                    <ul className="space-y-1">
                      {item.pros.map((pro, j) => (
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
                      {item.cons.map((con, j) => (
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
                    <span className="font-medium">Best for:</span> {item.best_for}
                  </p>
                  {item.affiliate_url && (
                    <a
                      href={item.affiliate_url}
                      rel="nofollow noreferrer"
                      target="_blank"
                      className="text-xs font-medium text-[var(--color-forest-600)] hover:underline"
                    >
                      View details ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quick comparison table */}
        <section aria-labelledby="quick-compare-heading" className="mb-10">
          <h2 id="quick-compare-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            Quick Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-forest-100)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-parchment)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark-muted)]">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Price (CAD)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-forest-50)]">
                {c.ranked_list.map((item) => (
                  <tr key={item.rank} className="even:bg-[var(--color-forest-50)]">
                    <td className="px-4 py-3 font-bold text-[var(--color-forest-600)]">{item.rank}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-bark)]">{item.name}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{item.price_cad}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{item.best_for}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Buying guide */}
        <section aria-labelledby="buying-guide-heading" className="mb-10">
          <h2 id="buying-guide-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            Buying Guide
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-5">{c.buying_guide.intro}</p>
          <div className="space-y-3">
            {c.buying_guide.key_factors.map((kf, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-forest-100)] bg-white p-4">
                <p className="text-sm font-bold text-[var(--color-bark)] mb-1">{kf.factor}</p>
                <p className="text-xs text-[var(--color-bark-soft)] leading-relaxed">{kf.explanation}</p>
              </div>
            ))}
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
