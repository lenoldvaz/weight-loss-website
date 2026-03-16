import Link from "next/link";
import type { ContentRecord } from "@/lib/content";
import { getContentTitle, getContentUrl, getTemplateBreadcrumb } from "@/lib/content";

interface RelatedLinksProps {
  records: ContentRecord[];
  title?: string;
}

export default function RelatedLinks({
  records,
  title = "Related Articles",
}: RelatedLinksProps) {
  if (records.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="rounded-2xl border border-[var(--color-forest-100)] bg-[var(--color-parchment)] p-6"
    >
      <h2
        id="related-heading"
        className="font-display text-lg font-bold text-[var(--color-bark)] mb-4"
      >
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {records.map((record) => (
          <li key={record.slug}>
            <Link
              href={getContentUrl(record)}
              className="group flex items-start gap-3 rounded-xl p-3 hover:bg-[var(--color-forest-50)] transition-colors"
            >
              <span className="mt-1 shrink-0 text-[var(--color-forest-500)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--color-bark-soft)] group-hover:text-[var(--color-forest-700)] transition-colors leading-snug">
                  {getContentTitle(record)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-bark-muted)]">
                  {getTemplateBreadcrumb(record.template)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
