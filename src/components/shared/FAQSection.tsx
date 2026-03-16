"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-display text-2xl font-bold text-[var(--color-bark)] mb-6"
      >
        {title}
      </h2>
      <div className="divide-y divide-[var(--color-forest-100)]">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-start justify-between gap-4 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-[var(--color-bark-soft)] leading-snug">
                {faq.question}
              </span>
              <span
                className="mt-0.5 shrink-0 text-[var(--color-forest-600)] transition-transform duration-200"
                style={{
                  transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                }}
                aria-hidden="true"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 3v12M3 9h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            {openIndex === i && (
              <div className="pb-4 text-sm leading-relaxed text-[var(--color-bark-soft)]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
