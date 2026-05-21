"use client";

import { useState } from "react";

const PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland", "Nova Scotia", "Ontario", "PEI",
  "Quebec", "Saskatchewan", "Yukon", "NWT", "Nunavut",
];

const DRUGS = [
  "Generic Semaglutide (Apo-Semaglutide / Dr. Reddy's)",
  "Ozempic (semaglutide)",
  "Wegovy (semaglutide 2.4mg)",
  "Mounjaro (tirzepatide)",
  "Zepbound (tirzepatide)",
];

type Coverage = {
  covered: "yes" | "partial" | "no" | "unknown";
  plan: string;
  conditions: string;
  notes: string;
  savings_tip: string;
};

function getCoverage(province: string, drug: string, hasInsurance: boolean, hasT2D: boolean): Coverage {
  const isGeneric = drug.includes("Generic");
  const isOzempic = drug.includes("Ozempic");
  const isWegovy = drug.includes("Wegovy");
  const isMounjaro = drug.includes("Mounjaro") || drug.includes("Zepbound");

  // Ontario
  if (province === "Ontario") {
    if ((isGeneric || isOzempic) && hasT2D) {
      return {
        covered: "partial",
        plan: "Ontario Drug Benefit (ODB)",
        conditions: "Type 2 diabetes diagnosis required. Semaglutide is listed on the ODB formulary for T2D patients.",
        notes: "If you have T2D and are on ODB (seniors 65+, social assistance, or Trillium), semaglutide may be covered at the generic price. The generic price should reduce your copay.",
        savings_tip: "If you're not on ODB, apply for Trillium Drug Program if your drug costs are high relative to income.",
      };
    }
    if (isWegovy) {
      return {
        covered: "no",
        plan: "Ontario Drug Benefit (ODB)",
        conditions: "Wegovy (semaglutide for weight loss) is not listed on the ODB formulary.",
        notes: "Ontario does not currently cover Wegovy through the provincial plan. Private insurance may cover it — check your plan documents.",
        savings_tip: "Apply for the Novo Nordisk Care financial assistance program if you have no drug insurance.",
      };
    }
    if (isMounjaro) {
      return {
        covered: "no",
        plan: "Ontario Drug Benefit (ODB)",
        conditions: "Mounjaro / Zepbound is not currently listed on the ODB formulary for weight loss.",
        notes: "Mounjaro may be covered for Type 2 diabetes on some private plans. Zepbound for weight loss is generally not covered provincially.",
        savings_tip: "Check with your private insurer. Use the mymounjaro savings card to reduce cost.",
      };
    }
  }

  // British Columbia
  if (province === "British Columbia") {
    if ((isGeneric || isOzempic) && hasT2D) {
      return {
        covered: "partial",
        plan: "BC PharmaCare (Plan B/C/F)",
        conditions: "Semaglutide is on the BC Drug Formulary for Type 2 diabetes. Provincial coverage depends on your plan (income-tested).",
        notes: "BC Fair PharmaCare subsidizes drug costs based on family income. Deductibles apply. With generic pricing, your costs should drop significantly.",
        savings_tip: "Register for Fair PharmaCare if you haven't — it's income-based and many families qualify.",
      };
    }
    if (isWegovy) {
      return {
        covered: "no",
        plan: "BC PharmaCare",
        conditions: "Wegovy is not currently on the BC drug formulary for weight management.",
        notes: "Not covered provincially. Private insurance may cover it with documentation.",
        savings_tip: "Novo Nordisk Care financial assistance is available for uninsured BC residents.",
      };
    }
  }

  // Alberta
  if (province === "Alberta") {
    if ((isGeneric || isOzempic) && hasT2D) {
      return {
        covered: "partial",
        plan: "Alberta Blue Cross (Government Plans)",
        conditions: "Semaglutide is listed for Type 2 diabetes. Coverage requires special authorization.",
        notes: "Available to seniors, low-income Albertans, and those on social assistance through the Non-Group Benefits plan. Special authorization required.",
        savings_tip: "Your doctor needs to submit a Special Authorization request for coverage.",
      };
    }
  }

  // Quebec
  if (province === "Quebec") {
    if (isGeneric || isOzempic) {
      return {
        covered: "partial",
        plan: "Régime général d'assurance médicaments (RAMQ)",
        conditions: "Generic semaglutide will be added to the RAMQ formulary — timing TBD. Brand Ozempic is listed for T2D.",
        notes: "All Quebecers must have drug insurance — either through RAMQ or private insurer. RAMQ covers Ozempic for T2D. Check with your pharmacist on generic formulary status.",
        savings_tip: "Once listed on RAMQ, generic semaglutide should have much lower copay than brand. Ask your pharmacist.",
      };
    }
  }

  // Generic fallback by condition
  if (isGeneric && hasT2D) {
    return {
      covered: "partial",
      plan: `${province} provincial drug plan`,
      conditions: "Generic semaglutide for Type 2 diabetes may be covered under your provincial drug plan — coverage depends on your specific plan and income.",
      notes: "Provincial coverage of generic semaglutide is evolving. Contact your provincial drug plan or pharmacist to confirm current status.",
      savings_tip: "Ask your pharmacist to check formulary status. The generic price is already 60–75% cheaper than brand.",
    };
  }

  if (isWegovy || (!hasT2D && (isGeneric || isOzempic))) {
    return {
      covered: "no",
      plan: `${province} provincial drug plan`,
      conditions: "Weight loss medications are generally not covered provincially without a qualifying diagnosis.",
      notes: "Most provincial plans require a Type 2 diabetes diagnosis for semaglutide coverage. Off-label weight loss prescriptions are typically not covered.",
      savings_tip: hasInsurance
        ? "Check your private insurance benefits booklet — some plans cover weight management drugs with BMI documentation."
        : "Apply for the relevant manufacturer savings card to reduce your out-of-pocket cost.",
    };
  }

  return {
    covered: "unknown",
    plan: `${province} provincial drug plan`,
    conditions: "Coverage varies by income, plan type, and diagnosis. Confirm with your provincial drug plan or pharmacist.",
    notes: "We don't have specific data for this combination. Your pharmacist is the best resource for accurate coverage information.",
    savings_tip: "Compare prices across pharmacies — even without coverage, generics start at $114/mo.",
  };
}

const STATUS_CONFIG = {
  yes: { label: "Likely covered", color: "text-green-700 bg-green-50 border-green-200" },
  partial: { label: "Partially covered", color: "text-amber-700 bg-amber-50 border-amber-200" },
  no: { label: "Not covered", color: "text-red-700 bg-red-50 border-red-200" },
  unknown: { label: "Unclear — verify with pharmacist", color: "text-zinc-600 bg-zinc-50 border-zinc-200" },
};

export default function CoverageChecker() {
  const [province, setProvince] = useState("");
  const [drug, setDrug] = useState("");
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [hasT2D, setHasT2D] = useState<boolean | null>(null);
  const [result, setResult] = useState<Coverage | null>(null);

  const step = !province ? 1 : !drug ? 2 : hasInsurance === null ? 3 : hasT2D === null ? 4 : 5;

  function checkCoverage() {
    if (!province || !drug || hasInsurance === null || hasT2D === null) return;
    setResult(getCoverage(province, drug, hasInsurance, hasT2D));
  }

  function reset() {
    setProvince("");
    setDrug("");
    setHasInsurance(null);
    setHasT2D(null);
    setResult(null);
  }

  if (result) {
    const status = STATUS_CONFIG[result.covered];
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`border rounded-2xl p-6 mb-5 ${status.color}`}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Coverage result</div>
          <div className="text-xl font-black mb-1">{status.label}</div>
          <div className="text-sm font-semibold opacity-80">{result.plan}</div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Conditions</h3>
            <p className="text-sm text-zinc-700 leading-relaxed">{result.conditions}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">What this means for you</h3>
            <p className="text-sm text-zinc-700 leading-relaxed">{result.notes}</p>
          </div>
          <div className="bg-[var(--color-forest-50)] border border-[var(--color-forest-200)] rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-forest-700)] mb-2">💡 Savings tip</h3>
            <p className="text-sm text-[var(--color-forest-800)] leading-relaxed">{result.savings_tip}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            ← Start over
          </button>
          <a
            href="/glp1-prices"
            className="rounded-xl bg-[var(--color-forest-500)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-forest-600)] transition-colors"
          >
            Compare prices →
          </a>
          <a
            href="/savings-cards"
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Savings cards →
          </a>
        </div>

        <p className="mt-6 text-xs text-zinc-400 leading-relaxed">
          This is a general guide only. Coverage rules change frequently. Always confirm with your provincial drug plan or pharmacist for accurate, up-to-date information.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step > s ? "bg-[var(--color-forest-500)]" : step === s ? "bg-[var(--color-forest-300)]" : "bg-zinc-200"}`} />
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1: Province */}
        <div className={step < 1 ? "opacity-40 pointer-events-none" : ""}>
          <label className="block text-sm font-bold text-zinc-900 mb-2">
            1. Which province are you in?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROVINCES.map((p) => (
              <button
                key={p}
                onClick={() => { setProvince(p); setDrug(""); setHasInsurance(null); setHasT2D(null); setResult(null); }}
                className={`rounded-xl border px-3 py-2 text-sm font-medium text-left transition-colors ${province === p ? "border-[var(--color-forest-500)] bg-[var(--color-forest-50)] text-[var(--color-forest-800)]" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Drug */}
        {province && (
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              2. Which medication?
            </label>
            <div className="space-y-2">
              {DRUGS.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDrug(d); setHasInsurance(null); setHasT2D(null); setResult(null); }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-left transition-colors ${drug === d ? "border-[var(--color-forest-500)] bg-[var(--color-forest-50)] text-[var(--color-forest-800)]" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Private insurance */}
        {province && drug && (
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              3. Do you have private drug insurance?
            </label>
            <div className="flex gap-3">
              {[{ v: true, l: "Yes, through employer or personal plan" }, { v: false, l: "No, I pay out of pocket" }].map(({ v, l }) => (
                <button
                  key={String(v)}
                  onClick={() => { setHasInsurance(v); setHasT2D(null); setResult(null); }}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium text-left transition-colors ${hasInsurance === v ? "border-[var(--color-forest-500)] bg-[var(--color-forest-50)] text-[var(--color-forest-800)]" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Diagnosis */}
        {province && drug && hasInsurance !== null && (
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              4. Do you have a Type 2 diabetes diagnosis?
            </label>
            <div className="flex gap-3">
              {[{ v: true, l: "Yes" }, { v: false, l: "No — prescribing for weight loss" }].map(({ v, l }) => (
                <button
                  key={String(v)}
                  onClick={() => setHasT2D(v)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium text-left transition-colors ${hasT2D === v ? "border-[var(--color-forest-500)] bg-[var(--color-forest-50)] text-[var(--color-forest-800)]" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        {province && drug && hasInsurance !== null && hasT2D !== null && (
          <button
            onClick={checkCoverage}
            className="w-full rounded-xl bg-[var(--color-forest-500)] py-3.5 text-sm font-bold text-white hover:bg-[var(--color-forest-600)] transition-colors"
          >
            Check my coverage →
          </button>
        )}
      </div>
    </div>
  );
}
