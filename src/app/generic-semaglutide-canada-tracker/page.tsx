import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Generic Semaglutide Canada: Price & Availability Tracker (2026)",
  description:
    "Compare generic semaglutide prices across every Canadian provider — Hims, Felix, Phoenix, Shoppers, Costco and more. Updated weekly with real prices and availability.",
  alternates: {
    canonical: "https://weight-loss.ca/generic-semaglutide-canada-tracker",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type GenericEntry = {
  id: string;
  brand_name: string;
  manufacturer: string;
  approved_date: string | null;
  launched_date: string | null;
  price_cad_low: number | null;
  price_cad_high: number | null;
  indication: string;
  status: "On Shelves" | "Launched" | "Approved" | "Pending";
  available_at: string;
  notes: string | null;
  updated_at: string;
};

export type ProviderEntry = {
  id: string;
  provider_name: string;
  provider_type: "Telehealth" | "Retail Pharmacy" | "Online Pharmacy";
  product: string;
  price_cad: number | null;
  price_note: string | null;
  consultation_included: boolean;
  requires_own_rx: boolean;
  availability: "Available" | "Coming Soon" | "Waitlist";
  ships_to: string | null;
  url: string | null;
  last_verified: string | null;
  sort_order: number;
  notes: string | null;
  updated_at: string;
};

// ─── Seed data (shown until Supabase is populated) ───────────────────────────

const SEED_GENERICS: GenericEntry[] = [
  {
    id: "1",
    brand_name: "Dr. Reddy's Semaglutide Injection",
    manufacturer: "Dr. Reddy's Laboratories",
    approved_date: "2026-04-28",
    launched_date: "2026-05-15",
    price_cad_low: 100,
    price_cad_high: 150,
    indication: "Type 2 Diabetes",
    status: "Launched",
    available_at: "Major pharmacy chains",
    notes: "First generic semaglutide approved in a G7 country.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "2",
    brand_name: "Apo-Semaglutide Injection",
    manufacturer: "Apotex Inc.",
    approved_date: "2026-05-01",
    launched_date: "2026-05-14",
    price_cad_low: 100,
    price_cad_high: 150,
    indication: "Type 2 Diabetes",
    status: "Launched",
    available_at: "Major pharmacy chains",
    notes: "Canada's largest domestic generic manufacturer. ~⅓ the price of Ozempic.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "3",
    brand_name: "Sandoz — Pending",
    manufacturer: "Sandoz Canada",
    approved_date: null,
    launched_date: null,
    price_cad_low: null,
    price_cad_high: null,
    indication: "Type 2 Diabetes",
    status: "Pending",
    available_at: "—",
    notes: "Submission under Health Canada review.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "4",
    brand_name: "Teva Canada — Pending",
    manufacturer: "Teva Canada",
    approved_date: null,
    launched_date: null,
    price_cad_low: null,
    price_cad_high: null,
    indication: "Type 2 Diabetes",
    status: "Pending",
    available_at: "—",
    notes: "Submission under Health Canada review.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "5",
    brand_name: "6+ Other Manufacturers",
    manufacturer: "Various",
    approved_date: null,
    launched_date: null,
    price_cad_low: null,
    price_cad_high: null,
    indication: "Type 2 Diabetes",
    status: "Pending",
    available_at: "—",
    notes: "Health Canada is reviewing 6+ additional submissions. Decisions expected throughout 2026.",
    updated_at: "2026-05-21T00:00:00Z",
  },
];

const SEED_PROVIDERS: ProviderEntry[] = [
  {
    id: "p1",
    provider_name: "Hims & Hers",
    provider_type: "Telehealth",
    product: "Generic Semaglutide",
    price_cad: 149,
    price_note: "Includes consultation & care team access",
    consultation_included: true,
    requires_own_rx: false,
    availability: "Available",
    ships_to: "All provinces",
    url: "https://www.hims.com/ca",
    last_verified: "2026-05-21",
    sort_order: 1,
    notes: "Launched generic semaglutide in Canada on May 21, 2026. Uses Apotex Apo-Semaglutide.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p2",
    provider_name: "Felix Health",
    provider_type: "Telehealth",
    product: "Generic Semaglutide",
    price_cad: 150,
    price_note: "Includes consultation. Lower than former brand price by up to 65%.",
    consultation_included: true,
    requires_own_rx: false,
    availability: "Available",
    ships_to: "All provinces",
    url: "https://www.felixforyou.ca",
    last_verified: "2026-05-21",
    sort_order: 2,
    notes: "Was charging $312/pen for brand Ozempic. Switched to generic with significant price reduction.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p3",
    provider_name: "Shoppers Drug Mart",
    provider_type: "Retail Pharmacy",
    product: "Generic Semaglutide",
    price_cad: 114,
    price_note: "Generic price — medication only. Need own prescription.",
    consultation_included: false,
    requires_own_rx: true,
    availability: "Available",
    ships_to: "All provinces",
    url: "https://www.shoppersdrugmart.ca",
    last_verified: "2026-05-21",
    sort_order: 3,
    notes: "Inventory arriving at select locations. Brand Ozempic was $271/mo.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p4",
    provider_name: "Costco Pharmacy",
    provider_type: "Retail Pharmacy",
    product: "Brand Ozempic",
    price_cad: 252,
    price_note: "Cheapest brand Ozempic in Canada. Need Costco membership + own prescription.",
    consultation_included: false,
    requires_own_rx: true,
    availability: "Available",
    ships_to: "Select provinces (in-store)",
    url: "https://www.costco.ca/pharmacy",
    last_verified: "2026-05-21",
    sort_order: 4,
    notes: "Generic semaglutide expected — will likely be cheapest retail option once in stock.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p5",
    provider_name: "PocketPills",
    provider_type: "Online Pharmacy",
    product: "Generic Semaglutide",
    price_cad: 114,
    price_note: "Generic price — delivered to your door. Need own prescription.",
    consultation_included: false,
    requires_own_rx: true,
    availability: "Coming Soon",
    ships_to: "Most provinces",
    url: "https://www.pocketpills.com",
    last_verified: "2026-05-21",
    sort_order: 5,
    notes: "Online mail-order pharmacy. Brand Ozempic was $271/mo. Generic arriving.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p6",
    provider_name: "Phoenix",
    provider_type: "Telehealth",
    product: "Brand Ozempic",
    price_cad: 299,
    price_note: "Includes consultation (baked into medication price). No separate fee.",
    consultation_included: true,
    requires_own_rx: false,
    availability: "Available",
    ships_to: "All provinces",
    url: "https://www.phoenix.ca",
    last_verified: "2026-05-21",
    sort_order: 6,
    notes: "Men's health focus but open to all. List price $375 — 20% discount brings to $299. Generic coming.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p7",
    provider_name: "Rexall",
    provider_type: "Retail Pharmacy",
    product: "Generic Semaglutide",
    price_cad: 114,
    price_note: "Generic arriving — medication only. Need own prescription.",
    consultation_included: false,
    requires_own_rx: true,
    availability: "Coming Soon",
    ships_to: "Select provinces (in-store)",
    url: "https://www.rexall.ca",
    last_verified: "2026-05-21",
    sort_order: 7,
    notes: "Brand Ozempic was $318 + $12.49 dispensing fee. Generic shipment arriving end of May.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p8",
    provider_name: "Maple",
    provider_type: "Telehealth",
    product: "Brand Ozempic",
    price_cad: null,
    price_note: "$69 one-time consultation, then medication cost separately",
    consultation_included: false,
    requires_own_rx: false,
    availability: "Available",
    ships_to: "All provinces & territories",
    url: "https://www.getmaple.ca",
    last_verified: "2026-05-21",
    sort_order: 8,
    notes: "Only option covering Quebec & NB. Connects you to a GP who prescribes Ozempic where appropriate.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p9",
    provider_name: "Raven",
    provider_type: "Telehealth",
    product: "Brand Ozempic / Wegovy",
    price_cad: null,
    price_note: "Pricing disclosed after intake assessment",
    consultation_included: true,
    requires_own_rx: false,
    availability: "Available",
    ships_to: "9 provinces",
    url: "https://www.getraven.com",
    last_verified: "2026-05-21",
    sort_order: 9,
    notes: "Focused on weight loss patients. Also carries Wegovy. Generic semaglutide status TBD.",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "p10",
    provider_name: "London Drugs",
    provider_type: "Retail Pharmacy",
    product: "Generic Semaglutide",
    price_cad: 114,
    price_note: "Generic arriving — medication only. Need own prescription.",
    consultation_included: false,
    requires_own_rx: true,
    availability: "Coming Soon",
    ships_to: "BC, AB, SK, MB",
    url: "https://www.londondrugs.com",
    last_verified: "2026-05-21",
    sort_order: 10,
    notes: "Western Canada only. Generic expected in stock late May 2026.",
    updated_at: "2026-05-21T00:00:00Z",
  },
];

// ─── Supabase fetchers ─────────────────────────────────────────────────────────

async function supabaseFetch<T>(table: string, order: string, fallback: T[]): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;
  try {
    const res = await fetch(`${url}/rest/v1/${table}?order=${order}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as T[];
    return data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function fmtPrice(low: number | null, high: number | null) {
  if (low === null && high === null) return "—";
  if (low !== null && high !== null && low !== high) return `$${low}–$${high}/mo`;
  return `$${low ?? high}/mo`;
}

const GENERIC_STATUS_STYLE: Record<GenericEntry["status"], string> = {
  "On Shelves": "bg-green-100 text-green-800",
  Launched:     "bg-blue-100 text-blue-800",
  Approved:     "bg-yellow-100 text-yellow-800",
  Pending:      "bg-gray-100 text-gray-600",
};

const PROVIDER_AVAIL_STYLE: Record<ProviderEntry["availability"], string> = {
  Available:     "bg-green-100 text-green-800",
  "Coming Soon": "bg-yellow-100 text-yellow-800",
  Waitlist:      "bg-purple-100 text-purple-800",
};

const TYPE_STYLE: Record<ProviderEntry["provider_type"], string> = {
  Telehealth:        "bg-blue-50 text-blue-700 border border-blue-200",
  "Retail Pharmacy": "bg-slate-50 text-slate-700 border border-slate-200",
  "Online Pharmacy": "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

const FAQS = [
  {
    question: "Which is the cheapest way to get generic semaglutide in Canada?",
    answer:
      "For people without a prescription, Hims ($149/mo) and Felix ($150/mo) are the cheapest all-in options — consultation and medication bundled. If you already have a prescription, retail pharmacies like Shoppers Drug Mart, Rexall, or Costco will dispense the generic for around $100–$150/month, with Costco likely to be cheapest once generic stock arrives.",
  },
  {
    question: "Do I need a prescription to get generic semaglutide in Canada?",
    answer:
      "Yes — semaglutide is a prescription drug. Telehealth platforms (Hims, Felix, Phoenix, Maple, Raven) provide the consultation and prescription as part of their service. Retail and online pharmacies (Shoppers, Costco, PocketPills) require you to bring your own prescription from a doctor.",
  },
  {
    question: "Is generic semaglutide the same as Ozempic?",
    answer:
      "Yes, clinically. Health Canada requires bioequivalence — same active ingredient, same dose, same absorption profile. The pen device may look different, but the drug works identically. No re-titration is needed when switching from Ozempic.",
  },
  {
    question: "Can I use generic semaglutide for weight loss?",
    answer:
      "The 2026 generics are approved for Type 2 diabetes only. However, doctors can and do prescribe them off-label for weight loss, just as they currently prescribe brand Ozempic off-label. No generic Wegovy (2.4mg) exists yet.",
  },
  {
    question: "Will prices fall further?",
    answer:
      "Yes. Canada's generic pricing rules reduce the ceiling as more manufacturers enter the market. With 8+ more submissions under Health Canada review, prices are expected to fall further through 2026 — potentially below $100/month at retail once three or more generics compete.",
  },
  {
    question: "Does Costco have generic semaglutide?",
    answer:
      "Not yet as of late May 2026, but it's expected. Costco currently has the cheapest brand Ozempic in Canada (~$252/mo) and will likely offer the cheapest retail price for generic semaglutide once stock arrives. You need a Costco membership and your own prescription.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Generic Semaglutide Canada: Price & Availability Tracker",
    description:
      "Compare generic semaglutide prices across Hims, Felix, Phoenix, Shoppers, Costco and more Canadian providers. Updated weekly.",
    url: "https://weight-loss.ca/generic-semaglutide-canada-tracker",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GenericSemaglutideTrackerPage() {
  const [generics, providers] = await Promise.all([
    supabaseFetch<GenericEntry>("generic_semaglutide_generics", "approved_date.asc.nullslast", SEED_GENERICS),
    supabaseFetch<ProviderEntry>("semaglutide_providers", "sort_order.asc", SEED_PROVIDERS),
  ]);

  const lastUpdated = "May 21, 2026";
  const approvedCount = generics.filter((g) => g.status !== "Pending").length;
  const lowestPrice = providers
    .filter((p) => p.price_cad !== null)
    .sort((a, b) => (a.price_cad ?? 9999) - (b.price_cad ?? 9999))[0];

  const telehealthProviders = providers.filter((p) => p.provider_type === "Telehealth");
  const pharmacyProviders = providers.filter((p) => p.provider_type !== "Telehealth");

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm text-green-700 font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              Updated {lastUpdated}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Generic Semaglutide Canada: Price &amp; Availability Tracker
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mb-6">
              Canada is the first G7 country with generic semaglutide. Compare every provider —
              telehealth clinics, retail pharmacies, and online pharmacies — with real prices
              and availability. Updated weekly.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5">
                <span className="text-2xl font-bold text-green-600">{approvedCount}</span>
                <span className="text-slate-600">generics approved</span>
              </div>
              {lowestPrice && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5">
                  <span className="text-2xl font-bold text-slate-900">${lowestPrice.price_cad}</span>
                  <span className="text-slate-600">lowest price/mo ({lowestPrice.provider_name})</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5">
                <span className="text-2xl font-bold text-blue-600">{providers.length}</span>
                <span className="text-slate-600">providers tracked</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Important note ───────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pt-6 pb-2">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <strong>Note:</strong> Current generics are approved for <strong>Type 2 diabetes only</strong> — not
            officially for weight loss. Doctors can prescribe off-label for weight loss (common practice). No generic
            Wegovy (2.4mg) exists yet.{" "}
            <a href="/generic-semaglutide-canada" className="underline font-medium hover:text-amber-800">
              Full explainer →
            </a>
          </div>
        </section>

        {/* ── Provider price comparison ─────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-display text-2xl font-semibold text-slate-900 mb-1">
            Where to Buy Generic Semaglutide in Canada
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Prices in CAD per month. Telehealth = consultation + prescription included. Retail/online = medication only, need your own prescription.
          </p>

          {/* Telehealth */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Telehealth Clinics — Consultation &amp; Prescription Included
          </h3>
          <div className="grid gap-3 mb-8">
            {telehealthProviders.map((p) => (
              <ProviderCard key={p.id} p={p} />
            ))}
          </div>

          {/* Pharmacies */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Retail &amp; Online Pharmacies — Medication Only (Need Own Prescription)
          </h3>
          <div className="grid gap-3">
            {pharmacyProviders.map((p) => (
              <ProviderCard key={p.id} p={p} />
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Prices verified {lastUpdated}. Retail generic prices estimated from provincial drug plan framework (~$114/4-week supply with 2 generics approved). Actual prices may vary by location. Last verified: {lastUpdated}.
          </p>
        </section>

        {/* ── HC Approvals table ───────────────────────────────────────────── */}
        <section className="bg-slate-50 border-y border-slate-100 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-1">
              Health Canada Approval Tracker
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Every generic semaglutide submission to Health Canada — approved, launched, and pending.
            </p>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    <th className="px-4 py-3 font-semibold text-slate-700">Brand / Manufacturer</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">HC Approved</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Launched</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Est. Price/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {generics.map((g, i) => (
                    <tr key={g.id} className={`border-b border-slate-100 last:border-0 ${i % 2 ? "bg-slate-50/40" : "bg-white"}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{g.brand_name}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{g.manufacturer}</div>
                        {g.notes && <div className="text-slate-400 text-xs mt-1 italic">{g.notes}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${GENERIC_STATUS_STYLE[g.status]}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(g.approved_date)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(g.launched_date)}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {fmtPrice(g.price_cad_low, g.price_cad_high)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {generics.map((g) => (
                <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{g.brand_name}</div>
                      <div className="text-slate-400 text-xs">{g.manufacturer}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${GENERIC_STATUS_STYLE[g.status]}`}>
                      {g.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                    <div><span className="text-slate-400">Approved: </span>{fmtDate(g.approved_date)}</div>
                    <div><span className="text-slate-400">Launched: </span>{fmtDate(g.launched_date)}</div>
                    <div className="col-span-2 font-medium text-slate-900">{fmtPrice(g.price_cad_low, g.price_cad_high)}</div>
                  </div>
                  {g.notes && <p className="text-xs text-slate-400 italic mt-2">{g.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Canada was first ─────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-3">
            Why Canada Was First
          </h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            Canada became the first G7 country to approve generic semaglutide because Novo Nordisk
            failed to renew a CAD $250 government patent maintenance fee, causing a key Canadian
            patent to lapse in 2025. This opened the door for generic manufacturers immediately.
            Dr. Reddy&apos;s Laboratories received the first approval April 28, 2026;
            Apotex followed May 1, 2026.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Under Canada&apos;s generic pricing framework, prices step down as more manufacturers
            enter. With 8+ submissions under review, analysts expect monthly costs to fall below
            $100 once three or more generics compete — likely by late 2026.
          </p>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-t border-slate-100 px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.question} className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.question}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related guides ────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/generic-semaglutide-canada", title: "Generic Ozempic in Canada: Full Explainer", desc: "Everything about the new generics — approvals, pricing, and what it means for you." },
              { href: "/how-to-get-generic-semaglutide-in-canada", title: "How to Get Generic Semaglutide", desc: "Step-by-step: switch from Ozempic, get a prescription, and save $150+/mo." },
              { href: "/ozempic-review", title: "Ozempic Review (Canada)", desc: "In-depth review of brand-name semaglutide for weight loss." },
              { href: "/wegovy-review", title: "Wegovy Review (Canada)", desc: "Review of semaglutide 2.4mg — the weight loss formulation." },
            ].map((l) => (
              <a key={l.href} href={l.href} className="block border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                <div className="font-medium text-slate-900 text-sm mb-1">{l.title}</div>
                <div className="text-slate-500 text-xs">{l.desc}</div>
              </a>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

// ─── Provider card component ──────────────────────────────────────────────────

function ProviderCard({ p }: { p: ProviderEntry }) {
  const hasPrice = p.price_cad !== null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-slate-300 transition-colors">
      {/* Name + type */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900">{p.provider_name}</span>
          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${TYPE_STYLE[p.provider_type]}`}>
            {p.provider_type}
          </span>
          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${PROVIDER_AVAIL_STYLE[p.availability]}`}>
            {p.availability}
          </span>
        </div>
        <div className="text-xs text-slate-500 mb-1">
          <span className="font-medium text-slate-700">{p.product}</span>
          {p.price_note && <> · {p.price_note}</>}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          {p.ships_to && <span>Ships to: {p.ships_to}</span>}
          {p.consultation_included && (
            <span className="text-green-700">✓ Consultation included</span>
          )}
          {p.requires_own_rx && (
            <span className="text-slate-500">⚠ Need own prescription</span>
          )}
          {p.last_verified && <span>Verified {fmtDate(p.last_verified)}</span>}
        </div>
        {p.notes && <p className="text-xs text-slate-400 italic mt-1.5">{p.notes}</p>}
      </div>

      {/* Price + CTA */}
      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
        <div className="text-right">
          {hasPrice ? (
            <>
              <div className="text-2xl font-bold text-slate-900">${p.price_cad}</div>
              <div className="text-xs text-slate-400">per month</div>
            </>
          ) : (
            <div className="text-sm text-slate-400 italic">See site</div>
          )}
        </div>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            Visit site →
          </a>
        )}
      </div>
    </div>
  );
}
