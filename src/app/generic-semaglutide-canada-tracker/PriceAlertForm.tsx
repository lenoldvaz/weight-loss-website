"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function PriceAlertForm({ variant = "banner" }: { variant?: "banner" | "card" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "price-alert-tracker" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (variant === "banner") {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold mb-0.5">Prices are falling — get notified when they drop</p>
          <p className="text-slate-400 text-sm">We email you when prices change or new generics are approved. No spam.</p>
        </div>

        {status === "success" ? (
          <div className="shrink-0 bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            ✓ You&apos;re on the list
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 shrink-0 w-full sm:w-auto">
            <input
              ref={inputRef}
              type="email"
              placeholder="your@email.ca"
              required
              autoComplete="email"
              disabled={status === "loading"}
              className="flex-1 sm:w-48 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 bg-white text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === "loading" ? "…" : "Alert me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-xs mt-1 sm:absolute sm:bottom-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  // card variant (for Coming Soon provider cards)
  return (
    <div>
      {status === "success" ? (
        <p className="text-xs text-green-600 font-medium">✓ We&apos;ll notify you</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-1.5">
          <input
            ref={inputRef}
            type="email"
            placeholder="your@email.ca"
            required
            autoComplete="email"
            disabled={status === "loading"}
            className="flex-1 min-w-0 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "…" : "Notify me"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
    </div>
  );
}
