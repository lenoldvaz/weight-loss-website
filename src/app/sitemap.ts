import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://weight-loss.ca";

  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/clinics`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/how-to`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // Priority by template
  const priorityMap: Record<string, number> = {
    "location-service": 0.9,
    "location-product": 0.8,
    "product-review": 0.9,
    "comparison": 0.8,
    "how-to": 0.8,
    "demographic-topic": 0.7,
    "condition-topic": 0.8,
    "best-list": 0.8,
    "trending-article": 0.7,
  };

  // All generated content pages
  const contentPages: MetadataRoute.Sitemap = getAllSlugs().map(({ slug, template }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: priorityMap[template] ?? 0.7,
  }));

  return [...staticPages, ...contentPages];
}
