import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/content";
import fs from "fs";
import path from "path";

function getFileMtime(template: string, slug: string): Date {
  try {
    const filePath = path.join(
      process.cwd(),
      "src/data/content",
      template,
      `${slug}.json`
    );
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://weight-loss.ca";

  // Static pages with accurate dates
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2026-03-28"), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/clinics`, lastModified: new Date("2026-03-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/how-to`, lastModified: new Date("2026-03-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: new Date("2026-03-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-03-28"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date("2026-03-28"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-03-28"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date("2026-03-28"), changeFrequency: "monthly", priority: 0.3 },
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

  // Content pages with real file modification times
  const contentPages: MetadataRoute.Sitemap = getAllSlugs().map(({ slug, template }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: getFileMtime(template, slug),
    changeFrequency: "weekly",
    priority: priorityMap[template] ?? 0.7,
  }));

  return [...staticPages, ...contentPages];
}
