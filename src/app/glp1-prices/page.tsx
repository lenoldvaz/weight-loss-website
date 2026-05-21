import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";
import PriceTable, { type PriceRow } from "./PriceTable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "GLP-1 Prices Canada 2026 — Ozempic, Wegovy, Mounjaro, Generic Semaglutide",
  description:
    "Compare Ozempic, Wegovy, Mounjaro, Zepbound, and generic semaglutide prices across 15+ Canadian pharmacies. Filter by province, drug, and prescription status. Updated weekly.",
  alternates: { canonical: "https://weight-loss.ca/glp1-prices" },
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_PRICES: PriceRow[] = [
  // Generic Semaglutide — Available Now
  { id: "g1", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 114, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: "Need own prescription. Stock at select locations.", verified_at: "2026-05-21" },
  { id: "g2", pharmacy_name: "PocketPills", pharmacy_type: "Online", province: "Most provinces", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 114, dispensing_fee: 0, requires_rx: true, url: "https://www.pocketpills.com", notes: "Mail-order. Own prescription required.", verified_at: "2026-05-21", is_estimate: true },
  { id: "g3", pharmacy_name: "Rexall", pharmacy_type: "Retail", province: "All", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 114, dispensing_fee: 0, requires_rx: true, url: "https://www.rexall.ca", notes: "Stock arriving. Own prescription required.", verified_at: "2026-05-21", is_estimate: true },
  { id: "g4", pharmacy_name: "London Drugs", pharmacy_type: "Retail", province: "BC, AB, SK, MB", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 114, dispensing_fee: 0, requires_rx: true, url: "https://www.londondrugs.com", notes: "Western Canada only.", verified_at: "2026-05-21", is_estimate: true },
  { id: "g5", pharmacy_name: "Hims & Hers", pharmacy_type: "Telehealth", province: "All", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 149, dispensing_fee: 0, requires_rx: false, url: "https://www.hims.com/ca", notes: "Consultation + medication bundled. Uses Apo-Semaglutide.", verified_at: "2026-05-21" },
  { id: "g6", pharmacy_name: "Felix Health", pharmacy_type: "Telehealth", province: "All", drug_name: "Generic Semaglutide", dosage: "0.25mg–1mg", price_cad: 150, dispensing_fee: 0, requires_rx: false, url: "https://www.felixforyou.ca", notes: "Was $312/pen for brand Ozempic. Consultation included.", verified_at: "2026-05-21" },

  // Plosbrio — Novo Nordisk authorized generic of Ozempic (approved Dec 2025)
  { id: "pl1", pharmacy_name: "Costco Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Plosbrio", dosage: "0.25mg–1mg", price_cad: 155, dispensing_fee: 0, requires_rx: true, url: "https://www.costco.ca/pharmacy", notes: "Novo Nordisk authorized generic of Ozempic. Membership required.", verified_at: "2026-05-21" },
  { id: "pl2", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Plosbrio", dosage: "0.25mg–1mg", price_cad: 175, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: "Authorized generic of Ozempic by Novo Nordisk.", verified_at: "2026-05-21" },

  // Ozempic
  { id: "o1", pharmacy_name: "Costco Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 230, dispensing_fee: 0, requires_rx: true, url: "https://www.costco.ca/pharmacy", notes: "Membership required. Cheapest brand Ozempic in Canada.", verified_at: "2026-05-21" },
  { id: "o2", pharmacy_name: "Walmart Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 262, dispensing_fee: 0, requires_rx: true, url: "https://www.walmart.ca/pharmacy", notes: null, verified_at: "2026-05-21" },
  { id: "o3", pharmacy_name: "London Drugs", pharmacy_type: "Retail", province: "BC, AB, SK, MB", drug_name: "Ozempic", dosage: "1mg", price_cad: 260, dispensing_fee: 0, requires_rx: true, url: "https://www.londondrugs.com", notes: "Western Canada only.", verified_at: "2026-05-21" },
  { id: "o4", pharmacy_name: "Felix Health", pharmacy_type: "Telehealth", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 271, dispensing_fee: 0, requires_rx: false, url: "https://www.felixforyou.ca", notes: "Consultation included.", verified_at: "2026-05-21" },
  { id: "o5", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 271, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: null, verified_at: "2026-05-21" },
  { id: "o6", pharmacy_name: "PocketPills", pharmacy_type: "Online", province: "Most provinces", drug_name: "Ozempic", dosage: "1mg", price_cad: 271, dispensing_fee: 0, requires_rx: true, url: "https://www.pocketpills.com", notes: "Mail-order delivery.", verified_at: "2026-05-21" },
  { id: "o7", pharmacy_name: "Phoenix", pharmacy_type: "Telehealth", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 299, dispensing_fee: 0, requires_rx: false, url: "https://www.phoenix.ca", notes: "Consultation included. 20% discount from list price.", verified_at: "2026-05-21" },
  { id: "o8", pharmacy_name: "Rexall", pharmacy_type: "Retail", province: "All", drug_name: "Ozempic", dosage: "1mg", price_cad: 318, dispensing_fee: 12.49, requires_rx: true, url: "https://www.rexall.ca", notes: "Includes $12.49 dispensing fee.", verified_at: "2026-05-21" },
  { id: "o9", pharmacy_name: "Maple", pharmacy_type: "Telehealth", province: "All provinces & territories", drug_name: "Ozempic", dosage: "1mg", price_cad: 271, dispensing_fee: 0, requires_rx: false, url: "https://www.getmaple.ca", notes: "$85 one-time consult fee separate. Only telehealth covering QC & NB.", verified_at: "2026-05-21" },

  // Wegovy
  { id: "w1", pharmacy_name: "Costco Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Wegovy", dosage: "0.25mg–2.4mg", price_cad: 350, dispensing_fee: 0, requires_rx: true, url: "https://www.costco.ca/pharmacy", notes: "Membership required.", verified_at: "2026-05-21" },
  { id: "w2", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Wegovy", dosage: "0.25mg–2.4mg", price_cad: 420, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: null, verified_at: "2026-05-21" },
  { id: "w3", pharmacy_name: "Felix Health", pharmacy_type: "Telehealth", province: "All", drug_name: "Wegovy", dosage: "0.25mg–2.4mg", price_cad: 450, dispensing_fee: 0, requires_rx: false, url: "https://www.felixforyou.ca", notes: "Consultation included.", verified_at: "2026-05-21" },
  { id: "w4", pharmacy_name: "Raven", pharmacy_type: "Telehealth", province: "ON, BC, AB, MB, SK, NS, NB, PE, NL", drug_name: "Wegovy", dosage: "0.25mg–2.4mg", price_cad: null, dispensing_fee: 0, requires_rx: false, url: "https://www.getraven.com", notes: "Weight-loss focused. Price disclosed after assessment.", verified_at: "2026-05-21" },

  // Mounjaro
  { id: "m1", pharmacy_name: "Costco Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Mounjaro", dosage: "Various strengths", price_cad: 280, dispensing_fee: 0, requires_rx: true, url: "https://www.costco.ca/pharmacy", notes: "Tirzepatide. Membership required.", verified_at: "2026-05-21" },
  { id: "m2", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Mounjaro", dosage: "Various strengths", price_cad: 350, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: "Tirzepatide.", verified_at: "2026-05-21" },
  { id: "m3", pharmacy_name: "Felix Health", pharmacy_type: "Telehealth", province: "All", drug_name: "Mounjaro", dosage: "Various strengths", price_cad: 380, dispensing_fee: 0, requires_rx: false, url: "https://www.felixforyou.ca", notes: "Consultation included.", verified_at: "2026-05-21" },
  { id: "m4", pharmacy_name: "PocketPills", pharmacy_type: "Online", province: "Most provinces", drug_name: "Mounjaro", dosage: "Various strengths", price_cad: 340, dispensing_fee: 0, requires_rx: true, url: "https://www.pocketpills.com", notes: "Mail-order delivery.", verified_at: "2026-05-21" },

  // Zepbound
  { id: "z1", pharmacy_name: "Costco Pharmacy", pharmacy_type: "Retail", province: "All", drug_name: "Zepbound", dosage: "Various strengths", price_cad: 315, dispensing_fee: 0, requires_rx: true, url: "https://www.costco.ca/pharmacy", notes: "Tirzepatide for weight loss. Membership required.", verified_at: "2026-05-21" },
  { id: "z2", pharmacy_name: "Shoppers Drug Mart", pharmacy_type: "Retail", province: "All", drug_name: "Zepbound", dosage: "Various strengths", price_cad: 390, dispensing_fee: 0, requires_rx: true, url: "https://www.shoppersdrugmart.ca", notes: "Tirzepatide for weight loss.", verified_at: "2026-05-21" },
];

async function getPrices(): Promise<PriceRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return SEED_PRICES;
  try {
    const res = await fetch(
      `${url}/rest/v1/glp1_prices?order=price_cad.asc.nullslast`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return SEED_PRICES;
    const data = (await res.json()) as PriceRow[];
    return data.length > 0 ? data : SEED_PRICES;
  } catch {
    return SEED_PRICES;
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "GLP-1 Prices Canada 2026",
  description: "Compare Ozempic, Wegovy, Mounjaro, Zepbound, and generic semaglutide prices across 15+ Canadian pharmacies.",
  url: "https://weight-loss.ca/glp1-prices",
};

export default async function GLP1PricesPage() {
  const prices = await getPrices();
  const lowestGeneric = prices.filter((p) => p.drug_name === "Generic Semaglutide" && p.price_cad !== null).sort((a, b) => (a.price_cad ?? 9999) - (b.price_cad ?? 9999))[0];
  const lowestOzempic = prices.filter((p) => p.drug_name === "Ozempic" && p.price_cad !== null).sort((a, b) => (a.price_cad ?? 9999) - (b.price_cad ?? 9999))[0];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-12 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs text-zinc-400 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Updated May 2026 · Prices verified weekly
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl mb-4 tracking-tight">
              GLP-1 Prices Canada
            </h1>
            <p className="text-zinc-400 text-base max-w-2xl mb-8 leading-relaxed">
              Compare Ozempic, Wegovy, Mounjaro, Zepbound, and generic semaglutide across 15+ Canadian
              pharmacies. Filter by province, drug, and whether you already have a prescription.
            </p>
            <div className="flex flex-wrap gap-4">
              {lowestGeneric && (
                <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-5 py-3">
                  <div className="text-2xl font-black text-white">${lowestGeneric.price_cad}/mo</div>
                  <div className="text-xs text-zinc-400">Generic semaglutide from</div>
                </div>
              )}
              {lowestOzempic && (
                <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-5 py-3">
                  <div className="text-2xl font-black text-white">${lowestOzempic.price_cad}/mo</div>
                  <div className="text-xs text-zinc-400">Brand Ozempic from</div>
                </div>
              )}
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-5 py-3">
                <div className="text-2xl font-black text-white">{prices.length}</div>
                <div className="text-xs text-zinc-400">price listings</div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <div className="mx-auto max-w-5xl text-xs text-blue-800 flex gap-2">
            <span className="shrink-0">ℹ</span>
            <span>
              Prices are informational only and may vary by location and time. Generic semaglutide is currently approved for Type 2 diabetes — off-label prescribing for weight loss is common but discuss with your doctor.{" "}
              <a href="/generic-semaglutide-canada" className="underline font-medium">Full explainer →</a>
            </span>
          </div>
        </div>

        {/* Table */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <PriceTable rows={prices} />
          </div>
        </section>

        {/* Drug guide */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-xl font-black text-zinc-900 mb-6">Drug Guide</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Generic Semaglutide", sub: "Apo-Semaglutide, Dr. Reddy's", tag: "Cheapest option", tagColor: "bg-green-100 text-green-800", body: "Health Canada-approved generic of Ozempic. Same active ingredient, same dose. Available from $114/mo at retail pharmacies or $149/mo with telehealth consultation included." },
                { name: "Plosbrio", sub: "Novo Nordisk authorized generic", tag: "Authorized generic", tagColor: "bg-blue-100 text-blue-800", body: "Novo Nordisk's own lower-cost version of Ozempic, approved December 2025. Same drug, same manufacturer, different brand name and lower price." },
                { name: "Ozempic", sub: "Semaglutide 0.25–2mg", tag: "Brand name", tagColor: "bg-zinc-100 text-zinc-700", body: "The original semaglutide injection by Novo Nordisk. Approved for Type 2 diabetes. Widely prescribed off-label for weight loss. Available from $230/mo at Costco." },
                { name: "Wegovy", sub: "Semaglutide 2.4mg", tag: "Weight loss", tagColor: "bg-purple-100 text-purple-800", body: "Higher-dose semaglutide specifically approved for weight management. Same active ingredient as Ozempic at a higher dose. From $350/mo at Costco." },
                { name: "Mounjaro", sub: "Tirzepatide", tag: "Dual GIP/GLP-1", tagColor: "bg-orange-100 text-orange-800", body: "Targets both GIP and GLP-1 receptors. Eli Lilly's rival to Ozempic. Clinical trials show greater weight loss vs semaglutide. From $280/mo at Costco." },
                { name: "Zepbound", sub: "Tirzepatide for weight loss", tag: "Weight loss", tagColor: "bg-pink-100 text-pink-800", body: "Same tirzepatide as Mounjaro, specifically approved for weight management. From $315/mo at Costco. Manufacturer savings cards available." },
              ].map((drug) => (
                <div key={drug.name} className="bg-white border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-zinc-900 text-sm">{drug.name}</h3>
                      <p className="text-xs text-zinc-400">{drug.sub}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${drug.tagColor}`}>{drug.tag}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{drug.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-lg font-bold text-zinc-900 mb-4">Related tools</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/savings-cards", title: "Savings Cards", desc: "Cut your cost by $30–$171/mo with manufacturer programs." },
                { href: "/coverage-checker", title: "Coverage Checker", desc: "Find out if your provincial plan covers your medication." },
                { href: "/telehealth", title: "Telehealth Providers", desc: "Get a prescription online — no in-person visit required." },
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
