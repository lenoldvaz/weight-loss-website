import Link from "next/link";
import Image from "next/image";
import type { ProductReview } from "@/data/schemas/index";
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

function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const color =
    score >= 8 ? "bg-[var(--color-forest-600)]" :
    score >= 6 ? "bg-amber-500" :
    "bg-red-500";
  const sizeClass = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg";
  return (
    <div className={`${color} ${sizeClass} flex items-center justify-center rounded-full font-bold text-white shrink-0`}>
      {score.toFixed(1)}
    </div>
  );
}

function RatingBar({ category, score, notes }: { category: string; score: number; notes: string }) {
  const pct = (score / 10) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-bark-soft)]">{category}</span>
        <span className="text-sm font-bold text-[var(--color-bark)]">{score}/10</span>
      </div>
      <div className="mb-1 h-2 w-full rounded-full bg-[var(--color-forest-100)]">
        <div
          className="h-2 rounded-full bg-[var(--color-forest-500)] transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-label={`${category}: ${score}/10`}
        />
      </div>
      <p className="text-xs text-[var(--color-bark-muted)]">{notes}</p>
    </div>
  );
}

export default function ProductReviewTemplate({ record, related }: Props) {
  const c = record.content as ProductReview;

  // JSON-LD: Product + Review + FAQPage
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: c.key_facts.product_type,
      brand: { "@type": "Brand", name: c.key_facts.manufacturer },
      review: {
        "@type": "Review",
        name: c.h1,
        reviewBody: c.verdict_summary,
        reviewRating: {
          "@type": "Rating",
          ratingValue: c.overall_score,
          bestRating: 10,
          worstRating: 1,
        },
        author: { "@type": "Organization", name: "weight-loss.ca" },
        datePublished: record.generated_at.split("T")[0],
      },
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
          <Link href="/reviews" className="hover:text-[var(--color-forest-700)] transition-colors">
            {getTemplateBreadcrumb(record.template)}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">{c.h1}</span>
        </nav>

        {/* Hero + verdict */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl leading-tight">
            {c.h1}
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed mb-6">{c.intro}</p>

          {/* Hero image */}
          {c.hero_image && (
            <div className="mb-6 overflow-hidden rounded-2xl">
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

          {/* Verdict card */}
          <div className="rounded-2xl border-2 border-[var(--color-forest-200)] bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4 flex-wrap">
              <ScoreBadge score={c.overall_score} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.recommended ? "bg-[var(--color-forest-100)] text-[var(--color-forest-700)]" : "bg-red-100 text-red-700"}`}>
                    {c.recommended ? "✓ Recommended" : "✗ Not Recommended"}
                  </span>
                  <span className="rounded-full bg-[var(--color-parchment)] px-3 py-1 text-xs font-medium text-[var(--color-bark-muted)]">
                    Overall: {c.overall_score}/10
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.verdict_summary}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 border-t border-[var(--color-forest-100)] pt-4">
              <div>
                <p className="text-xs font-semibold text-[var(--color-forest-700)] mb-0.5">Best for</p>
                <p className="text-xs text-[var(--color-bark-soft)]">{c.best_for}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 mb-0.5">Not for</p>
                <p className="text-xs text-[var(--color-bark-soft)]">{c.not_for}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Key facts */}
        <section aria-labelledby="facts-heading" className="mb-8">
          <h2 id="facts-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            Key Facts
          </h2>
          <div className="overflow-hidden rounded-xl border border-[var(--color-forest-100)]">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--color-forest-50)]">
                {[
                  ["Type", c.key_facts.product_type],
                  ["Manufacturer", c.key_facts.manufacturer],
                  ["Health Canada Status", c.key_facts.health_canada_status],
                  ["Price (CAD)", c.key_facts.price_cad],
                  ["Prescription Required", c.key_facts.prescription_required ? "Yes" : "No"],
                  ["Where to Buy", c.key_facts.where_to_buy.join(", ")],
                ].map(([label, value]) => (
                  <tr key={label} className="even:bg-[var(--color-forest-50)]">
                    <td className="px-4 py-3 font-medium text-[var(--color-bark)]">{label}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ratings breakdown */}
        <section aria-labelledby="ratings-heading" className="mb-8">
          <h2 id="ratings-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            Ratings Breakdown
          </h2>
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-6 space-y-5">
            {c.ratings.map((r, i) => (
              <RatingBar key={i} category={r.category} score={r.score} notes={r.notes} />
            ))}
          </div>
        </section>

        {/* Pros / Cons */}
        <section aria-labelledby="proscons-heading" className="mb-8">
          <h2 id="proscons-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-4">
            Pros &amp; Cons
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-forest-700)]">Pros</p>
              <ul className="space-y-2">
                {c.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-red-600">Cons</p>
              <ul className="space-y-2">
                {c.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="mb-8">
          <h2 id="how-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-3">
            How It Works
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.how_it_works}</p>
        </section>

        {/* Evidence summary */}
        <section aria-labelledby="evidence-heading" className="mb-8">
          <h2 id="evidence-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-3">
            What the Evidence Says
          </h2>
          <div className="rounded-xl border border-[var(--color-forest-100)] bg-[var(--color-forest-50)] px-5 py-4">
            <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.evidence_summary}</p>
          </div>
        </section>

        {/* Side effects */}
        <section aria-labelledby="sideeffects-heading" className="mb-8">
          <h2 id="sideeffects-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-3">
            Side Effects
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {c.side_effects.map((effect, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg bg-[var(--color-parchment)] px-3 py-2 text-sm text-[var(--color-bark-soft)]">
                <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                {effect}
              </li>
            ))}
          </ul>
        </section>

        {/* Who should consider */}
        <section aria-labelledby="who-heading" className="mb-8">
          <h2 id="who-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-3">
            Who Should Consider This
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">{c.who_should_consider}</p>
        </section>

        {/* Canadian availability */}
        <div className="mb-8 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            🍁 Canadian Availability
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.canadian_availability}</p>
        </div>

        {/* vs Alternatives */}
        {c.vs_alternatives && c.vs_alternatives.length > 0 && (
          <section aria-labelledby="alternatives-heading" className="mb-8">
            <h2 id="alternatives-heading" className="font-display text-xl font-bold text-[var(--color-bark)] mb-2">
              How It Compares to Alternatives
            </h2>
            <p className="text-sm text-[var(--color-bark-muted)] mb-4">
              Comparing {c.key_facts.product_type.split("(")[0].trim()} to other weight loss options available in Canada.
            </p>
            <div className="space-y-3">
              {c.vs_alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--color-forest-100)] bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-xs font-bold text-[var(--color-forest-700)]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-[var(--color-bark)] mb-1">{alt.name}</p>
                      <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">{alt.comparison_note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Medical disclaimer */}
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs text-amber-800">
            <span className="font-bold">⚠ Medical Disclaimer: </span>
            This review is for informational purposes only. This is not medical advice. Consult a qualified healthcare
            provider before starting, stopping, or changing any medication or treatment program.
          </p>
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
      </main>

      <Footer />
    </>
  );
}
