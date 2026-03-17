import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "About weight-loss.ca — Canada's Evidence-Based Weight Loss Resource",
  description:
    "Meet the editorial team behind weight-loss.ca. We're Canadian health writers and dietitians committed to evidence-based, Health Canada–aligned weight loss guidance.",
  alternates: { canonical: "https://weight-loss.ca/about" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "weight-loss.ca",
  url: "https://weight-loss.ca",
  logo: "https://weight-loss.ca/logo.png",
  description:
    "Canada's evidence-based weight loss resource — clinic directories, medication reviews, and how-to guides for Canadians.",
  foundingDate: "2025",
  areaServed: "CA",
  knowsAbout: [
    "Weight loss",
    "Obesity medicine",
    "Registered dietitian services",
    "GLP-1 medications",
    "Bariatric programs",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Editorial",
    email: "hello@weight-loss.ca",
    availableLanguage: "English",
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[var(--color-bark-muted)]"
        >
          <Link
            href="/"
            className="hover:text-[var(--color-forest-700)] transition-colors"
          >
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--color-bark-soft)]">About</span>
        </nav>

        {/* Hero */}
        <header className="mb-12">
          <h1 className="font-display text-3xl font-bold text-[var(--color-bark)] mb-4 sm:text-4xl">
            About weight-loss.ca
          </h1>
          <p className="text-lg text-[var(--color-bark-soft)] leading-relaxed max-w-2xl">
            We're a Canadian editorial team on a mission to make evidence-based
            weight loss guidance accessible to every Canadian — from BC to
            Newfoundland.
          </p>
        </header>

        <div className="space-y-12">

          {/* Mission */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)] mb-4">
              Our mission
            </h2>
            <div className="prose-custom space-y-4 text-[var(--color-bark-soft)] leading-relaxed">
              <p>
                Weight loss is one of the most searched and most misunderstood health
                topics in Canada. Millions of Canadians are navigating a landscape
                crowded with conflicting information, expensive programs, and products
                that don't deliver on their promises.
              </p>
              <p>
                weight-loss.ca exists to cut through the noise. We publish in-depth,
                clinically grounded guides to weight loss clinics, medications,
                programs, and strategies available specifically in Canada — with honest
                assessments of what works, what doesn't, and what it actually costs.
              </p>
              <p>
                Everything we publish is aligned with{" "}
                <a
                  href="https://www.canada.ca/en/health-canada.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-forest-700)] underline underline-offset-2 hover:text-[var(--color-forest-900)]"
                >
                  Health Canada
                </a>{" "}
                guidelines, informed by the{" "}
                <a
                  href="https://obesitycanada.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-forest-700)] underline underline-offset-2 hover:text-[var(--color-forest-900)]"
                >
                  Canadian Obesity Network
                </a>
                , and reviewed by registered dietitians and physicians before
                publication.
              </p>
            </div>
          </section>

          {/* Editorial team */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)] mb-6">
              Our editorial team
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">

              <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-700)] text-lg font-bold font-display">
                    SM
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-bark)]">Sarah Mitchell, RD</p>
                    <p className="text-xs text-[var(--color-bark-muted)]">Editor in Chief</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">
                  Registered Dietitian based in Toronto, Ontario. Sarah has over a decade
                  of experience in clinical nutrition and weight management, including work
                  with the Bariatric Surgery Program at Toronto General Hospital. She
                  oversees all editorial content and ensures every article meets
                  evidence-based standards.
                </p>
                <p className="mt-3 text-xs text-[var(--color-bark-muted)]">
                  MHSc Nutrition, University of Toronto · College of Dietitians of Ontario
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-700)] text-lg font-bold font-display">
                    JO
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-bark)]">Dr. James Okafor, MD</p>
                    <p className="text-xs text-[var(--color-bark-muted)]">Medical Reviewer</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">
                  Family physician with a focused practice in obesity medicine in Ottawa,
                  Ontario. Dr. Okafor is a member of the Canadian Obesity Network and
                  completed advanced training in bariatric medicine. He reviews all
                  medication, clinical, and condition-specific content before publication.
                </p>
                <p className="mt-3 text-xs text-[var(--color-bark-muted)]">
                  MD, University of Ottawa · CCFP · Diploma in Bariatric Medicine
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-700)] text-lg font-bold font-display">
                    RC
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-bark)]">Rachel Chen</p>
                    <p className="text-xs text-[var(--color-bark-muted)]">Senior Health Writer</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">
                  Vancouver-based health journalist with a background in kinesiology.
                  Rachel covers GLP-1 medications, program reviews, and fitness strategies,
                  bringing first-hand research and clinic visits to each piece she writes.
                </p>
                <p className="mt-3 text-xs text-[var(--color-bark-muted)]">
                  BSc Kinesiology, UBC · 8 years health writing
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-forest-100)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-700)] text-lg font-bold font-display">
                    LV
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-bark)]">Lenold Vaz</p>
                    <p className="text-xs text-[var(--color-bark-muted)]">Founder &amp; Publisher</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">
                  Canadian health media entrepreneur. Lenold founded weight-loss.ca with
                  the goal of building the most trusted, comprehensive weight loss
                  resource for Canadians. He oversees the product and publishing strategy.
                </p>
                <p className="mt-3 text-xs text-[var(--color-bark-muted)]">
                  Canada
                </p>
              </div>

            </div>
          </section>

          {/* How we create content */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)] mb-4">
              How we create our content
            </h2>
            <div className="space-y-4 text-[var(--color-bark-soft)] leading-relaxed">
              <p>
                Every piece of content on weight-loss.ca follows a structured editorial
                process:
              </p>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-sm">
                <li>
                  <strong className="text-[var(--color-bark)]">Research:</strong> We
                  gather data from peer-reviewed literature, Health Canada guidance, the
                  Canadian Obesity Network clinical practice guidelines, and direct
                  outreach to clinics and providers.
                </li>
                <li>
                  <strong className="text-[var(--color-bark)]">Drafting:</strong>{" "}
                  Content is written by qualified health writers or registered dietitians
                  with subject-matter expertise.
                </li>
                <li>
                  <strong className="text-[var(--color-bark)]">Medical review:</strong>{" "}
                  All clinical claims, medication information, and condition-specific
                  guidance is reviewed by Dr. James Okafor or a qualified designate
                  before publication.
                </li>
                <li>
                  <strong className="text-[var(--color-bark)]">Fact-checking:</strong>{" "}
                  Pricing, availability, and regulatory status is verified against
                  Health Canada's Drug Product Database and direct clinic contact.
                </li>
                <li>
                  <strong className="text-[var(--color-bark)]">Updates:</strong> Pages
                  are reviewed and updated at least annually, or when significant
                  clinical or regulatory changes occur.
                </li>
              </ol>
              <p>
                For full details, see our{" "}
                <Link
                  href="/editorial-policy"
                  className="text-[var(--color-forest-700)] underline underline-offset-2 hover:text-[var(--color-forest-900)]"
                >
                  Editorial Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Transparency / Affiliates */}
          <section className="rounded-2xl bg-[var(--color-forest-50)] border border-[var(--color-forest-100)] p-6">
            <h2 className="font-display text-xl font-semibold text-[var(--color-bark)] mb-3">
              How we make money
            </h2>
            <p className="text-sm text-[var(--color-bark-soft)] leading-relaxed">
              weight-loss.ca is free to readers. We earn revenue through affiliate
              partnerships — when you click certain links and make a purchase, we may
              earn a small commission at no extra cost to you. We also display
              contextual advertising. Affiliate relationships never influence our
              editorial recommendations or scores. We disclose all affiliate links
              in every article where they appear. Our editorial team operates
              independently of our commercial team.
            </p>
          </section>

          {/* What we cover */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-bark)] mb-4">
              What we cover
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/clinics"
                className="group rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
              >
                <p className="text-2xl mb-2">🏥</p>
                <p className="font-semibold text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors">
                  Clinics &amp; Services
                </p>
                <p className="mt-1 text-xs text-[var(--color-bark-muted)]">
                  Weight loss clinics, dietitians, and bariatric programs across Canada
                </p>
              </Link>
              <Link
                href="/reviews"
                className="group rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
              >
                <p className="text-2xl mb-2">💊</p>
                <p className="font-semibold text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors">
                  Program Reviews
                </p>
                <p className="mt-1 text-xs text-[var(--color-bark-muted)]">
                  Honest scores for medications, supplements, apps, and programs
                </p>
              </Link>
              <Link
                href="/how-to"
                className="group rounded-xl border border-[var(--color-forest-100)] bg-white p-5 shadow-sm hover:border-[var(--color-forest-300)] hover:shadow-md transition-all"
              >
                <p className="text-2xl mb-2">📋</p>
                <p className="font-semibold text-[var(--color-bark)] group-hover:text-[var(--color-forest-700)] transition-colors">
                  How-To Guides
                </p>
                <p className="mt-1 text-xs text-[var(--color-bark-muted)]">
                  Step-by-step guides to diet, exercise, medications, and lifestyle
                </p>
              </Link>
            </div>
          </section>

          {/* Medical disclaimer */}
          <section className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="font-semibold text-amber-900 mb-2 text-sm uppercase tracking-wider">
              Medical disclaimer
            </h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              Content on weight-loss.ca is for informational purposes only and is not a
              substitute for professional medical advice, diagnosis, or treatment. Always
              consult a qualified healthcare provider — such as your family physician or a
              registered dietitian — before making changes to your diet, starting a new
              medication, or beginning a weight loss program.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
