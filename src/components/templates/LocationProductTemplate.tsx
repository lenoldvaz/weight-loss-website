import Link from "next/link";
import type { LocationProduct } from "@/data/schemas/index";
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

export default function LocationProductTemplate({ record, related }: Props) {
  const c = record.content as LocationProduct;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.h1,
      description: c.meta_description,
      itemListElement: c.product_list.map((item) => ({
        "@type": "ListItem",
        position: item.rank,
        item: {
          "@type": "Product",
          name: item.name,
          brand: { "@type": "Brand", name: item.brand },
          description: item.description,
          offers: {
            "@type": "Offer",
            price: item.price_cad,
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
          },
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
          <Link href="/products" className="hover:text-[var(--color-forest-700)] transition-colors">
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

        {/* Local availability callout */}
        <div className="mb-8 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--color-forest-800)]">
            <span className="font-semibold">📍 Canadian Availability: </span>
            {c.canadian_context}
          </p>
        </div>

        {/* Product cards */}
        <section aria-labelledby="products-heading" className="mb-10">
          <h2 id="products-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6">
            Available Products
          </h2>
          <div className="flex flex-col gap-5">
            {c.product_list.map((item) => (
              <article
                key={item.rank}
                className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest-600)] text-xs font-bold text-white">
                      {item.rank}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--color-bark)]">{item.name}</h3>
                      <p className="text-xs text-[var(--color-bark-muted)]">{item.brand}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--color-parchment)] px-3 py-1 text-xs font-medium text-[var(--color-bark-soft)]">
                    {item.price_cad}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-bark-muted)] italic mb-3">{item.tagline}</p>
                <p className="text-sm leading-relaxed text-[var(--color-bark-soft)] mb-4">{item.description}</p>

                {/* Where to buy */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {item.where_to_buy_canada.map((store, j) => (
                    <span
                      key={j}
                      className="rounded-full border border-[var(--color-forest-200)] bg-[var(--color-forest-50)] px-3 py-0.5 text-xs text-[var(--color-forest-700)]"
                    >
                      {store}
                    </span>
                  ))}
                </div>

                {/* Pros / Cons */}
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
                      View product ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Price comparison table */}
        <section aria-labelledby="price-table-heading" className="mb-10">
          <h2 id="price-table-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-4">
            Price Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-forest-100)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-parchment)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Brand</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Price (CAD)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-bark)]">Where to Buy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-forest-50)]">
                {c.product_list.map((item) => (
                  <tr key={item.rank} className="even:bg-[var(--color-forest-50)]">
                    <td className="px-4 py-3 font-medium text-[var(--color-bark)]">{item.name}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{item.brand}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{item.price_cad}</td>
                    <td className="px-4 py-3 text-[var(--color-bark-soft)]">{item.where_to_buy_canada.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Where to buy summary */}
        <div className="mb-8 rounded-xl border-l-4 border-[var(--color-forest-500)] bg-[var(--color-forest-50)] px-5 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-forest-700)]">
            Where to Buy in Canada
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-forest-900)]">{c.where_to_buy_summary}</p>
        </div>

        {/* Buying guide */}
        <section aria-labelledby="buying-guide-heading" className="mb-10">
          <h2 id="buying-guide-heading" className="font-display text-2xl font-bold text-[var(--color-bark)] mb-5">
            Buying Guide
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--color-forest-100)] bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-forest-700)]">
                What to Look For
              </p>
              <ul className="space-y-2">
                {c.buying_guide.what_to_look_for.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-forest-600)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-red-600">
                Red Flags
              </p>
              <ul className="space-y-2">
                {c.buying_guide.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-bark-soft)]">
                    <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-[var(--color-parchment)] px-4 py-3 text-sm text-[var(--color-bark-soft)]">
              <span className="font-semibold text-[var(--color-bark)]">Budget tip: </span>
              {c.buying_guide.budget_tip}
            </div>
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
          Product prices and availability are subject to change. Always consult a qualified healthcare professional
          before starting any weight loss program.
        </p>
      </main>

      <Footer />
    </>
  );
}
