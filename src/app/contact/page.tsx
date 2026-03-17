import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — weight-loss.ca",
  description:
    "Get in touch with the weight-loss.ca editorial team. Report an error, ask a question, or inquire about partnerships.",
  alternates: { canonical: "https://weight-loss.ca/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]"
        >
          <Link href="/" className="hover:text-[var(--color-forest-700)] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">Contact</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Contact us
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            We read every message. Reach out using the appropriate email below and
            we'll get back to you within 3–5 business days.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 mb-10">
          <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
            <p className="text-2xl mb-3">✏️</p>
            <h2 className="font-semibold text-[var(--color-bark)] mb-1">Editorial enquiries</h2>
            <p className="text-sm text-[var(--color-bark-muted)] mb-3">
              Questions about an article, corrections, or editorial feedback.
            </p>
            <a
              href="mailto:editorial@weight-loss.ca"
              className="text-sm font-medium text-[var(--color-forest-700)] hover:underline"
            >
              editorial@weight-loss.ca
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
            <p className="text-2xl mb-3">🔧</p>
            <h2 className="font-semibold text-[var(--color-bark)] mb-1">Corrections</h2>
            <p className="text-sm text-[var(--color-bark-muted)] mb-3">
              Found an error, outdated information, or a broken link?
            </p>
            <a
              href="mailto:corrections@weight-loss.ca"
              className="text-sm font-medium text-[var(--color-forest-700)] hover:underline"
            >
              corrections@weight-loss.ca
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
            <p className="text-2xl mb-3">🤝</p>
            <h2 className="font-semibold text-[var(--color-bark)] mb-1">Partnerships &amp; advertising</h2>
            <p className="text-sm text-[var(--color-bark-muted)] mb-3">
              Clinic listings, affiliate programs, or advertising enquiries.
            </p>
            <a
              href="mailto:partnerships@weight-loss.ca"
              className="text-sm font-medium text-[var(--color-forest-700)] hover:underline"
            >
              partnerships@weight-loss.ca
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
            <p className="text-2xl mb-3">💬</p>
            <h2 className="font-semibold text-[var(--color-bark)] mb-1">General</h2>
            <p className="text-sm text-[var(--color-bark-muted)] mb-3">
              Anything else — reader questions, suggestions, or feedback.
            </p>
            <a
              href="mailto:hello@weight-loss.ca"
              className="text-sm font-medium text-[var(--color-forest-700)] hover:underline"
            >
              hello@weight-loss.ca
            </a>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
          <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
            Not medical advice
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            We cannot answer personal medical questions or provide individual health advice.
            If you have questions about your health, weight, or a specific medication, please
            consult your physician, registered dietitian, or pharmacist.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
