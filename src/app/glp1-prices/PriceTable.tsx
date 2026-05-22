"use client";

import { useState, useMemo } from "react";

export type PriceRow = {
  id: string;
  pharmacy_name: string;
  pharmacy_type: "Telehealth" | "Retail" | "Online";
  province: string;
  drug_name: string;
  dosage: string | null;
  price_cad: number | null;
  dispensing_fee: number;
  requires_rx: boolean;
  url: string | null;
  notes: string | null;
  verified_at: string | null;
  is_estimate?: boolean;
};

const DRUGS = [
  "All drugs",
  "Generic Semaglutide",
  "Plosbrio",
  "Ozempic",
  "Wegovy",
  "Mounjaro",
  "Zepbound",
];


const PROVINCES = [
  "All provinces",
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Manitoba",
  "Saskatchewan",
  "Nova Scotia",
  "New Brunswick",
  "PEI",
  "Newfoundland",
];

const TYPE_STYLE: Record<string, string> = {
  Telehealth: "bg-blue-50 text-blue-700 border border-blue-200",
  Retail: "bg-zinc-100 text-zinc-600 border border-zinc-200",
  Online: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

function total(row: PriceRow) {
  if (row.price_cad === null) return Infinity;
  return row.price_cad + row.dispensing_fee;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

export default function PriceTable({ rows }: { rows: PriceRow[] }) {
  const [drug, setDrug] = useState("All drugs");
  const [province, setProvince] = useState("All provinces");
  const [sort, setSort] = useState<"price" | "name">("price");
  const [rxFilter, setRxFilter] = useState<"all" | "rx-included" | "rx-needed">("all");

  const filtered = useMemo(() => {
    let result = rows;

    if (drug !== "All drugs") {
      result = result.filter((r) => r.drug_name === drug);
    }

    if (province !== "All provinces") {
      result = result.filter((r) =>
        r.province === "All" ||
        r.province.includes(province) ||
        r.province.includes(province.slice(0, 2))
      );
    }

    if (rxFilter === "rx-included") {
      result = result.filter((r) => !r.requires_rx);
    } else if (rxFilter === "rx-needed") {
      result = result.filter((r) => r.requires_rx);
    }

    return [...result].sort((a, b) => {
      if (sort === "price") return total(a) - total(b);
      return a.pharmacy_name.localeCompare(b.pharmacy_name);
    });
  }, [rows, drug, province, sort, rxFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {DRUGS.map((tab) => (
            <button
              key={tab}
              onClick={() => setDrug(tab)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                drug === tab
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {tab === "All drugs" ? "All" : tab}
            </button>
          ))}
        </div>

        <div>
          <label className="sr-only">Province</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-400)] cursor-pointer"
          >
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="sr-only">Prescription</label>
          <select
            value={rxFilter}
            onChange={(e) => setRxFilter(e.target.value as typeof rxFilter)}
            className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-400)] cursor-pointer"
          >
            <option value="all">All (Rx & no-Rx)</option>
            <option value="rx-included">Rx included (telehealth)</option>
            <option value="rx-needed">I have my own Rx</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-zinc-400">Sort:</span>
          <button
            onClick={() => setSort("price")}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${sort === "price" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}
          >
            Price ↑
          </button>
          <button
            onClick={() => setSort("name")}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${sort === "name" ? "bg-zinc-900 text-white" : "bg-white border border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}
          >
            A–Z
          </button>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-zinc-400 mb-3">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        {drug !== "All drugs" ? ` for ${drug}` : ""}
        {province !== "All provinces" ? ` in ${province}` : ""}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-lg mb-1">No results</p>
          <p className="text-sm">Try changing the drug or province filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Pharmacy</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden md:table-cell">Drug / Dose</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden sm:table-cell">Province</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 text-right">Total / mo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden lg:table-cell">Verified</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {filtered.map((row, i) => (
                <tr key={row.id} className={`hover:bg-zinc-50 transition-colors ${i === 0 && sort === "price" ? "ring-1 ring-inset ring-[var(--color-forest-300)] bg-[var(--color-forest-50)]/40" : ""}`}>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-zinc-900">{row.pharmacy_name}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${TYPE_STYLE[row.pharmacy_type]}`}>
                        {row.pharmacy_type}
                      </span>
                      {!row.requires_rx && (
                        <span className="text-xs text-green-700 font-medium">✓ Rx included</span>
                      )}
                      {row.requires_rx && (
                        <span className="text-xs text-amber-600">⚠ Own Rx needed</span>
                      )}
                    </div>
                    {row.notes && (
                      <p className="text-xs text-zinc-400 italic mt-1 hidden sm:block">{row.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="font-medium text-zinc-800">{row.drug_name}</div>
                    {row.dosage && <div className="text-xs text-zinc-400 mt-0.5">{row.dosage}</div>}
                  </td>
                  <td className="px-4 py-4 text-zinc-500 text-xs hidden sm:table-cell">{row.province}</td>
                  <td className="px-4 py-4 text-right">
                    {row.price_cad !== null ? (
                      <>
                        <div className={`text-xl font-black ${row.is_estimate ? "text-zinc-400" : "text-zinc-900"}`}>
                          {row.is_estimate ? "~" : ""}${(row.price_cad + row.dispensing_fee).toFixed(0)}
                        </div>
                        {row.dispensing_fee > 0 && (
                          <div className="text-xs text-zinc-400">incl. ${row.dispensing_fee} fee</div>
                        )}
                        {row.is_estimate && (
                          <div className="text-xs text-zinc-400">estimated</div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400 italic">See site</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-zinc-400 hidden lg:table-cell">{fmtDate(row.verified_at)}</td>
                  <td className="px-4 py-4">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-colors whitespace-nowrap"
                      >
                        Visit →
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
