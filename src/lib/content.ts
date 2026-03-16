import fs from "fs";
import path from "path";
import type {
  TemplateName,
  LocationService,
  LocationProduct,
  ProductReview,
  Comparison,
  HowTo,
  DemographicTopic,
  ConditionTopic,
  BestList,
  TrendingArticle,
} from "../data/schemas/index.js";

const CONTENT_BASE = path.resolve(process.cwd(), "src/data/content");

const ALL_TEMPLATES: TemplateName[] = [
  "location-service",
  "location-product",
  "product-review",
  "comparison",
  "how-to",
  "demographic-topic",
  "condition-topic",
  "best-list",
  "trending-article",
];

export type ContentData =
  | LocationService
  | LocationProduct
  | ProductReview
  | Comparison
  | HowTo
  | DemographicTopic
  | ConditionTopic
  | BestList
  | TrendingArticle;

export interface ContentRecord {
  template: TemplateName;
  slug: string;
  generated_at: string;
  seed: unknown;
  content: ContentData;
}

export function getContent(
  template: TemplateName,
  slug: string
): ContentRecord | null {
  const filePath = path.join(CONTENT_BASE, template, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ContentRecord;
}

/** Find content by slug alone, searching across all templates */
export function findContent(slug: string): ContentRecord | null {
  for (const template of ALL_TEMPLATES) {
    const record = getContent(template, slug);
    if (record) return record;
  }
  return null;
}

/** All slugs across all templates — used for generateStaticParams */
export function getAllSlugs(): Array<{ slug: string; template: TemplateName }> {
  const results: Array<{ slug: string; template: TemplateName }> = [];
  for (const template of ALL_TEMPLATES) {
    const dir = path.join(CONTENT_BASE, template);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      results.push({ slug: file.replace(".json", ""), template });
    }
  }
  return results;
}

/** Get related content records for internal linking — same template first, then others */
export function getRelatedContent(
  template: TemplateName,
  currentSlug: string,
  limit = 4
): ContentRecord[] {
  const all = getAllSlugs().filter((s) => s.slug !== currentSlug);
  const sameTemplate = all.filter((s) => s.template === template);
  const others = all.filter((s) => s.template !== template);
  const picks = [
    ...sameTemplate.slice(0, limit - 1),
    ...others.slice(0, 2),
  ].slice(0, limit);
  return picks
    .map(({ template: t, slug }) => getContent(t, slug))
    .filter((r): r is ContentRecord => r !== null);
}

/** Human-readable label for a content record, used in related links */
export function getContentTitle(record: ContentRecord): string {
  const c = record.content as { h1?: string; page_title?: string };
  return c.h1 ?? c.page_title ?? record.slug;
}

/** URL for a content record */
export function getContentUrl(record: ContentRecord): string {
  return `/${record.slug}`;
}

/** Breadcrumb label by template type */
export function getTemplateBreadcrumb(template: TemplateName): string {
  const map: Record<TemplateName, string> = {
    "location-service": "Clinics & Services",
    "location-product": "Products",
    "product-review": "Reviews",
    "comparison": "Comparisons",
    "how-to": "How-To Guides",
    "demographic-topic": "By Audience",
    "condition-topic": "Health Conditions",
    "best-list": "Best Lists",
    "trending-article": "News & Trends",
  };
  return map[template];
}
