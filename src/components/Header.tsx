"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "GLP-1 Prices", href: "/glp1-prices" },
  { label: "Coverage", href: "/coverage-checker" },
  { label: "Savings Cards", href: "/savings-cards" },
  { label: "Telehealth", href: "/telehealth" },
  { label: "Tracker", href: "/generic-semaglutide-canada-tracker" },
  { label: "News", href: "/semaglutide-news" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-zinc-900 hover:text-[var(--color-forest-700)] transition-colors"
          aria-label="weight-loss.ca home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-forest-500)] text-white text-xs font-black">
            🍁
          </span>
          <span>weight-loss.ca</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/glp1-prices"
            className="rounded-lg bg-[var(--color-forest-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-600)] transition-colors duration-150"
          >
            Compare Prices
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            ) : (
              <path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/glp1-prices"
              className="mt-2 rounded-lg bg-[var(--color-forest-500)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-forest-600)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Compare Prices
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
