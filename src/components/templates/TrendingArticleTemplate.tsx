import Link from "next/link";
import type { TrendingArticle } from "@/data/schemas/index";
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

export default function TrendingArticleTemplate({ record, related }: Props) {
  const c = record.content as TrendingArticle;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: c.h1,
      description: c.meta_description,
      datePublished: c.publish_date,
      dateModified: c.last_updated,
      author: { "@type": "Organization", name: "weight-loss.ca" },
      publisher: {
        "@type": "Organization",
        name: "weight-loss.ca",
        logo: {
          "@type": "ImageObject",
          url: "https://weight-loss.ca/logo.png",
        },
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
          <Link href="/news" className="hover:text-[var(--color-forest-700)] transition-colors">
            {getTemplateBreadcrumb(record.template)}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">{c.h1}</span>
        </nav>

        {/* Last updated badge */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <span className="rounded-full bg-[var(--color-forest-100)] px-3 py-1 text-xs font-semibold text-[var(--color-forest-700)]">
            Last updated: {c.last_updated}
          </span>
          <span className="rounded-full bg-[var(--color-parchment)] px-3 py-1 text-xs text-[var(--color-bark-muted)]">
            {c.reading_time_minutes} min read
          </span>
        </div>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl leading-tight">
            {c.h1}
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">{c.intro}</p>
        </header>

        {/* Key takeaways box */}
        <div className="mb-8 rounded-xl border-2 border-[var(--color-forest-300)] bg-[var(--color-forest-50)] px-5 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Key Takeaways
          </p>
          <ul className="space-y-2">
            {c.key_takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-forest-900)]">
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

        {/* Quick summary */}
        <div className="mb-8 rounded-xl bg-[var(--color-parchment)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-bark-muted)]">Summary</p>
          <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] italic">{c.quick_summary}</p>
        </div>

        {/* Main article sections */}
        <div className="mb-10 space-y-8">
          {c.body_sections.map((section, i) => (
            <section key={i} aria-labelledby={`section-${i}-heading`}>
              <h2 id={`section-${i}-heading`} className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-3">{section.body}</p>
              {section.key_point && (
                <div className="rounded-xl border-l-4 border-[var(--color-forest-400)] bg-[var(--color-forest-50)] px-5 py-4">
                  <p className="text-sm font-medium text-[var(--color-forest-900)]">
                    <span className="font-bold">Key point: </span>
                    {section.key_point}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Canadian context section */}
        <div className="mb-10 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            🍁 What This Means for Canadians
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.canadian_context}</p>
        </div>

        {/* Sources / citations */}
        {c.sources && c.sources.length > 0 && (
          <section aria-labelledby="sources-heading" className="mb-10">
            <h2 id="sources-heading" className="font-display text-lg font-bold text-[var(--color-bark)] mb-3">
              Sources
            </h2>
            <ol className="space-y-2">
              {c.sources.map((source, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-bark-muted)]">
                  <span className="shrink-0 font-semibold">{i + 1}.</span>
                  <span>
                    <span className="font-medium text-[var(--color-bark-soft)]">{source.title}</span>
                    {" — "}
                    <span>{source.publisher}</span>
                    {source.url && (
                      <>
                        {" "}
                        <a
                          href={source.url}
                          rel="nofollow noreferrer"
                          target="_blank"
                          className="text-[var(--color-forest-600)] hover:underline"
                        >
                          ↗
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </section>
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
          Information on this page is for general informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional before making any healthcare decisions.
        </p>
      </main>

      <Footer />
    </>
  );
}
