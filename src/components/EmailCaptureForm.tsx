"use client";

import { useState, useRef } from "react";

interface EmailCaptureFormProps {
  id?: string;
  buttonLabel?: string;
}

export default function EmailCaptureForm({
  id,
  buttonLabel = "Get Early Access",
}: EmailCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
        body: JSON.stringify({ email, source: "homepage" }),
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

  if (status === "success") {
    return (
      <div className="flex h-12 items-center justify-center rounded-full bg-[var(--color-forest-100)] border border-[var(--color-forest-200)] px-7 text-sm font-semibold text-[var(--color-forest-700)]">
        ✓ You&apos;re on the list — we&apos;ll be in touch
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
      aria-label="Early access sign-up"
    >
      <label htmlFor={id ?? "email-input"} className="sr-only">
        Email address
      </label>
      <input
        ref={inputRef}
        id={id ?? "email-input"}
        type="email"
        placeholder="your@email.ca"
        required
        disabled={status === "loading"}
        className="h-12 flex-1 rounded-full border border-[var(--color-forest-200)] bg-white px-5 text-sm text-[var(--color-bark)] placeholder-[var(--color-bark-muted)] shadow-sm outline-none ring-[var(--color-forest-300)] focus:border-[var(--color-forest-500)] focus:ring-2 transition disabled:opacity-60"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-full bg-[var(--color-forest-600)] px-7 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-forest-700)] hover:shadow-lg active:scale-95 transition-all duration-150 disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : buttonLabel}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  );
}
