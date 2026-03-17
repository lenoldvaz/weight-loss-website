import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Editorial Policy — weight-loss.ca",
  description:
    "How weight-loss.ca creates, reviews, and updates content. Our standards for evidence, medical review, affiliate disclosure, and corrections.",
  alternates: { canonical: "https://weight-loss.ca/editorial-policy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-[var(--color-bark)]">{title}</h2>
      <div className="space-y-3 text-sm text-[var(--color-bark-soft)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function EditorialPolicyPage() {
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
          <span className="text-[var(--color-bark-soft)]">Editorial Policy</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-3 sm:text-4xl">
            Editorial Policy
          </h1>
          <p className="text-[var(--color-bark-soft)] leading-relaxed">
            Last updated: March 2026
          </p>
        </header>

        <div className="space-y-10 divide-y divide-[var(--color-forest-100)]">

          <Section title="Our editorial standards">
            <p>
              weight-loss.ca publishes content about weight loss, obesity medicine, nutrition,
              and wellness for a Canadian audience. Because health information can directly
              affect reader wellbeing, we hold ourselves to the highest editorial standards
              for accuracy, transparency, and clinical grounding.
            </p>
            <p>
              All content must meet three core criteria before publication:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li>
                <strong>Evidence-based:</strong> Claims are supported by peer-reviewed
                research, Health Canada guidance, or Canadian Obesity Network clinical
                practice guidelines. We cite all primary sources.
              </li>
              <li>
                <strong>Canada-specific:</strong> Pricing is in CAD, regulatory references
                are to Health Canada (not the FDA), and program availability reflects
                Canadian provincial access.
              </li>
              <li>
                <strong>Medically reviewed:</strong> All clinical content — including
                medication guides, condition-specific pages, and program reviews involving
                medical claims — is reviewed by our medical reviewer before publication.
              </li>
            </ol>
          </Section>

          <Section title="Who creates our content">
            <p>
              Content is written by qualified health writers, registered dietitians, or
              subject-matter experts. Writer credentials appear in the byline of each article.
              We do not accept content from brands, clinics, or commercial partners for
              editorial publication. Sponsored content, where it exists, is clearly labelled.
            </p>
            <p>
              Our editorial team includes:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                <strong>Sarah Mitchell, RD</strong> — Editor in Chief. Registered
                Dietitian, MHSc Nutrition (University of Toronto). Member of the College
                of Dietitians of Ontario.
              </li>
              <li>
                <strong>Dr. James Okafor, MD</strong> — Medical Reviewer. Family physician
                with a focused practice in obesity medicine. CCFP. Diploma in Bariatric
                Medicine. Member of the Canadian Obesity Network.
              </li>
              <li>
                <strong>Rachel Chen</strong> — Senior Health Writer. BSc Kinesiology,
                UBC. Eight years of health journalism experience.
              </li>
            </ul>
          </Section>

          <Section title="Medical review process">
            <p>
              Content that includes clinical claims — such as medication efficacy, dosing
              information, contraindications, surgical procedures, or treatment for specific
              health conditions — is reviewed by Dr. James Okafor, MD, before publication.
            </p>
            <p>
              The medical review process includes:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Verification of all clinical claims against current Canadian clinical guidelines</li>
              <li>Flagging of outdated statistics or superseded guidance</li>
              <li>Assessment of whether content could cause harm if misapplied by a reader</li>
              <li>Sign-off before the page goes live</li>
            </ul>
            <p>
              Pages that have been medically reviewed display a "Medically Reviewed" badge
              with the reviewer's name and review date.
            </p>
          </Section>

          <Section title="Sources we use">
            <p>We prioritize the following source hierarchy:</p>
            <ol className="list-decimal list-outside ml-5 space-y-1">
              <li>Health Canada publications and the Drug Product Database</li>
              <li>Canadian Obesity Network clinical practice guidelines</li>
              <li>Peer-reviewed studies (PubMed, Cochrane Reviews)</li>
              <li>Provincial health authority guidance (e.g., Ontario Health, BC Centre for Disease Control)</li>
              <li>Statistics Canada health data</li>
              <li>Expert interviews with Canadian healthcare providers</li>
            </ol>
            <p>
              We do not use press releases, brand-provided studies, or non-peer-reviewed
              publications as primary evidence for clinical claims.
            </p>
          </Section>

          <Section title="Affiliate links and advertising">
            <p>
              weight-loss.ca participates in affiliate programs. When you click a link to a
              product or service and make a purchase, we may earn a commission. This does not
              affect the price you pay.
            </p>
            <p>
              Our rules:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                All affiliate links are disclosed in the article where they appear, typically
                with a note such as "This link is an affiliate link."
              </li>
              <li>
                Affiliate relationships do not influence our editorial scores, recommendations,
                or rankings. Products we don't recommend do not get recommended because we have
                an affiliate deal.
              </li>
              <li>
                Our editorial team operates independently. Commercial staff have no editorial
                decision-making authority.
              </li>
            </ul>
            <p>
              We also display contextual advertising. Advertising is clearly separated from
              editorial content and labelled as "Advertisement" or "Sponsored."
            </p>
          </Section>

          <Section title="How we handle corrections">
            <p>
              If we publish an error, we correct it promptly and transparently. Corrections
              are noted at the top of the article with a date and description of what was
              changed. We do not silently edit errors after publication.
            </p>
            <p>
              To report an inaccuracy, contact us at{" "}
              <a
                href="mailto:corrections@weight-loss.ca"
                className="text-[var(--color-forest-700)] underline underline-offset-2"
              >
                corrections@weight-loss.ca
              </a>
              . We aim to respond within 5 business days.
            </p>
          </Section>

          <Section title="Content updates">
            <p>
              Health guidance changes. We review all pages at least annually and update them
              when:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Health Canada changes the approval status of a medication</li>
              <li>Significant new clinical research is published</li>
              <li>Clinic listings, pricing, or availability changes materially</li>
              <li>A reader or medical professional flags outdated information</li>
            </ul>
            <p>
              Each page displays a "Last reviewed" date so readers know when the content was
              most recently verified.
            </p>
          </Section>

          <Section title="Independence statement">
            <p>
              weight-loss.ca editorial content is produced independently of all commercial
              relationships. Clinics, brands, and programs do not pay for editorial coverage,
              positive reviews, or inclusion in our guides. We cover what is most useful to
              our readers, not what is most profitable for our business.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              Questions about our editorial standards, a specific article, or a correction
              request? Contact our editorial team at{" "}
              <a
                href="mailto:editorial@weight-loss.ca"
                className="text-[var(--color-forest-700)] underline underline-offset-2"
              >
                editorial@weight-loss.ca
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
