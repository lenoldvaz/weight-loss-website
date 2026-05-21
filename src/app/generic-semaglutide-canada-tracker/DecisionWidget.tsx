"use client";

import { useState } from "react";

type Step = "q1" | "q2" | "result";

type Rec = {
  provider: string;
  price: string;
  reason: string;
  url: string;
  badge: string;
};

const RECS: Record<string, Rec> = {
  "yes-price": {
    provider: "Shoppers Drug Mart",
    price: "~$114/mo",
    reason: "Cheapest option when you already have a prescription. Generic semaglutide is arriving at locations now.",
    url: "https://www.shoppersdrugmart.ca",
    badge: "Cheapest with prescription",
  },
  "yes-fast": {
    provider: "Shoppers Drug Mart",
    price: "~$114/mo",
    reason: "Widest national network means the best chance of same-day stock. Call ahead to confirm.",
    url: "https://www.shoppersdrugmart.ca",
    badge: "Fastest with prescription",
  },
  "yes-support": {
    provider: "PocketPills",
    price: "~$114/mo",
    reason: "Online pharmacy with pharmacist support and home delivery — no need to visit a store.",
    url: "https://www.pocketpills.com",
    badge: "Best delivery option",
  },
  "no-price": {
    provider: "Hims & Hers",
    price: "$149/mo",
    reason: "Cheapest all-in option — includes consultation, prescription, and medication. No doctor visit needed.",
    url: "https://www.hims.com/ca",
    badge: "Best value all-in",
  },
  "no-fast": {
    provider: "Felix Health",
    price: "$150/mo",
    reason: "Fast online consultation with same-day prescription in most cases. Medication ships quickly.",
    url: "https://www.felixforyou.ca",
    badge: "Fastest all-in",
  },
  "no-support": {
    provider: "Raven",
    price: "Custom pricing",
    reason: "Weight-loss focused care team with ongoing clinical support — best for patients who want hands-on guidance.",
    url: "https://www.getraven.com",
    badge: "Most clinical support",
  },
};

export default function DecisionWidget() {
  const [step, setStep] = useState<Step>("q1");
  const [hasPrescription, setHasPrescription] = useState<"yes" | "no" | null>(null);
  const [priority, setPriority] = useState<"price" | "fast" | "support" | null>(null);

  const rec = hasPrescription && priority ? RECS[`${hasPrescription}-${priority}`] : null;

  function reset() {
    setStep("q1");
    setHasPrescription(null);
    setPriority(null);
  }

  return (
    <div className="bg-white border-2 border-[var(--color-forest-200)] rounded-2xl overflow-hidden">
      <div className="bg-[var(--color-forest-800)] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-forest-300)] text-sm font-semibold">Find your best option</span>
          <span className="text-[var(--color-forest-500)] text-xs">· 2 quick questions</span>
        </div>
        {step !== "q1" && (
          <button onClick={reset} className="text-[var(--color-forest-400)] hover:text-white text-xs transition-colors">
            Start over
          </button>
        )}
      </div>

      <div className="p-5">
        {step === "q1" && (
          <div>
            <p className="font-semibold text-slate-900 mb-4">Do you already have a semaglutide prescription?</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setHasPrescription("yes"); setStep("q2"); }}
                className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-[var(--color-forest-600)] hover:bg-[var(--color-forest-50)] transition-all text-left"
              >
                <div className="text-base mb-0.5">✓</div>
                Yes — I have a prescription
              </button>
              <button
                onClick={() => { setHasPrescription("no"); setStep("q2"); }}
                className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-[var(--color-forest-600)] hover:bg-[var(--color-forest-50)] transition-all text-left"
              >
                <div className="text-base mb-0.5">✗</div>
                No — I need one
              </button>
            </div>
          </div>
        )}

        {step === "q2" && (
          <div>
            <p className="font-semibold text-slate-900 mb-4">What matters most to you?</p>
            <div className="flex flex-col gap-2">
              {[
                { key: "price" as const, label: "Lowest price", sub: "I want the cheapest option available" },
                { key: "fast"  as const, label: "Fastest access", sub: "I want it as quickly as possible" },
                { key: "support" as const, label: "Most support", sub: "I want clinical guidance and care" },
              ].map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => { setPriority(key); setStep("result"); }}
                  className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-left hover:border-[var(--color-forest-600)] hover:bg-[var(--color-forest-50)] transition-all"
                >
                  <span className="font-medium text-slate-900">{label}</span>
                  <span className="text-slate-500 ml-2 text-xs">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && rec && (
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-forest-600)] mb-1">
                  Our recommendation
                </div>
                <div className="font-display text-xl font-bold text-slate-900">{rec.provider}</div>
                <div className="text-2xl font-bold text-[var(--color-forest-700)] mt-0.5">{rec.price}</div>
              </div>
              <span className="shrink-0 bg-[var(--color-forest-100)] text-[var(--color-forest-800)] text-xs font-semibold px-3 py-1 rounded-full">
                {rec.badge}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{rec.reason}</p>
            <div className="flex gap-3">
              <a
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[var(--color-forest-800)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center hover:bg-[var(--color-forest-900)] transition-colors"
              >
                Visit {rec.provider} →
              </a>
              <button
                onClick={reset}
                className="border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
