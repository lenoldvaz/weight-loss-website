import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmailCaptureForm from "@/components/EmailCaptureForm";

export const metadata: Metadata = {
  title: "weight-loss.ca — Canada's #1 Weight Loss Resource (Coming Soon)",
  description:
    "The most comprehensive, evidence-based weight loss resource for Canadians. Expert reviews, clinic directories, Canadian pricing, and Health Canada-aligned guidance. Launching soon.",
  alternates: { canonical: "https://weight-loss.ca" },
};

const trustBadges = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 1.5L11.25 6.75H16.5L12.375 9.75L13.875 15L9 12L4.125 15L5.625 9.75L1.5 6.75H6.75L9 1.5Z"
          stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    label: "Expert-Reviewed",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
          stroke="currentColor" strokeWidth="1.25" fill="none" />
        <path d="M6 9l2.25 2.25L12 6.75" stroke="currentColor" strokeWidth="1.25"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Health Canada Aligned",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 1.5l.75 5.25h5.25L11.25 10.5l1.5 5.25L9 13.125 5.25 15.75l1.5-5.25L3 6.75h5.25z"
          stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinejoin="round" />
        <text x="9" y="11" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="serif">🍁</text>
      </svg>
    ),
    label: "Made in Canada",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.25" fill="none" />
        <path d="M5 8h8M5 11h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    label: "Evidence-Based",
  },
];

const upcomingFeatures = [
  {
    emoji: "🏥",
    title: "Clinic Directory",
    description: "Find weight loss clinics near you across every province",
  },
  {
    emoji: "💊",
    title: "Program Reviews",
    description: "Honest, in-depth reviews of GLP-1, Ozempic, Jenny Craig & more",
  },
  {
    emoji: "📊",
    title: "Compare Plans",
    description: "Side-by-side comparisons with Canadian pricing (CAD)",
  },
  {
    emoji: "🌿",
    title: "Nutrition Guides",
    description: "Seasonal, Canadian-sourced eating strategies that actually work",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, var(--color-forest-100) 0%, transparent 65%), var(--color-cream)",
          }}
        >
          {/* Background organic shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* Leaf decoration — top right */}
            <svg
              className="animate-float absolute -top-8 -right-16 opacity-[0.07] sm:opacity-[0.09]"
              width="520"
              height="520"
              viewBox="0 0 520 520"
              fill="none"
            >
              <path
                d="M260 20 C340 20 460 100 460 260 C460 380 380 480 260 490 C180 490 60 420 40 300 C20 180 80 80 180 40 C210 28 235 20 260 20Z"
                fill="var(--color-forest-600)"
              />
              <path
                d="M260 490 C260 490 240 350 200 260 C160 170 80 100 80 100"
                stroke="var(--color-forest-800)"
                strokeWidth="3"
                fill="none"
                opacity="0.4"
              />
            </svg>
            {/* Leaf decoration — bottom left */}
            <svg
              className="animate-float absolute -bottom-24 -left-20 opacity-[0.05]"
              style={{ animationDelay: "3s" }}
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
            >
              <path
                d="M200 20 C280 20 360 80 370 200 C380 310 310 380 200 380 C100 380 30 300 20 200 C10 100 80 20 200 20Z"
                fill="var(--color-forest-700)"
              />
            </svg>
            {/* Subtle dot grid */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "radial-gradient(var(--color-forest-800) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Coming soon pill */}
            <div
              className="animate-fade-up opacity-0 animation-delay-100 mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-forest-200)] bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-widest text-[var(--color-forest-700)] uppercase shadow-sm backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-forest-500)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-forest-600)]" />
              </span>
              Coming Soon
            </div>

            {/* Main headline */}
            <h1
              className="animate-fade-up opacity-0 animation-delay-200 mx-auto mb-6 max-w-3xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-[var(--color-bark)] sm:text-6xl lg:text-7xl"
            >
              Canada&apos;s{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-800) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                #1 Weight Loss
              </span>{" "}
              Resource
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-up opacity-0 animation-delay-300 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-bark-soft)] sm:text-xl"
            >
              Evidence-based guidance built for Canadians. Expert reviews of
              weight loss clinics from Vancouver to Halifax, real program
              comparisons with Canadian pricing, and advice aligned with Health
              Canada guidelines.
            </p>

            {/* Email capture */}
            <div
              id="early-access"
              className="animate-fade-up opacity-0 animation-delay-400 mx-auto mb-4 max-w-md"
            >
              <EmailCaptureForm id="email-input" />
              <p className="mt-3 text-xs text-[var(--color-bark-muted)]">
                Be the first to know when we launch. No spam, ever.
              </p>
            </div>

            {/* Trust badges */}
            <div
              className="animate-fade-up opacity-0 animation-delay-500 mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[var(--color-forest-800)] shadow-sm backdrop-blur-sm border border-[var(--color-forest-100)]"
                >
                  <span className="text-[var(--color-forest-600)]">
                    {badge.icon}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming features */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="animate-fade-up opacity-0 animation-delay-200 mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-forest-600)]">
                What&apos;s Coming
              </p>
              <h2 className="font-display text-3xl font-bold text-[var(--color-bark)] sm:text-4xl">
                Everything a Canadian needs to succeed
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingFeatures.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`animate-fade-up opacity-0 animation-delay-${(i + 2) * 100} group rounded-2xl border border-[var(--color-forest-100)] bg-[var(--color-cream)] p-6 transition-all duration-200 hover:border-[var(--color-forest-300)] hover:shadow-md`}
                >
                  <div className="mb-4 text-3xl">{feature.emoji}</div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-[var(--color-bark)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-bark-soft)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Province strip */}
        <section
          className="px-4 py-14 sm:px-6 lg:px-8"
          style={{
            background:
              "linear-gradient(135deg, var(--color-forest-800) 0%, var(--color-forest-900) 100%)",
          }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-forest-300)]">
              Coverage Across Every Province
            </p>
            <p className="font-display text-2xl font-bold text-white sm:text-3xl">
              From{" "}
              <span className="text-[var(--color-forest-300)]">
                British Columbia
              </span>{" "}
              to{" "}
              <span className="text-[var(--color-forest-300)]">
                Newfoundland
              </span>
            </p>
            <p className="mt-4 text-sm text-[var(--color-forest-200)] opacity-80">
              Ontario &bull; Quebec &bull; Alberta &bull; Manitoba &bull;
              Saskatchewan &bull; Nova Scotia &bull; New Brunswick &bull; PEI
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-[var(--color-bark)] sm:text-4xl">
              Be first in line
            </h2>
            <p className="mb-8 text-[var(--color-bark-soft)]">
              Join thousands of Canadians waiting for a weight loss resource
              that actually speaks to them.
            </p>
            <EmailCaptureForm id="email-input-bottom" buttonLabel="Notify Me" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
