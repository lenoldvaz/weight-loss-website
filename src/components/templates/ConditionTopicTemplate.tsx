import Link from "next/link";
import type { ConditionTopic } from "@/data/schemas/index";
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

const EVIDENCE_LABELS: Record<string, string> = {
  strong: "Strong Evidence",
  moderate: "Moderate Evidence",
  emerging: "Emerging Evidence",
  anecdotal: "Anecdotal",
};

const EVIDENCE_COLORS: Record<string, string> = {
  strong: "bg-[var(--color-forest-600)] text-white",
  moderate: "bg-[var(--color-forest-200)] text-[var(--color-forest-800)]",
  emerging: "bg-amber-100 text-amber-800",
  anecdotal: "bg-[var(--color-parchment)] text-[var(--color-bark-muted)]",
};

const TREATMENT_TYPE_LABELS: Record<string, string> = {
  medication: "Medication",
  supplement: "Supplement",
  procedure: "Procedure",
  therapy: "Therapy",
};

export default function ConditionTopicTemplate({ record, related }: Props) {
  const c = record.content as ConditionTopic;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: c.h1,
      description: c.meta_description,
      about: { "@type": "MedicalCondition", name: c.h1 },
      author: { "@type": "Organization", name: "weight-loss.ca" },
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
          <Link href="/health-conditions" className="hover:text-[var(--color-forest-700)] transition-colors">
            {getTemplateBreadcrumb(record.template)}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">{c.h1}</span>
        </nav>

        {/* Prominent medical disclaimer banner */}
        <div className="mb-8 rounded-xl border-2 border-amber-300 bg-amber-50 px-5 py-4" role="alert">
          <p className="text-sm font-bold text-amber-800 mb-1">
            Medical Disclaimer
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            This page is for informational purposes only. Always consult your healthcare provider before making any
            changes to your treatment plan, diet, or medications — especially if you have a medical condition.
          </p>
        </div>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl leading-tight">
            {c.h1}
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">{c.intro}</p>
        </header>

        {/* Quick answer */}
        <div className="mb-8 rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Quick Answer
          </p>
          <p className="text-[var(--color-forest-900)] leading-relaxed font-medium">
            {c.quick_answer}
          </p>
        </div>

        {/* Medical context */}
        <section aria-labelledby="medical-context-heading" className="mb-10">
          <h2 id="medical-context-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Medical Overview
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <h3 className="font-display text-base font-bold text-[var(--color-bark)] mb-2">About This Condition</h3>
              <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.medical_context.condition_overview}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <h3 className="font-display text-base font-bold text-[var(--color-bark)] mb-2">Connection to Weight</h3>
              <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.medical_context.connection_to_weight}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[var(--color-parchment)] px-4 py-3">
                <p className="text-xs font-semibold text-[var(--color-bark-muted)] mb-1">Canadian Prevalence</p>
                <p className="text-sm text-[var(--color-bark-soft)]">{c.medical_context.canadian_prevalence}</p>
              </div>
              {c.medical_context.health_canada_guidance && (
                <div className="rounded-xl bg-[var(--color-forest-50)] px-4 py-3">
                  <p className="text-xs font-semibold text-[var(--color-forest-700)] mb-1">Health Canada Guidance</p>
                  <p className="text-sm text-[var(--color-forest-900)]">{c.medical_context.health_canada_guidance}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Treatment approaches */}
        <section aria-labelledby="treatment-heading" className="mb-10">
          <h2 id="treatment-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Treatment Approaches
          </h2>
          <div className="space-y-4">
            {c.strategies.map((s, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
                  <h3 className="font-display text-lg font-bold text-[var(--color-bark)]">{s.title}</h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${EVIDENCE_COLORS[s.evidence_level] ?? EVIDENCE_COLORS.anecdotal}`}>
                    {EVIDENCE_LABELS[s.evidence_level] ?? s.evidence_level}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dietary approach */}
        <section aria-labelledby="diet-heading" className="mb-10">
          <h2 id="diet-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Dietary Approach
          </h2>
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-bark-muted)] uppercase tracking-wide mb-1">Recommended Pattern</p>
              <p className="text-sm text-[var(--color-bark-soft)]">{c.dietary_approach.recommended_pattern}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-forest-700)]">Emphasise</p>
                <ul className="space-y-1">
                  {c.dietary_approach.foods_to_emphasise.map((food, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                      <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">Limit</p>
                <ul className="space-y-1">
                  {c.dietary_approach.foods_to_limit.map((food, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                      <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {c.dietary_approach.meal_timing_notes && (
              <div className="rounded-lg bg-[var(--color-parchment)] px-4 py-3 text-xs text-[var(--color-bark-soft)]">
                <span className="font-semibold text-[var(--color-bark)]">Meal timing: </span>
                {c.dietary_approach.meal_timing_notes}
              </div>
            )}
          </div>
        </section>

        {/* Exercise */}
        <section aria-labelledby="exercise-heading" className="mb-10">
          <h2 id="exercise-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-3">
            Exercise Guidance
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.exercise_approach}</p>
        </section>

        {/* Medications section */}
        <section aria-labelledby="medications-heading" className="mb-10">
          <h2 id="medications-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Medications &amp; Treatments
          </h2>
          <div className="space-y-3">
            {c.treatment_options.map((opt, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-[var(--color-forest-100)] bg-white p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-[var(--color-bark)] text-sm">{opt.name}</span>
                    <span className="rounded-full bg-[var(--color-parchment)] px-2 py-0.5 text-xs text-[var(--color-bark-muted)]">
                      {TREATMENT_TYPE_LABELS[opt.type] ?? opt.type}
                    </span>
                    {opt.health_canada_approved && (
                      <span className="rounded-full bg-[var(--color-forest-100)] px-2 py-0.5 text-xs font-semibold text-[var(--color-forest-700)]">
                        ✓ Health Canada Approved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-bark-soft)] leading-relaxed">{opt.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to discuss with doctor checklist */}
        <section aria-labelledby="doctor-checklist-heading" className="mb-10">
          <h2 id="doctor-checklist-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            What to Discuss with Your Doctor
          </h2>
          <ul className="space-y-2">
            {c.when_to_see_doctor.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-[var(--color-parchment)] px-4 py-3">
                <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded border-2 border-[var(--color-forest-400)] text-[var(--color-forest-600)]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm text-[var(--color-bark-soft)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cautions */}
        {c.cautions && c.cautions.length > 0 && (
          <section aria-labelledby="cautions-heading" className="mb-10">
            <h2 id="cautions-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
              Important Cautions
            </h2>
            <ul className="space-y-2">
              {c.cautions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                  <span className="text-sm text-amber-800">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Canadian healthcare resources */}
        <section aria-labelledby="canadian-resources-heading" className="mb-10">
          <h2 id="canadian-resources-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            Canadian Healthcare Resources
          </h2>
          <div className="space-y-3">
            {c.canadian_resources.map((res, i) => (
              <div key={i} className="rounded-xl border-l-4 border-[var(--color-forest-400)] bg-[var(--color-forest-50)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-bark)] mb-0.5">{res.name}</p>
                <p className="text-xs text-[var(--color-forest-800)] mb-1">{res.description}</p>
                {res.url && (
                  <a
                    href={res.url}
                    rel="nofollow noreferrer"
                    target="_blank"
                    className="text-xs text-[var(--color-forest-600)] hover:underline font-medium"
                  >
                    Visit resource ↗
                  </a>
                )}
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

        {/* Full disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs text-amber-800">
            <span className="font-bold">Medical Disclaimer: </span>
            {c.disclaimer}
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
