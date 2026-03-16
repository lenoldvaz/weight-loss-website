import Link from "next/link";
import type { HowTo } from "@/data/schemas/index";
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

export default function HowToTemplate({ record, related }: Props) {
  const c = record.content as HowTo;

  // JSON-LD: HowTo + FAQPage
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: c.h1,
      description: c.quick_answer,
      step: c.steps.map((step) => ({
        "@type": "HowToStep",
        position: step.step_number,
        name: step.title,
        text: step.description,
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
          <Link href="/how-to" className="hover:text-[var(--color-forest-700)] transition-colors">
            {getTemplateBreadcrumb(record.template)}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">{c.h1}</span>
        </nav>

        {/* Hero */}
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl leading-tight">
            {c.h1}
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">{c.intro}</p>
        </header>

        {/* Quick answer box — featured snippet target */}
        <div className="mb-8 rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Quick Answer
          </p>
          <p className="text-[var(--color-forest-900)] leading-relaxed font-medium">
            {c.quick_answer}
          </p>
        </div>

        {/* Key takeaways */}
        <div className="mb-10 rounded-xl bg-[var(--color-parchment)] px-5 py-5">
          <h2 className="font-display text-base font-bold text-[var(--color-bark)] mb-3">
            Key Takeaways
          </h2>
          <ul className="space-y-2">
            {c.key_takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-bark-soft)]">
                <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="mb-10">
          <h2 id="steps-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6">
            Step-by-Step Guide
          </h2>
          <ol className="space-y-6">
            {c.steps.map((step) => (
              <li key={step.step_number} className="relative flex gap-4">
                {/* Step number connector line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-sm font-bold text-white z-10">
                    {step.step_number}
                  </div>
                  <div className="w-0.5 flex-1 bg-[var(--color-forest-100)] mt-1" aria-hidden="true" />
                </div>
                <div className="pb-2 pt-1.5 flex-1">
                  <h3 className="font-display text-lg font-bold text-[var(--color-bark)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-3">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="rounded-lg bg-[var(--color-sand-100)] px-4 py-2.5 text-xs text-[var(--color-bark-soft)]">
                      <span className="font-semibold text-[var(--color-bark)]">💡 Tip: </span>
                      {step.tip}
                    </div>
                  )}
                  {step.canadian_note && (
                    <div className="mt-2 rounded-lg bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] px-4 py-2.5 text-xs text-[var(--color-forest-800)]">
                      <span className="font-semibold">🍁 Canadian note: </span>
                      {step.canadian_note}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Common mistakes */}
        <section aria-labelledby="mistakes-heading" className="mb-10">
          <h2 id="mistakes-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Common Mistakes to Avoid
          </h2>
          <div className="space-y-4">
            {c.common_mistakes.map((item, i) => (
              <div key={i} className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">✗ {item.mistake}</p>
                <p className="text-xs text-[var(--color-bark-soft)] mb-2">{item.why_it_matters}</p>
                <div className="flex items-start gap-2 rounded-lg bg-white px-3 py-2">
                  <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)] text-xs font-bold">Fix:</span>
                  <p className="text-xs text-[var(--color-bark-soft)]">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section aria-labelledby="tips-heading" className="mb-10">
          <h2 id="tips-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            Pro Tips
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl bg-[var(--color-parchment)] px-4 py-3">
                <span className="mt-0.5 shrink-0 text-[var(--color-forest-500)]">★</span>
                <span className="text-sm text-[var(--color-bark-soft)]">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Canadian context */}
        <div className="mb-10 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            🍁 Canadian Context
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">
            {c.canadian_context}
          </p>
        </div>

        {/* Expert note */}
        {c.expert_note && (
          <div className="mb-10 rounded-xl border border-[var(--color-forest-200)] bg-white px-5 py-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-bark-muted)]">
              📖 Evidence Note
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] italic">
              {c.expert_note}
            </p>
          </div>
        )}

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
          Consult a qualified healthcare provider before making significant changes to your diet or exercise routine.
        </p>
      </main>

      <Footer />
    </>
  );
}
