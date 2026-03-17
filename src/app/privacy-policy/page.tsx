import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — weight-loss.ca",
  description:
    "Privacy Policy for weight-loss.ca. How we collect, use, and protect your personal information under PIPEDA and Canadian privacy law.",
  alternates: { canonical: "https://weight-loss.ca/privacy-policy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 pt-8 first:pt-0">
      <h2 className="font-display text-xl font-semibold text-[var(--color-bark)]">{title}</h2>
      <div className="space-y-3 text-sm text-[var(--color-bark-soft)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
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
          <span className="text-[var(--color-bark-soft)]">Privacy Policy</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-[var(--color-bark-muted)] text-sm">
            Last updated: March 2026 · Effective: March 2026
          </p>
        </header>

        <div className="divide-y divide-[var(--color-forest-100)] space-y-0">

          <Section title="Who we are">
            <p>
              weight-loss.ca ("we", "our", "the site") is a Canadian digital publication
              operated from Canada. This Privacy Policy explains how we collect, use,
              disclose, and protect personal information in compliance with the{" "}
              <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA)
              and applicable Canadian provincial privacy laws.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>We may collect the following categories of information:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Usage data:</strong> Pages visited, referrer URL, browser type, device
                type, and approximate geographic location (country/province level). Collected
                automatically via analytics tools.
              </li>
              <li>
                <strong>Email address:</strong> If you subscribe to our newsletter or early
                access list, we collect your email address.
              </li>
              <li>
                <strong>Contact form submissions:</strong> Name and email address if you
                contact us voluntarily.
              </li>
              <li>
                <strong>Cookies and local storage:</strong> Session identifiers and
                preference data. See the Cookies section below.
              </li>
            </ul>
            <p>
              We do not collect sensitive personal information such as health records, medical
              history, or financial information through this website.
            </p>
          </Section>

          <Section title="How we use your information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Operate and improve the website</li>
              <li>Understand how readers find and use our content</li>
              <li>Send you newsletters or updates you have subscribed to</li>
              <li>Respond to your messages and enquiries</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for
              marketing purposes.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use cookies and similar technologies. You can manage cookie preferences
              through your browser settings.
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                <strong>Analytics cookies:</strong> We use Google Analytics 4 and Microsoft
                Clarity to understand usage patterns. These tools may set cookies on your
                device. Both offer opt-out mechanisms.
              </li>
              <li>
                <strong>Advertising cookies:</strong> If advertising is enabled, third-party
                ad networks (such as Google AdSense) may set cookies to serve contextual ads.
              </li>
              <li>
                <strong>Session cookies:</strong> Used to maintain your session while
                browsing the site. These expire when you close your browser.
              </li>
            </ul>
          </Section>

          <Section title="Third-party services">
            <p>
              We use the following third-party services that may process personal data on our
              behalf:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                <strong>Google Analytics 4</strong> — Usage analytics (Google LLC,
                privacy-protected under Data Processing Terms)
              </li>
              <li>
                <strong>Google Tag Manager</strong> — Tag management
              </li>
              <li>
                <strong>Microsoft Clarity</strong> — Session recording and heatmaps
              </li>
              <li>
                <strong>Vercel</strong> — Hosting and edge delivery (Vercel Inc., servers
                located in North America)
              </li>
            </ul>
            <p>
              Each provider has its own privacy policy. We encourage you to review them.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              Analytics data is retained according to the settings of each analytics
              provider (typically 14 months for Google Analytics). Email subscriber data is
              retained until you unsubscribe. Contact form submissions are retained for
              up to 2 years.
            </p>
          </Section>

          <Section title="Your rights under PIPEDA">
            <p>
              Under PIPEDA, you have the right to:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Know what personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Withdraw consent to our use of your personal information</li>
              <li>Request deletion of your personal information</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:privacy@weight-loss.ca"
                className="text-[var(--color-forest-700)] underline underline-offset-2"
              >
                privacy@weight-loss.ca
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p>
              weight-loss.ca is not directed to children under the age of 13. We do not
              knowingly collect personal information from children. If you believe a child
              has provided us with personal information, contact us and we will delete it.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated by updating the "Last updated" date at the top of this page. Your
              continued use of the site after changes constitutes acceptance of the revised
              policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this Privacy Policy or our data practices? Contact our Privacy
              Officer at{" "}
              <a
                href="mailto:privacy@weight-loss.ca"
                className="text-[var(--color-forest-700)] underline underline-offset-2"
              >
                privacy@weight-loss.ca
              </a>
              {" "}or visit our{" "}
              <Link
                href="/contact"
                className="text-[var(--color-forest-700)] underline underline-offset-2"
              >
                Contact page
              </Link>
              .
            </p>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}
