import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-forest-100)] bg-[var(--color-parchment)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-display text-lg font-bold text-[var(--color-forest-700)]">
              weight-loss.ca
            </span>
            <p className="text-xs text-[var(--color-bark-muted)]">
              Canada&apos;s evidence-based weight loss resource
            </p>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            <Link
              href="/about"
              className="text-xs text-[var(--color-bark-muted)] hover:text-[var(--color-forest-700)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-xs text-[var(--color-bark-muted)] hover:text-[var(--color-forest-700)] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-[var(--color-bark-muted)] hover:text-[var(--color-forest-700)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/editorial-policy"
              className="text-xs text-[var(--color-bark-muted)] hover:text-[var(--color-forest-700)] transition-colors"
            >
              Editorial Policy
            </Link>
            <Link
              href="/contact"
              className="text-xs text-[var(--color-bark-muted)] hover:text-[var(--color-forest-700)] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Divider + legal */}
        <div className="mt-8 border-t border-[var(--color-forest-100)] pt-6">
          <p className="text-center text-xs text-[var(--color-bark-muted)]">
            &copy; {year} weight-loss.ca — All rights reserved. &nbsp;|&nbsp; Made in
            Canada &nbsp;🍁&nbsp; |&nbsp; Content is for informational purposes
            only. Not medical advice. Always consult a qualified healthcare
            provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
