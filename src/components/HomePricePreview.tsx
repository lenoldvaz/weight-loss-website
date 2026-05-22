"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { key: "generic", label: "Generic Sema." },
  { key: "ozempic", label: "Ozempic" },
  { key: "wegovy", label: "Wegovy" },
  { key: "mounjaro", label: "Mounjaro" },
  { key: "zepbound", label: "Zepbound" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type Row = {
  pharmacy: string;
  type: "Telehealth" | "Retail" | "Online";
  price: number | null;
  note: string;
  href: string;
};

const DATA: Record<TabKey, Row[]> = {
  generic: [
    { pharmacy: "Shoppers Drug Mart", type: "Retail",    price: 114,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "PocketPills",        type: "Online",    price: 114,  note: "Own Rx · est.",        href: "/glp1-prices" },
    { pharmacy: "Rexall",             type: "Retail",    price: 114,  note: "Own Rx · est.",        href: "/glp1-prices" },
    { pharmacy: "London Drugs",       type: "Retail",    price: 114,  note: "BC/AB/SK/MB · est.",   href: "/glp1-prices" },
    { pharmacy: "Hims & Hers",        type: "Telehealth", price: 149, note: "Rx included",          href: "/glp1-prices" },
  ],
  ozempic: [
    { pharmacy: "Costco Pharmacy",    type: "Retail",    price: 230,  note: "Membership required",  href: "/glp1-prices" },
    { pharmacy: "London Drugs",       type: "Retail",    price: 260,  note: "BC/AB/SK/MB",          href: "/glp1-prices" },
    { pharmacy: "Walmart Pharmacy",   type: "Retail",    price: 262,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "Shoppers Drug Mart", type: "Retail",    price: 271,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "Felix Health",       type: "Telehealth", price: 271, note: "Rx included",          href: "/glp1-prices" },
  ],
  wegovy: [
    { pharmacy: "Costco Pharmacy",    type: "Retail",    price: 350,  note: "Membership required",  href: "/glp1-prices" },
    { pharmacy: "Shoppers Drug Mart", type: "Retail",    price: 420,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "Felix Health",       type: "Telehealth", price: 450, note: "Rx included",          href: "/glp1-prices" },
    { pharmacy: "Raven",              type: "Telehealth", price: null, note: "Price after assessment", href: "/glp1-prices" },
  ],
  mounjaro: [
    { pharmacy: "Costco Pharmacy",    type: "Retail",    price: 280,  note: "Membership required",  href: "/glp1-prices" },
    { pharmacy: "PocketPills",        type: "Online",    price: 340,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "Shoppers Drug Mart", type: "Retail",    price: 350,  note: "Own Rx needed",        href: "/glp1-prices" },
    { pharmacy: "Felix Health",       type: "Telehealth", price: 380, note: "Rx included",          href: "/glp1-prices" },
  ],
  zepbound: [
    { pharmacy: "Costco Pharmacy",    type: "Retail",    price: 315,  note: "Membership required",  href: "/glp1-prices" },
    { pharmacy: "Shoppers Drug Mart", type: "Retail",    price: 390,  note: "Own Rx needed",        href: "/glp1-prices" },
  ],
};

const TYPE_STYLE: Record<string, string> = {
  Telehealth: "bg-blue-50 text-blue-700",
  Retail:     "bg-zinc-100 text-zinc-600",
  Online:     "bg-indigo-50 text-indigo-700",
};

export default function HomePricePreview() {
  const [active, setActive] = useState<TabKey>("generic");
  const rows = DATA[active];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Lowest prices right now</p>
            <h2 className="font-display text-2xl font-black text-zinc-900">Today&apos;s Best GLP-1 Prices</h2>
          </div>
          <Link href="/glp1-prices" className="text-sm font-semibold text-[var(--color-forest-600)] hover:text-[var(--color-forest-700)] transition-colors hidden sm:block">
            Full comparison →
          </Link>
        </div>

        {/* Drug tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                active === tab.key
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Pharmacy</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Price/mo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {rows.map((row, i) => (
                <tr key={row.pharmacy} className={`hover:bg-zinc-50 transition-colors ${i === 0 ? "bg-[var(--color-forest-50)]/50" : ""}`}>
                  <td className="px-4 py-4 text-zinc-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-zinc-900">{row.pharmacy}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${TYPE_STYLE[row.type]}`}>{row.type}</span>
                      <span className="text-xs text-zinc-400">{row.note}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {row.price !== null
                      ? <span className="text-xl font-black text-zinc-900">${row.price}</span>
                      : <span className="text-sm text-zinc-400 italic">See site</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-zinc-400">Prices verified May 2026 · CAD</p>
            <Link href="/glp1-prices" className="text-xs font-bold text-[var(--color-forest-600)] hover:text-[var(--color-forest-700)]">
              See all 15+ pharmacies →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
