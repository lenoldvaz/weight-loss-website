import Link from "next/link";
import type { Comparison } from "@/data/schemas/index";
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

export default function ComparisonTemplate({ record, related }: Props) {
  const c = record.content as Comparison;

  const jsonLd = [
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
          <Link href="/comparisons" className="hover:text-[var(--color-forest-700)] transition-colors">
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
          <p className="text-[var(--color-bark-soft)] leading-relaxed mb-6">{c.intro}</p>

          {/* Quick verdict */}
          <div className="rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
              Quick Verdict
            </p>
            <p className="text-[var(--color-forest-900)] leading-relaxed font-medium mb-3">
              {c.quick_verdict}
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--color-forest-600)] px-3 py-1 text-xs font-bold text-white">
                Overall Winner: {c.overall_winner}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-forest-800)]">{c.winner_reason}</p>
          </div>
        </header>

        {/* Side-by-side comparison table */}
        <section aria-labelledby="comparison-table-heading" className="mb-10">
          <h2 id="comparison-table-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            Head-to-Head Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-forest-100)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-parchment)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark-muted)]">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">{c.option_a.name}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">{c.option_b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-forest-50)]">
                {c.comparison_table.map((row, i) => (
                  <tr key={i} className="even:bg-[var(--color-forest-50)]">
                    <td className="px-4 py-3 font-medium text-[var(--color-bark)]">{row.attribute}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{row.option_a_value}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{row.option_b_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Category winners */}
        <section aria-labelledby="category-winners-heading" className="mb-10">
          <h2 id="category-winners-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {c.category_winners.map((cw, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-[var(--color-forest-100)] bg-white p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-bark-muted)] uppercase tracking-wide mb-0.5">
                    {cw.category}
                  </p>
                  <p className="text-sm text-[var(--color-bark-soft)]">{cw.reason}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--color-forest-100)] px-3 py-1 text-xs font-bold text-[var(--color-forest-700)]">
                  {cw.winner}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Overall winner callout */}
        <div className="mb-10 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Overall Winner
          </p>
          <p className="text-lg font-bold text-[var(--color-bark)] mb-1">{c.overall_winner}</p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.winner_reason}</p>
        </div>

        {/* Option A and Option B details */}
        <section aria-labelledby="options-heading" className="mb-10">
          <h2 id="options-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6">
            In-Depth Look
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {[c.option_a, c.option_b].map((opt, i) => (
              <article key={i} className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-bark)]">{opt.name}</h3>
                    <p className="text-xs text-[var(--color-bark-muted)] italic">{opt.tagline}</p>
                  </div>
                  <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-sm font-bold text-white">
                    {opt.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-4">{opt.overview}</p>
                <div className="mb-4 grid gap-3">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-[var(--color-forest-700)] uppercase tracking-wide">Pros</p>
                    <ul className="space-y-1">
                      {opt.pros.map((pro, j) => (
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
                      {opt.cons.map((con, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--color-bark-soft)]">
                          <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-1 border-t border-[var(--color-forest-100)] pt-3 text-xs text-[var(--color-bark-muted)]">
                  <p><span className="font-medium">Best for:</span> {opt.best_for}</p>
                  <p><span className="font-medium">Cost:</span> {opt.cost_cad}</p>
                  <p><span className="font-medium">Canada availability:</span> {opt.availability_canada}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Who should choose what */}
        <section aria-labelledby="choose-heading" className="mb-10">
          <h2 id="choose-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Which Is Right for You?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-sm font-bold text-[var(--color-bark)]">
                Choose <span className="text-[var(--color-forest-700)]">{c.option_a.name}</span> if you:
              </p>
              <ul className="space-y-2">
                {c.choose_a_if.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-sm font-bold text-[var(--color-bark)]">
                Choose <span className="text-[var(--color-forest-700)]">{c.option_b.name}</span> if you:
              </p>
              <ul className="space-y-2">
                {c.choose_b_if.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Canadian availability */}
        <div className="mb-10 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            🍁 Canadian Availability
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.canadian_context}</p>
        </div>

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
          Always consult a qualified healthcare professional before starting any weight loss program or changing medications.
        </p>
      </main>

      <Footer />
    </>
  );
}
