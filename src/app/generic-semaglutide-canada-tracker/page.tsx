import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Generic Semaglutide Canada: Price & Availability Tracker (2026)",
  description:
    "Track every Health Canada-approved generic semaglutide. Updated weekly with manufacturer names, approval dates, launch dates, pricing, and pharmacy availability.",
  alternates: {
    canonical: "https://weight-loss.ca/generic-semaglutide-canada-tracker",
  },
};

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

const SEED_DATA: GenericEntry[] = [
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
    brand_name: "Pending — Sandoz",
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
    brand_name: "Pending — Teva Canada",
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
    brand_name: "Pending — 6+ others",
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

async function getGenerics(): Promise<GenericEntry[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return SEED_DATA;
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/generic_semaglutide_generics?order=approved_date.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return SEED_DATA;
    const data = (await res.json()) as GenericEntry[];
    return data.length > 0 ? data : SEED_DATA;
  } catch {
    return SEED_DATA;
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(low: number | null, high: number | null): string {
  if (low === null || high === null) return "—";
  return `$${low}–$${high}/mo`;
}

const STATUS_STYLES: Record<GenericEntry["status"], string> = {
  "On Shelves": "bg-green-100 text-green-800",
  Launched: "bg-blue-100 text-blue-800",
  Approved: "bg-yellow-100 text-yellow-800",
  Pending: "bg-gray-100 text-gray-600",
};

const FAQS = [
  {
    question: "Is generic semaglutide the same as Ozempic?",
    answer:
      "Yes, clinically. Health Canada requires bioequivalence — the same active ingredient, same dose, same absorption. The pen device may look different but the drug is identical.",
  },
  {
    question: "Can generic semaglutide be used for weight loss?",
    answer:
      "The 2026 generics are approved for Type 2 diabetes only. Doctors can prescribe them off-label for weight loss, just as they currently do with Ozempic. No generic equivalent of Wegovy (2.4mg) exists yet.",
  },
  {
    question: "Will my provincial drug plan cover generic semaglutide?",
    answer:
      "Provincial plans are adding generic semaglutide to their formularies now that it is Health Canada approved. Coverage varies by province — check your province's formulary or ask your pharmacist for the most current status.",
  },
  {
    question: "When will prices fall further?",
    answer:
      "Canada's generic pricing rules step prices down as more manufacturers enter the market. With 8+ more generic submissions under review, prices are expected to fall further through 2026 — potentially below $100/month once three or more generics are approved.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Generic Semaglutide Canada: Price & Availability Tracker",
    description:
      "Track every Health Canada-approved generic semaglutide, with pricing, launch dates, and pharmacy availability. Updated weekly.",
    url: "https://weight-loss.ca/generic-semaglutide-canada-tracker",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default async function GenericSemaglutideTrackerPage() {
  const generics = await getGenerics();
  const lastUpdated = generics[0]?.updated_at
    ? new Date(generics[0].updated_at).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "May 21, 2026";

  const onShelvesCount = generics.filter(
    (g) => g.status === "On Shelves" || g.status === "Launched"
  ).length;

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm text-green-700 font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Updated {lastUpdated}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Generic Semaglutide Canada: Price &amp; Availability Tracker
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mb-6">
              Canada is the first G7 country to approve generic semaglutide.
              This tracker monitors every Health Canada approval, launch date, and pharmacy
              price — updated weekly as new generics enter the market.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-green-600">{onShelvesCount}</span>
                <span className="text-slate-600">generics available now</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-slate-800">$100–150</span>
                <span className="text-slate-600">per month (vs $250–500 brand)</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-blue-600">8+</span>
                <span className="text-slate-600">more submissions pending</span>
              </div>
            </div>
          </div>
        </section>

        {/* Important Note */}
        <section className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <strong>Important:</strong> The generics approved so far are for{" "}
            <strong>Type 2 diabetes only</strong> — not officially for weight loss.
            No generic equivalent of Wegovy (2.4mg semaglutide for weight loss) exists yet.
            Doctors can prescribe generics off-label for weight loss, but provincial coverage
            for this use is limited.{" "}
            <a
              href="/generic-semaglutide-canada"
              className="underline font-medium hover:text-amber-800"
            >
              Read the full explainer →
            </a>
          </div>
        </section>

        {/* Tracker Table */}
        <section className="max-w-4xl mx-auto px-4 pb-10">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">
            All Generic Semaglutide Approvals in Canada
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-700">Brand / Manufacturer</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">HC Approved</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Launched</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Price/Month (CAD)</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Indication</th>
                </tr>
              </thead>
              <tbody>
                {generics.map((g, i) => (
                  <tr
                    key={g.id}
                    className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{g.brand_name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{g.manufacturer}</div>
                      {g.notes && (
                        <div className="text-slate-400 text-xs mt-1 italic">{g.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[g.status]}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(g.approved_date)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(g.launched_date)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatPrice(g.price_cad_low, g.price_cad_high)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{g.indication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {generics.map((g) => (
              <div key={g.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{g.brand_name}</div>
                    <div className="text-slate-500 text-xs">{g.manufacturer}</div>
                  </div>
                  <span
                    className={`shrink-0 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[g.status]}`}
                  >
                    {g.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Approved: </span>
                    {formatDate(g.approved_date)}
                  </div>
                  <div>
                    <span className="text-slate-400">Launched: </span>
                    {formatDate(g.launched_date)}
                  </div>
                  <div>
                    <span className="text-slate-400">Price: </span>
                    <span className="font-medium text-slate-900">
                      {formatPrice(g.price_cad_low, g.price_cad_high)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">For: </span>
                    {g.indication}
                  </div>
                </div>
                {g.notes && (
                  <p className="text-xs text-slate-400 italic mt-2">{g.notes}</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Prices are estimates based on provincial drug plan frameworks and manufacturer announcements.
            Actual pharmacy prices may vary. Last updated: {lastUpdated}.
          </p>
        </section>

        {/* Context section */}
        <section className="bg-slate-50 border-y border-slate-100 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">
              Why Canada Was First
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Canada became the first G7 country to approve generic semaglutide largely because
              Novo Nordisk failed to renew a CAD $250 government maintenance fee on a key Canadian
              patent, causing it to lapse in 2025. This regulatory gap allowed generic manufacturers
              to file submissions with Health Canada. Dr. Reddy&apos;s Laboratories received
              the first approval on April 28, 2026, followed by Apotex (Canada&apos;s largest
              domestic pharmaceutical company) on May 1, 2026.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Under Canada&apos;s generic pricing framework, prices step down as more manufacturers
              enter the market. Health Canada is currently reviewing 8+ additional submissions.
              Analysts expect monthly costs to fall below $100 once three or more generics
              are competing — likely by late 2026.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">
            Related Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/generic-semaglutide-canada",
                title: "Generic Ozempic in Canada: Full Explainer",
                description: "Everything you need to know about the new generics.",
              },
              {
                href: "/how-to-get-generic-semaglutide-in-canada",
                title: "How to Get Generic Semaglutide in Canada",
                description: "Step-by-step guide to switching from Ozempic and saving money.",
              },
              {
                href: "/ozempic-review",
                title: "Ozempic Review (Canada)",
                description: "In-depth review of brand-name semaglutide for weight loss.",
              },
              {
                href: "/wegovy-review",
                title: "Wegovy Review (Canada)",
                description: "Review of semaglutide 2.4mg — the weight loss formulation.",
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium text-slate-900 text-sm mb-1">{link.title}</div>
                <div className="text-slate-500 text-xs">{link.description}</div>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
