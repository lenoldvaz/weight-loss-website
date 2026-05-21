import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GLP-1 Price Comparison Canada — Ozempic, Wegovy & Generic Semaglutide",
  description:
    "Compare Ozempic, Wegovy, Mounjaro, Zepbound, and generic semaglutide prices across 15+ Canadian pharmacies and telehealth providers. Updated weekly. All prices in CAD.",
  alternates: { canonical: "https://weight-loss.ca" },
};

const FEATURES = [
  {
    href: "/glp1-prices",
    icon: "💊",
    label: "GLP-1 Price Comparison",
    desc: "Ozempic, Wegovy, Mounjaro, Zepbound & generics across 15+ pharmacies",
    badge: "Most popular",
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    href: "/coverage-checker",
    icon: "🛡️",
    label: "Coverage Checker",
    desc: "Find out if your provincial plan or private insurance covers your medication",
    badge: null,
    badgeColor: "",
  },
  {
    href: "/savings-cards",
    icon: "💳",
    label: "Manufacturer Savings Cards",
    desc: "Reduce your cost by $30–$171/month with official manufacturer programs",
    badge: "Save up to $171/mo",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    href: "/telehealth",
    icon: "🩺",
    label: "Telehealth Comparison",
    desc: "Get a prescription online — compare 10+ Canadian telehealth providers",
    badge: null,
    badgeColor: "",
  },
  {
    href: "/generic-semaglutide-canada-tracker",
    icon: "📈",
    label: "Generic Semaglutide Tracker",
    desc: "Track Health Canada approvals, launch dates, and prices in real time",
    badge: "Generics live from $114",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    href: "/semaglutide-news",
    icon: "📰",
    label: "Daily News Feed",
    desc: "Aggregated Canadian news on generic semaglutide and GLP-1 medications",
    badge: "Updated daily",
    badgeColor: "bg-zinc-100 text-zinc-700",
  },
];

const PRICE_PREVIEW = [
  { rank: 1, pharmacy: "Hims & Hers", type: "Telehealth", drug: "Generic Semaglutide", price: "$149", note: "Consultation included", href: "/glp1-prices" },
  { rank: 2, pharmacy: "Felix Health", type: "Telehealth", drug: "Generic Semaglutide", price: "$150", note: "Consultation included", href: "/glp1-prices" },
  { rank: 3, pharmacy: "Shoppers Drug Mart", type: "Retail", drug: "Generic Semaglutide", price: "$114", note: "Own Rx needed", href: "/glp1-prices" },
  { rank: 4, pharmacy: "Costco Pharmacy", type: "Retail", drug: "Ozempic 1mg", price: "$230", note: "Membership required", href: "/glp1-prices" },
  { rank: 5, pharmacy: "London Drugs", type: "Retail", drug: "Ozempic 1mg", price: "$260", note: "BC, AB, SK, MB", href: "/glp1-prices" },
];

const TYPE_STYLE: Record<string, string> = {
  Telehealth: "bg-blue-50 text-blue-700",
  Retail: "bg-zinc-100 text-zinc-600",
  Online: "bg-indigo-50 text-indigo-700",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* ── Dark Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-16 pb-20 sm:pt-20 sm:pb-28 relative overflow-hidden">
          {/* Subtle grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Green glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #22c55e 0%, transparent 70%)" }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Breaking news pill */}
            <Link
              href="/generic-semaglutide-canada-tracker"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-forest-500)]/10 border border-[var(--color-forest-500)]/30 px-4 py-1.5 text-xs font-semibold text-[var(--color-forest-400)] hover:bg-[var(--color-forest-500)]/20 transition-colors mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-forest-400)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-forest-400)]" />
              </span>
              Generic Ozempic now available from $114/mo — See tracker →
            </Link>

            {/* Headline */}
            <h1 className="font-display text-4xl font-black text-white leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Compare GLP-1 Prices<br />
              <span style={{
                background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Across Canada
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base text-zinc-400 leading-relaxed sm:text-lg mb-10">
              Ozempic, Wegovy, Mounjaro, Zepbound, and generic semaglutide — compared
              across 15+ pharmacies and telehealth providers in every province. Updated weekly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/glp1-prices"
                className="w-full sm:w-auto rounded-xl bg-[var(--color-forest-500)] px-7 py-3.5 text-sm font-bold text-white hover:bg-[var(--color-forest-400)] transition-colors shadow-lg shadow-green-900/30"
              >
                Compare Prices →
              </Link>
              <Link
                href="/coverage-checker"
                className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800/50 px-7 py-3.5 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
              >
                Check Coverage
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { num: "15+", label: "pharmacies tracked" },
                { num: "6", label: "drugs compared" },
                { num: "13", label: "provinces & territories" },
                { num: "Weekly", label: "price verification" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-black text-white">{s.num}</div>
                  <div className="text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Grid ──────────────────────────────────────────────────── */}
        <section className="bg-zinc-50 border-b border-zinc-200 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Everything you need</p>
              <h2 className="font-display text-2xl font-black text-zinc-900 sm:text-3xl">
                Canada&apos;s most complete GLP-1 resource
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-[var(--color-forest-300)] hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{f.icon}</span>
                    {f.badge && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.badgeColor}`}>
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-zinc-900 mb-1 group-hover:text-[var(--color-forest-700)] transition-colors">
                    {f.label}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Price Preview Table ───────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Lowest prices right now</p>
                <h2 className="font-display text-2xl font-black text-zinc-900">Today&apos;s Best GLP-1 Prices</h2>
              </div>
              <Link href="/glp1-prices" className="text-sm font-semibold text-[var(--color-forest-600)] hover:text-[var(--color-forest-700)] transition-colors hidden sm:block">
                Full comparison →
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Pharmacy</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden sm:table-cell">Drug</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Price/mo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-100">
                  {PRICE_PREVIEW.map((row) => (
                    <tr key={row.rank} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3.5 text-zinc-400 font-mono text-xs">{row.rank}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-zinc-900">{row.pharmacy}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${TYPE_STYLE[row.type]}`}>{row.type}</span>
                          <span className="text-xs text-zinc-400">{row.note}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-600 hidden sm:table-cell">{row.drug}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-lg font-black text-zinc-900">{row.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-zinc-400">Prices verified May 2026 · CAD · Includes all fees</p>
                <Link href="/glp1-prices" className="text-xs font-bold text-[var(--color-forest-600)] hover:text-[var(--color-forest-700)]">
                  See all 15+ pharmacies →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why trust us ─────────────────────────────────────────────────── */}
        <section className="bg-[var(--color-dark-950)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: "🔍", heading: "Independent", body: "No paid placements. No pharmacy or manufacturer affiliation. We make money from display advertising, not referrals." },
                { icon: "📅", heading: "Weekly verified", body: "High-traffic pharmacy and drug combinations are verified weekly. All others monthly. Each listing shows its verification date." },
                { icon: "🍁", heading: "Canada-only", body: "Every price is in CAD. Every pharmacy is Canadian. We cover all 13 provinces and territories." },
              ].map((item) => (
                <div key={item.heading}>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-display text-base font-bold text-white mb-2">{item.heading}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Province coverage strip ───────────────────────────────────────── */}
        <section className="border-y border-zinc-200 bg-zinc-50 px-4 py-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">All provinces covered</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-zinc-600">
              {["Ontario", "British Columbia", "Alberta", "Quebec", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland", "Yukon", "NWT", "Nunavut"].map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Email capture ─────────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <h2 className="font-display text-2xl font-black text-zinc-900 mb-3">
              Get price drop alerts
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              We&apos;ll email you when a pharmacy drops their price or a new generic launches.
            </p>
            <form
              action="/api/subscribe"
              method="POST"
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.ca"
                required
                className="flex-1 h-11 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-400)] focus:border-[var(--color-forest-400)] transition"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-[var(--color-forest-500)] px-5 text-sm font-bold text-white hover:bg-[var(--color-forest-600)] transition-colors"
              >
                Notify me
              </button>
            </form>
            <p className="mt-3 text-xs text-zinc-400">No spam. Unsubscribe any time.</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
