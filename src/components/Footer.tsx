import Link from "next/link";

const footerSections = [
  {
    heading: "Compare",
    links: [
      { label: "GLP-1 Prices", href: "/glp1-prices" },
      { label: "Telehealth Providers", href: "/telehealth" },
      { label: "Savings Cards", href: "/savings-cards" },
      { label: "Coverage Checker", href: "/coverage-checker" },
    ],
  },
  {
    heading: "Tracking",
    links: [
      { label: "Generic Semaglutide Tracker", href: "/generic-semaglutide-canada-tracker" },
      { label: "Semaglutide News", href: "/semaglutide-news" },
      { label: "Generic Ozempic Explainer", href: "/generic-semaglutide-canada" },
      { label: "How to Get Generic Semaglutide", href: "/how-to-get-generic-semaglutide-in-canada" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-zinc-900 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-forest-500)] text-white text-xs">🍁</span>
              weight-loss.ca
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Canada&apos;s independent GLP-1 price comparison. Not affiliated with any pharmacy, manufacturer, or insurer.
            </p>
            <p className="mt-4 text-xs text-zinc-400">
              Prices in CAD. For informational use only. Not medical advice.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                {section.heading}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            &copy; {year} weight-loss.ca — Made in Canada 🍁
          </p>
          <p className="text-xs text-zinc-400 text-center sm:text-right max-w-md">
            Content is for informational purposes only. Always consult a qualified healthcare provider before starting any medication.
          </p>
        </div>
      </div>
    </footer>
  );
}
