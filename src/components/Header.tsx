"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Clinics", href: "/clinics" },
  { label: "How-To", href: "/how-to" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-forest-100)] bg-[var(--color-cream)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-[var(--color-forest-700)] hover:text-[var(--color-forest-600)] transition-colors"
          aria-label="weight-loss.ca home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm0 4c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm6 12H8v-1.5c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M14 3.5C8.201 3.5 3.5 8.201 3.5 14S8.201 24.5 14 24.5 24.5 19.799 24.5 14 19.799 3.5 14 3.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Maple leaf simplified */}
            <path
              d="M14 7l1.2 2.8 2.8-.4-1.8 2.2 1 2.8-3.2-1-3.2 1 1-2.8-1.8-2.2 2.8.4z"
              fill="currentColor"
            />
            <rect x="13.25" y="15" width="1.5" height="3.5" rx="0.75" fill="currentColor" />
          </svg>
          <span>weight-loss.ca</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-bark-soft)] hover:text-[var(--color-forest-700)] transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#early-access"
            className="rounded-full bg-[var(--color-forest-600)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-700)] transition-colors duration-150"
          >
            Get Early Access
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-bark-soft)] hover:bg-[var(--color-forest-50)] transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <>
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-forest-100)] bg-[var(--color-cream)] px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-bark-soft)] hover:bg-[var(--color-forest-50)] hover:text-[var(--color-forest-700)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#early-access"
              className="mt-2 rounded-full bg-[var(--color-forest-600)] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-forest-700)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Get Early Access
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
