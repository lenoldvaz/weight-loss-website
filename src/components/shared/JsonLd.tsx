interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Injects JSON-LD structured data into the page <head> */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
