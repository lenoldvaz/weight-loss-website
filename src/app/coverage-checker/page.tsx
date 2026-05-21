import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoverageChecker from "./CoverageChecker";

export const metadata: Metadata = {
  title: "GLP-1 Insurance Coverage Checker Canada — Ozempic, Wegovy, Mounjaro",
  description:
    "Check if your provincial drug plan covers Ozempic, Wegovy, Mounjaro, Zepbound, or generic semaglutide. Province-by-province coverage guide for all GLP-1 medications in Canada.",
  alternates: { canonical: "https://weight-loss.ca/coverage-checker" },
};

export default function CoverageCheckerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-[var(--color-dark-950)] px-4 pt-12 pb-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl mb-4 tracking-tight">
              GLP-1 Coverage Checker
            </h1>
            <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
              Find out if your provincial drug plan covers Ozempic, Wegovy, Mounjaro, Zepbound,
              or generic semaglutide — and what conditions apply. Takes 30 seconds.
            </p>
          </div>
        </section>

        {/* Tool */}
        <section className="px-4 py-12 sm:px-6">
          <CoverageChecker />
        </section>

        {/* Provincial overview table */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-xl font-black text-zinc-900 mb-2">Provincial Coverage Overview</h2>
            <p className="text-sm text-zinc-400 mb-6">For Type 2 diabetes indication. Weight loss use is generally not covered provincially.</p>
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Province</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Semaglutide (T2D)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { province: "Ontario", plan: "ODB / Trillium", status: "Partial", note: "Listed for T2D; Trillium income-tested" },
                    { province: "British Columbia", plan: "Fair PharmaCare", status: "Partial", note: "Income-tested; deductibles apply" },
                    { province: "Alberta", plan: "Alberta Blue Cross (Gov)", status: "Partial", note: "Special authorization required" },
                    { province: "Quebec", plan: "RAMQ", status: "Partial", note: "Ozempic listed; generic listing pending" },
                    { province: "Manitoba", plan: "Pharmacare", status: "Unknown", note: "Confirm with province" },
                    { province: "Saskatchewan", plan: "Saskatchewan Drug Plan", status: "Partial", note: "Exception Drug Status may apply" },
                    { province: "Nova Scotia", plan: "NS Pharmacare", status: "Partial", note: "For qualifying seniors/low-income" },
                    { province: "New Brunswick", plan: "NB Drug Plan", status: "Unknown", note: "Confirm with pharmacist" },
                    { province: "PEI", plan: "PEI Pharmacare", status: "Unknown", note: "Confirm with pharmacist" },
                    { province: "Newfoundland", plan: "NL Prescription Drug Program", status: "Partial", note: "Income-tested" },
                  ].map((row) => (
                    <tr key={row.province} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.province}</td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{row.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.status === "Partial" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs hidden sm:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-400 mt-3">
              Coverage rules change frequently. Always verify with your provincial drug plan or pharmacist.
            </p>
          </div>
        </section>

        {/* Related */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/glp1-prices", title: "Price Comparison", desc: "Find the cheapest pharmacy if you're paying out of pocket." },
                { href: "/savings-cards", title: "Savings Cards", desc: "Manufacturer programs that cut costs by up to $171/mo." },
                { href: "/telehealth", title: "Telehealth Providers", desc: "Get a prescription online — no in-person visit needed." },
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
