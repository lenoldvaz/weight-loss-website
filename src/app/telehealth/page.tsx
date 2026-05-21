import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "GLP-1 Telehealth Providers Canada 2026 — Get an Ozempic Prescription Online",
  description:
    "Compare 10+ Canadian telehealth platforms that prescribe Ozempic, Wegovy, generic semaglutide, and Mounjaro. Consultation fees, province coverage, and medication costs compared.",
  alternates: { canonical: "https://weight-loss.ca/telehealth" },
};

type Provider = {
  name: string;
  consultation_fee: string;
  consult_note: string;
  drugs: string[];
  provinces: string;
  province_count: number;
  service_type: "Rx + Dispensing" | "Rx only";
  price_note: string | null;
  url: string;
  highlight?: boolean;
  notes: string;
};

const PROVIDERS: Provider[] = [
  {
    name: "Hims & Hers",
    consultation_fee: "$0",
    consult_note: "bundled into subscription",
    drugs: ["Generic Semaglutide", "Ozempic"],
    provinces: "All provinces",
    province_count: 10,
    service_type: "Rx + Dispensing",
    price_note: "From $149/mo all-in",
    url: "https://www.hims.com/ca",
    highlight: true,
    notes: "Launched generic semaglutide in Canada May 2026. Cheapest all-in telehealth option.",
  },
  {
    name: "Felix Health",
    consultation_fee: "$99",
    consult_note: "one-time intake, then bundled",
    drugs: ["Generic Semaglutide", "Ozempic", "Wegovy", "Mounjaro"],
    provinces: "All provinces",
    province_count: 10,
    service_type: "Rx + Dispensing",
    price_note: "From $150/mo (generic)",
    url: "https://www.felixforyou.ca",
    highlight: true,
    notes: "Wide drug selection. One of the first to switch to generic semaglutide.",
  },
  {
    name: "Phoenix",
    consultation_fee: "$0",
    consult_note: "included in subscription",
    drugs: ["Ozempic", "Generic Semaglutide (coming)"],
    provinces: "All provinces",
    province_count: 10,
    service_type: "Rx + Dispensing",
    price_note: "From $299/mo (brand Ozempic, 20% off)",
    url: "https://www.phoenix.ca",
    highlight: false,
    notes: "20% discount from list price. Generic semaglutide option coming.",
  },
  {
    name: "Maple",
    consultation_fee: "$85",
    consult_note: "one-time consult, then Rx at your pharmacy",
    drugs: ["Ozempic", "Wegovy", "Mounjaro"],
    provinces: "All provinces & territories",
    province_count: 13,
    service_type: "Rx only",
    price_note: "Fill at any pharmacy",
    url: "https://www.getmaple.ca",
    highlight: false,
    notes: "Only telehealth covering ALL territories. Includes Quebec and NB. Fill Rx at your own pharmacy.",
  },
  {
    name: "Raven",
    consultation_fee: "$0",
    consult_note: "included, weight-loss focus",
    drugs: ["Ozempic", "Wegovy", "Mounjaro"],
    provinces: "ON, BC, AB, MB, SK, NS, NB, PE, NL",
    province_count: 9,
    service_type: "Rx + Dispensing",
    price_note: "Price after assessment",
    url: "https://www.getraven.com",
    highlight: false,
    notes: "Weight-loss focused program. Pricing disclosed after intake assessment.",
  },
  {
    name: "Mednow",
    consultation_fee: "$0",
    consult_note: "free virtual consultation",
    drugs: ["Ozempic", "Wegovy", "Generic Semaglutide"],
    provinces: "Most provinces",
    province_count: 9,
    service_type: "Rx + Dispensing",
    price_note: "Contact for pricing",
    url: "https://www.mednow.ca",
    highlight: false,
    notes: "Free consultation model. Medication cost quoted separately.",
  },
  {
    name: "Tia Health",
    consultation_fee: "$0",
    consult_note: "free first consult",
    drugs: ["Ozempic", "Mounjaro"],
    provinces: "ON, BC, AB",
    province_count: 3,
    service_type: "Rx only",
    price_note: "Fill at your pharmacy",
    url: "https://www.tiahealth.ca",
    highlight: false,
    notes: "Fill prescription at any pharmacy of your choice.",
  },
  {
    name: "Rocket Doctor",
    consultation_fee: "$0",
    consult_note: "OHIP/province billed",
    drugs: ["Ozempic", "Wegovy"],
    provinces: "ON, BC, AB",
    province_count: 3,
    service_type: "Rx only",
    price_note: "Fill at your pharmacy",
    url: "https://www.rocketdoctor.ca",
    highlight: false,
    notes: "Provincial billing where available. Fast prescription turnaround.",
  },
  {
    name: "TELUS Health MyCare",
    consultation_fee: "$0",
    consult_note: "some provinces billed to health card",
    drugs: ["Ozempic", "Wegovy"],
    provinces: "ON, BC, AB",
    province_count: 3,
    service_type: "Rx only",
    price_note: "Fill at your pharmacy",
    url: "https://www.telushealth.com/en/mycare",
    highlight: false,
    notes: "Large Canadian telehealth platform. Health card billing available in some provinces.",
  },
  {
    name: "Jill Health",
    consultation_fee: "Varies",
    consult_note: "by province and plan",
    drugs: ["Ozempic", "Wegovy", "Mounjaro"],
    provinces: "Most provinces",
    province_count: 8,
    service_type: "Rx only",
    price_note: "Fill at your pharmacy",
    url: "https://www.jillhealth.ca",
    highlight: false,
    notes: "Women-focused telehealth. Fill prescription at your preferred pharmacy.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "GLP-1 Telehealth Providers Canada 2026",
  description: "Compare Canadian telehealth platforms for Ozempic, Wegovy, and generic semaglutide prescriptions.",
  url: "https://weight-loss.ca/telehealth",
};

export default function TelehealthPage() {
  const rxPlusDispensing = PROVIDERS.filter((p) => p.service_type === "Rx + Dispensing");
  const rxOnly = PROVIDERS.filter((p) => p.service_type === "Rx only");

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-12 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl mb-4 tracking-tight">
              Get a GLP-1 Prescription Online
            </h1>
            <p className="text-zinc-400 text-base max-w-2xl leading-relaxed mb-6">
              10+ Canadian telehealth providers compared — consultation fees, provinces covered,
              drugs available, and whether medication is dispensed directly. No in-person visit needed.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5">
                <span className="text-xl font-black text-white">{PROVIDERS.length}</span>
                <span className="text-xs text-zinc-400 ml-2">providers compared</span>
              </div>
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5">
                <span className="text-xl font-black text-white">$0</span>
                <span className="text-xs text-zinc-400 ml-2">min consultation fee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Decision helper */}
        <div className="border-b border-zinc-200 bg-blue-50 px-4 py-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-3 items-start bg-white border border-blue-200 rounded-xl p-3">
                <span className="text-lg">🏃</span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs mb-0.5">Need prescription + medication delivered</div>
                  <div className="text-zinc-500 text-xs">Choose an <strong className="text-zinc-700">Rx + Dispensing</strong> provider (Hims, Felix, Phoenix, Mednow, Raven)</div>
                </div>
              </div>
              <div className="flex gap-3 items-start bg-white border border-blue-200 rounded-xl p-3">
                <span className="text-lg">💊</span>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs mb-0.5">Have a preferred pharmacy already</div>
                  <div className="text-zinc-500 text-xs">Choose an <strong className="text-zinc-700">Rx only</strong> provider (Maple, Tia, Rocket, TELUS) and fill at Costco or Shoppers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rx + Dispensing */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-lg font-black text-zinc-900">Prescription + Medication Delivered</h2>
              <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">All-in-one</span>
            </div>
            <div className="space-y-3">
              {rxPlusDispensing.map((p) => <ProviderCard key={p.name} p={p} />)}
            </div>
          </div>
        </section>

        {/* Rx only */}
        <section className="border-t border-zinc-100 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-lg font-black text-zinc-900">Prescription Only — Fill at Your Pharmacy</h2>
              <span className="text-xs bg-zinc-100 text-zinc-700 font-semibold px-2 py-0.5 rounded-full">Bring own Rx</span>
            </div>
            <p className="text-sm text-zinc-400 mb-5">
              Use this with <a href="/glp1-prices" className="underline text-zinc-600 hover:text-zinc-900">our price comparison</a> to find the cheapest pharmacy to fill at.
            </p>
            <div className="space-y-3">
              {rxOnly.map((p) => <ProviderCard key={p.name} p={p} />)}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-xl font-black text-zinc-900 mb-6">Common questions</h2>
            <div className="space-y-3">
              {[
                { q: "Do I need an in-person doctor visit to get semaglutide in Canada?", a: "No. All providers on this list offer fully virtual consultations. You answer intake questions online, a licensed Canadian physician reviews your case, and your prescription is issued digitally." },
                { q: "Which telehealth provider covers the most provinces?", a: "Maple is the only one covering all 13 provinces and territories including Quebec, NWT, Yukon, and Nunavut. All others cover 10 provinces (or fewer). If you're in Quebec or NB, Maple is often your best option." },
                { q: "Is it safe to get a prescription this way?", a: "Yes. All listed providers use licensed Canadian physicians. They conduct the same health screening that would happen in-person — reviewing your medical history, current medications, and BMI/health goals." },
                { q: "What's the difference between Rx+Dispensing and Rx only?", a: "Rx+Dispensing platforms handle everything — they issue your prescription and mail your medication. Rx only platforms issue the prescription only; you fill it at a pharmacy of your choice (Costco, Shoppers, etc)." },
              ].map((item) => (
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
          <div className="mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/glp1-prices", title: "GLP-1 Price Comparison", desc: "Find the cheapest pharmacy to fill your prescription." },
                { href: "/savings-cards", title: "Manufacturer Savings Cards", desc: "Reduce costs by up to $171/mo with official programs." },
                { href: "/coverage-checker", title: "Coverage Checker", desc: "Find out if your provincial drug plan covers your medication." },
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

function ProviderCard({ p }: { p: Provider }) {
  return (
    <div className={`bg-white border rounded-2xl p-5 ${p.highlight ? "border-[var(--color-forest-300)] ring-1 ring-[var(--color-forest-200)]" : "border-zinc-200"}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-display font-bold text-zinc-900">{p.name}</h3>
            {p.highlight && (
              <span className="text-xs bg-[var(--color-forest-100)] text-[var(--color-forest-800)] font-bold px-2 py-0.5 rounded-full">Top pick</span>
            )}
            <span className="text-xs bg-zinc-100 text-zinc-600 font-medium px-2 py-0.5 rounded-full">
              {p.service_type}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.drugs.map((d) => (
              <span key={d} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium px-1.5 py-0.5 rounded-md">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wide mb-0.5">Consult fee</div>
              <div className="font-bold text-zinc-900">{p.consultation_fee}</div>
              <div className="text-zinc-400">{p.consult_note}</div>
            </div>
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wide mb-0.5">Provinces</div>
              <div className="font-bold text-zinc-900">{p.province_count}</div>
              <div className="text-zinc-400 truncate" title={p.provinces}>{p.provinces.length > 20 ? p.provinces.slice(0, 20) + "…" : p.provinces}</div>
            </div>
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wide mb-0.5">Medication</div>
              <div className="font-bold text-zinc-900">{p.service_type === "Rx + Dispensing" ? "Delivered" : "Your pharmacy"}</div>
              {p.price_note && <div className="text-zinc-400">{p.price_note}</div>}
            </div>
            <div>
              <div className="text-zinc-400 font-semibold uppercase tracking-wide mb-0.5">Notes</div>
              <div className="text-zinc-500 leading-snug">{p.notes}</div>
            </div>
          </div>
        </div>

        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 self-start sm:self-center inline-flex items-center gap-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-700 transition-colors"
        >
          Visit →
        </a>
      </div>
    </div>
  );
}
