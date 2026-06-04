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
    { url: `${baseUrl}/glp1-prices`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/coverage-checker`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/savings-cards`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/telehealth`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/generic-semaglutide-canada-tracker`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/semaglutide-news`, lastModified: new Date("2026-05-21"), changeFrequency: "daily", priority: 0.8 },
    // Generic semaglutide content cluster — explicitly prioritised above template defaults
    { url: `${baseUrl}/generic-semaglutide-canada`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/how-to-get-generic-semaglutide-in-canada`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/generic-semaglutide-vs-ozempic`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/generic-semaglutide-weight-loss-canada`, lastModified: new Date("2026-05-21"), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/generic-semaglutide-coverage-by-province`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/generic-semaglutide-ontario`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/generic-semaglutide-bc`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/generic-semaglutide-alberta`, lastModified: new Date("2026-05-21"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/generic-semaglutide-quebec`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/generic-semaglutide-manitoba`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/generic-ozempic-canada`, lastModified: new Date("2026-06-04"), changeFrequency: "weekly", priority: 1.0 },
  ];

  // Slugs already hardcoded above — exclude from auto-generated list to avoid duplicates
  const HARDCODED_SLUGS = new Set([
    "generic-semaglutide-canada",
    "how-to-get-generic-semaglutide-in-canada",
    "generic-semaglutide-vs-ozempic",
    "generic-semaglutide-weight-loss-canada",
    "generic-semaglutide-coverage-by-province",
    "generic-semaglutide-ontario",
    "generic-semaglutide-bc",
    "generic-semaglutide-alberta",
    "generic-semaglutide-quebec",
    "generic-semaglutide-manitoba",
    "generic-ozempic-canada",
  ]);

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
    "trending-article": 0.9,
  };

  // Content pages with real file modification times (skip slugs hardcoded above)
  const contentPages: MetadataRoute.Sitemap = getAllSlugs()
    .filter(({ slug }) => !HARDCODED_SLUGS.has(slug))
    .map(({ slug, template }) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: getFileMtime(template, slug),
      changeFrequency: "weekly",
      priority: priorityMap[template] ?? 0.7,
    }));

  return [...staticPages, ...contentPages];
}
