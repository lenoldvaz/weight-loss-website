import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://weight-loss.ca";
const SITE_NAME = "weight-loss.ca";
const DEFAULT_DESCRIPTION =
  "Evidence-based weight loss guidance for Canadians. Expert reviews of clinics, programs, diets, and products — with Canadian pricing, provincial programs, and Health Canada references.";

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og-image.png",
  noIndex = false,
  keywords = [],
  type = "website",
  publishedAt,
  updatedAt,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords: [
      "weight loss Canada",
      "Canadian health",
      "lose weight",
      ...keywords,
    ],
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      url: canonicalUrl,
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_CA",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
