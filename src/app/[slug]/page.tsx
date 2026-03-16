import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  findContent,
  getAllSlugs,
  getRelatedContent,
} from "@/lib/content";
import LocationServiceTemplate from "@/components/templates/LocationServiceTemplate";
import HowToTemplate from "@/components/templates/HowToTemplate";
import ProductReviewTemplate from "@/components/templates/ProductReviewTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = findContent(slug);
  if (!record) return {};

  const c = record.content as {
    page_title?: string;
    meta_description?: string;
    h1?: string;
  };

  const title = c.page_title ?? c.h1 ?? slug;
  const description = c.meta_description ?? "";
  const url = `https://weight-loss.ca/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "en_CA",
      siteName: "weight-loss.ca",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const record = findContent(slug);

  if (!record) {
    notFound();
  }

  const related = getRelatedContent(record.template, slug, 4);

  switch (record.template) {
    case "location-service":
      return <LocationServiceTemplate record={record} related={related} />;
    case "how-to":
      return <HowToTemplate record={record} related={related} />;
    case "product-review":
      return <ProductReviewTemplate record={record} related={related} />;
    default:
      // Remaining templates (comparison, best-list, etc.) will be added in Phase 4
      // For now, show a placeholder that still renders valid content
      notFound();
  }
}
