"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Prices & Tools",
    children: [
      { label: "GLP-1 Price Comparison", href: "/glp1-prices", desc: "Ozempic, Wegovy, generics across 15+ pharmacies" },
      { label: "Coverage Checker", href: "/coverage-checker", desc: "Does your province cover your medication?" },
      { label: "Savings Cards", href: "/savings-cards", desc: "Cut costs by up to $171/mo" },
      { label: "Telehealth Providers", href: "/telehealth", desc: "Get a prescription online" },
    ],
  },
  {
    label: "Tracking",
    children: [
      { label: "Generic Semaglutide Tracker", href: "/generic-semaglutide-canada-tracker", desc: "Prices, availability, approvals" },
      { label: "Semaglutide News", href: "/semaglutide-news", desc: "Daily news feed — 144 articles" },
    ],
  },
  {
    label: "Reviews",
    href: "/reviews",
    children: [
      { label: "Ozempic Review", href: "/ozempic-review" },
      { label: "Wegovy Review", href: "/wegovy-review" },
      { label: "Mounjaro Review", href: "/mounjaro-review" },
      { label: "Saxenda Review", href: "/saxenda-review" },
      { label: "Contrave Review", href: "/contrave-review" },
      { label: "Noom Review", href: "/noom-review" },
      { label: "WW (Weight Watchers) Review", href: "/ww-weight-watchers-canada-review" },
      { label: "All Reviews →", href: "/reviews" },
    ],
  },
  {
    label: "How-To",
    href: "/how-to",
    children: [
      { label: "Get Generic Semaglutide", href: "/how-to-get-generic-semaglutide-in-canada" },
      { label: "Lose Belly Fat", href: "/how-to-lose-belly-fat" },
      { label: "Lose Weight After 40", href: "/how-to-lose-weight-after-40" },
      { label: "Start Intermittent Fasting", href: "/how-to-start-intermittent-fasting" },
      { label: "Lose Weight on a Budget", href: "/how-to-lose-weight-on-a-budget-in-canada" },
      { label: "All Guides →", href: "/how-to" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-zinc-900 hover:text-[var(--color-forest-700)] transition-colors shrink-0"
          aria-label="weight-loss.ca home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-forest-500)] text-white text-xs font-black">
            🍁
          </span>
          <span>weight-loss.ca</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.href && !item.children ? (
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                  aria-expanded={openDropdown === item.label}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 opacity-50">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {/* Dropdown */}
              {item.children && openDropdown === item.label && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <div className="w-64 rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-900/10 overflow-hidden">
                    {item.href && (
                      <Link
                        href={item.href}
                        className="block border-b border-zinc-100 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-colors"
                      >
                        All {item.label} →
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 hover:bg-zinc-50 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="text-sm font-medium text-zinc-900">{child.label}</div>
                        {child.desc && <div className="text-xs text-zinc-400 mt-0.5">{child.desc}</div>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        <div className="border-t border-zinc-100 bg-white px-4 pb-5 lg:hidden overflow-y-auto max-h-[80vh]">
          <nav className="flex flex-col pt-3" aria-label="Mobile navigation">

            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">Prices &amp; Tools</p>
              {[
                { label: "GLP-1 Price Comparison", href: "/glp1-prices" },
                { label: "Coverage Checker", href: "/coverage-checker" },
                { label: "Savings Cards", href: "/savings-cards" },
                { label: "Telehealth Providers", href: "/telehealth" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">Tracking</p>
              {[
                { label: "Generic Semaglutide Tracker", href: "/generic-semaglutide-canada-tracker" },
                { label: "Semaglutide News", href: "/semaglutide-news" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">Reviews</p>
              {[
                { label: "Ozempic Review", href: "/ozempic-review" },
                { label: "Wegovy Review", href: "/wegovy-review" },
                { label: "Mounjaro Review", href: "/mounjaro-review" },
                { label: "Contrave Review", href: "/contrave-review" },
                { label: "All Reviews", href: "/reviews" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">How-To Guides</p>
              {[
                { label: "Get Generic Semaglutide", href: "/how-to-get-generic-semaglutide-in-canada" },
                { label: "Lose Belly Fat", href: "/how-to-lose-belly-fat" },
                { label: "Lose Weight After 40", href: "/how-to-lose-weight-after-40" },
                { label: "All Guides", href: "/how-to" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href="/glp1-prices"
              className="rounded-lg bg-[var(--color-forest-500)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-forest-600)] transition-colors"
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
