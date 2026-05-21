import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "GLP-1 Savings Cards Canada 2026 — Ozempic, Wegovy, Mounjaro, Zepbound",
  description:
    "Canadian manufacturer savings programs for GLP-1 medications. Reduce your Ozempic, Wegovy, Mounjaro, or Zepbound cost by up to $171/month. All official programs listed.",
  alternates: { canonical: "https://weight-loss.ca/savings-cards" },
};

const CARDS = [
  {
    id: "novo-care",
    name: "Novo Nordisk Care®",
    drugs: ["Ozempic", "Wegovy", "Plosbrio", "Poviztra"],
    drugColors: ["bg-blue-100 text-blue-800", "bg-purple-100 text-purple-800", "bg-zinc-100 text-zinc-700", "bg-indigo-100 text-indigo-700"],
    maxSaving: "Full coverage available",
    savingNote: "For uninsured Canadians who qualify",
    eligibility: "All Canadian residents — insured or uninsured. Financial assistance tier requires no drug insurance.",
    howToEnroll: "novonordiskcare.ca or call 1-833-595-1899",
    url: "https://www.novonordiskcare.ca",
    restrictions: "Financial Assistance tier: no drug insurance required. Canadian residency required.",
    highlight: true,
  },
  {
    id: "innovicares",
    name: "innoviCares®",
    drugs: ["Ozempic", "Wegovy", "65+ other brands"],
    drugColors: ["bg-blue-100 text-blue-800", "bg-purple-100 text-purple-800", "bg-zinc-100 text-zinc-700"],
    maxSaving: "Brand–generic cost difference",
    savingNote: "No income requirement — open to all",
    eligibility: "All Canadian residents. No income requirements. Instant enrollment.",
    howToEnroll: "innovicares.ca — free account, instant card",
    url: "https://www.innovicares.ca",
    restrictions: "All provinces except Quebec (limited). Covers the cost gap when switching to a generic.",
    highlight: false,
  },
  {
    id: "myzepbound",
    name: "myzepbound™",
    drugs: ["Zepbound"],
    drugColors: ["bg-pink-100 text-pink-800"],
    maxSaving: "Up to $171/month",
    savingNote: "For cash-pay patients",
    eligibility: "Canadian residents with or without insurance.",
    howToEnroll: "myzepbound.ca — must apply before first purchase",
    url: "https://www.myzepbound.ca",
    restrictions: "Must apply before purchase. Insured patients save $30–$60/mo; uninsured up to $171/mo.",
    highlight: false,
  },
  {
    id: "mymounjaro",
    name: "mymounjaro™",
    drugs: ["Mounjaro"],
    drugColors: ["bg-orange-100 text-orange-800"],
    maxSaving: "Up to 25% off",
    savingNote: "On select doses",
    eligibility: "Canadian residents with or without insurance.",
    howToEnroll: "mymounjaro.ca",
    url: "https://www.mymounjaro.ca",
    restrictions: "Off-label use for weight loss may not qualify. Check program terms.",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Can I use a savings card if I have insurance?",
    a: "It depends on the program. innoviCares works for insured and uninsured. The Novo Nordisk Care financial assistance tier requires no drug insurance. myzepbound and mymounjaro work for both but save more for uninsured patients.",
  },
  {
    q: "Can I stack a savings card with my provincial drug plan?",
    a: "Generally no — provincial drug plans are primary and savings cards typically can't be used on top of government coverage. These programs are primarily for those without provincial coverage.",
  },
  {
    q: "Is there a savings card for generic semaglutide?",
    a: "Not from manufacturers — generics are already discounted by 60–75% vs brand. innoviCares covers the cost difference when switching from brand to generic. The best strategy for generic is comparing pharmacies directly.",
  },
  {
    q: "How quickly do savings cards activate?",
    a: "innoviCares activates instantly online. Novo Nordisk Care and the Eli Lilly programs typically activate within a few days after application review.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "GLP-1 Savings Cards Canada",
  description: "Official Canadian manufacturer savings programs for Ozempic, Wegovy, Mounjaro, and Zepbound.",
  url: "https://weight-loss.ca/savings-cards",
};

export default function SavingsCardsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-12 pb-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl mb-4 tracking-tight">
              GLP-1 Savings Cards Canada
            </h1>
            <p className="text-zinc-400 text-base max-w-2xl leading-relaxed mb-6">
              Official manufacturer programs that reduce your out-of-pocket cost by $30–$171/month.
              All four active Canadian programs listed — no affiliate links, no paid placements.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5">
                <span className="text-xl font-black text-white">4</span>
                <span className="text-xs text-zinc-400 ml-2">active programs</span>
              </div>
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5">
                <span className="text-xl font-black text-white">$171/mo</span>
                <span className="text-xs text-zinc-400 ml-2">max monthly saving</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-5">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl border p-6 ${card.highlight ? "border-[var(--color-forest-300)] ring-1 ring-[var(--color-forest-200)] bg-[var(--color-forest-50)]/30" : "border-zinc-200 bg-white"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h2 className="font-display text-lg font-black text-zinc-900">{card.name}</h2>
                      {card.highlight && (
                        <span className="text-xs font-bold bg-[var(--color-forest-100)] text-[var(--color-forest-800)] px-2 py-0.5 rounded-full">Most comprehensive</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {card.drugs.map((drug, i) => (
                        <span key={drug} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.drugColors[i] ?? "bg-zinc-100 text-zinc-600"}`}>
                          {drug}
                        </span>
                      ))}
                    </div>
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-0.5">Max saving</dt>
                        <dd className="font-semibold text-zinc-900">{card.maxSaving}</dd>
                        <dd className="text-xs text-zinc-500">{card.savingNote}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-0.5">Eligibility</dt>
                        <dd className="text-zinc-700">{card.eligibility}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-0.5">How to enroll</dt>
                        <dd className="text-zinc-700">{card.howToEnroll}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-0.5">Key restrictions</dt>
                        <dd className="text-zinc-500 text-xs">{card.restrictions}</dd>
                      </div>
                    </dl>
                  </div>
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 self-start sm:self-center inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-700 transition-colors"
                  >
                    Enroll →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-xl font-black text-zinc-900 mb-6">Common questions</h2>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <div key={item.q} className="bg-white border border-zinc-200 rounded-xl p-5">
                  <h3 className="font-semibold text-zinc-900 text-sm mb-2">{item.q}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-lg font-bold text-zinc-900 mb-4">More ways to save</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/glp1-prices", title: "Price Comparison", desc: "Compare 15+ pharmacies — cheapest generic from $114/mo." },
                { href: "/coverage-checker", title: "Coverage Checker", desc: "Find out if your provincial plan pays for your medication." },
                { href: "/telehealth", title: "Telehealth Providers", desc: "Get a prescription online from $0 consult fee." },
              ].map((l) => (
                <a key={l.href} href={l.href} className="block bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all">
                  <div className="font-semibold text-zinc-900 text-sm mb-1">{l.title}</div>
                  <div className="text-zinc-500 text-xs">{l.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
