import EmailCaptureForm from "@/components/EmailCaptureForm";

interface CTASectionProps {
  heading: string;
  body: string;
}

export default function CTASection({ heading, body }: CTASectionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="rounded-2xl bg-[var(--color-forest-700)] px-6 py-8 text-center sm:px-10"
    >
      <h2
        id="cta-heading"
        className="font-display text-xl font-bold text-white mb-2 sm:text-2xl"
      >
        {heading}
      </h2>
      <p className="text-sm text-[var(--color-forest-100)] mb-6 max-w-md mx-auto">
        {body}
      </p>
      <EmailCaptureForm buttonLabel="Get Free Updates" id="cta-email" />
    </section>
  );
}
