import Link from "next/link";
import type { DemographicTopic } from "@/data/schemas/index";
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

export default function DemographicTopicTemplate({ record, related }: Props) {
  const c = record.content as DemographicTopic;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.h1,
      description: c.meta_description,
      author: { "@type": "Organization", name: "weight-loss.ca" },
      publisher: { "@type": "Organization", name: "weight-loss.ca" },
      datePublished: record.generated_at.split("T")[0],
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
          <Link href="/by-audience" className="hover:text-[var(--color-forest-700)] transition-colors">
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

        {/* Quick answer / key stats callout */}
        <div className="mb-8 rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Quick Answer
          </p>
          <p className="text-[var(--color-forest-900)] leading-relaxed font-medium">
            {c.quick_answer}
          </p>
        </div>

        {/* Unique challenges */}
        <section aria-labelledby="challenges-heading" className="mb-10">
          <h2 id="challenges-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Unique Challenges
          </h2>
          <div className="space-y-4">
            {c.unique_challenges.map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
                <h3 className="font-display text-base font-bold text-[var(--color-bark)] mb-2">
                  {item.challenge}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{item.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Strategies */}
        <section aria-labelledby="strategies-heading" className="mb-10">
          <h2 id="strategies-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Effective Strategies
          </h2>
          <div className="space-y-5">
            {c.strategies.map((s, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm">
                <h3 className="font-display text-lg font-bold text-[var(--color-bark)] mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-3">{s.description}</p>
                {s.evidence_note && (
                  <div className="rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] px-4 py-2.5 text-xs text-[var(--color-forest-800)]">
                    <span className="font-semibold">Evidence note: </span>
                    {s.evidence_note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Diet & Exercise recommendations */}
        <section aria-labelledby="recommendations-heading" className="mb-10">
          <h2 id="recommendations-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Recommendations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-forest-700)]">
                Diet
              </p>
              <ul className="space-y-2">
                {c.diet_recommendations.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-forest-700)]">
                Exercise
              </p>
              <ul className="space-y-2">
                {c.exercise_recommendations.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Product / program recommendations */}
        <section aria-labelledby="products-heading" className="mb-10">
          <h2 id="products-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Recommended Approaches
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.product_recommendations.map((prod, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
                <h3 className="font-display text-base font-bold text-[var(--color-bark)] mb-2">{prod.name}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{prod.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to avoid */}
        <section aria-labelledby="avoid-heading" className="mb-10">
          <h2 id="avoid-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            What to Avoid
          </h2>
          <ul className="space-y-3">
            {c.what_to_avoid.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                <span className="text-sm text-[var(--color-bark-soft)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Canadian resources */}
        <div className="mb-10 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            🍁 Canadian Context
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.canadian_context}</p>
        </div>

        {/* When to see a doctor */}
        <section aria-labelledby="see-doctor-heading" className="mb-10">
          <h2 id="see-doctor-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            When to See a Doctor
          </h2>
          <ul className="space-y-2">
            {c.see_a_doctor_if.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-[var(--color-parchment)] px-4 py-3">
                <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                <span className="text-sm text-[var(--color-bark-soft)]">{item}</span>
              </li>
            ))}
          </ul>
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
          This guide is for informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional before starting any weight loss program.
        </p>
      </main>

      <Footer />
    </>
  );
}
