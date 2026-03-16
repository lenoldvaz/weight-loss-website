import fs from "fs";
import path from "path";
import type { AnySeed } from "./types.js";
import type { TemplateName } from "../../src/data/schemas/index.js";

const CONTENT_BASE = path.resolve(
  process.cwd(),
  "src/data/content"
);

export interface ContentRecord {
  template: TemplateName;
  slug: string;
  generated_at: string;
  seed: AnySeed;
  content: unknown;
}

/** Write a validated content record to disk as JSON */
export function writeContent(
  template: TemplateName,
  slug: string,
  seed: AnySeed,
  content: unknown
): string {
  const dir = path.join(CONTENT_BASE, template);
  fs.mkdirSync(dir, { recursive: true });

  const record: ContentRecord = {
    template,
    slug,
    generated_at: new Date().toISOString(),
    seed,
    content,
  };

  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
  return filePath;
}

/** Check if a content file already exists (for idempotent runs) */
export function contentExists(template: TemplateName, slug: string): boolean {
  const filePath = path.join(CONTENT_BASE, template, `${slug}.json`);
  return fs.existsSync(filePath);
}

/** Count how many content files exist for a template */
export function countContent(template: TemplateName): number {
  const dir = path.join(CONTENT_BASE, template);
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).length;
}

/** After image generation, patch the content JSON with the hero_image field */
export async function updateContentWithImage(
  template: string,
  slug: string,
  imagePath: string,
  imagePrompt: string
): Promise<void> {
  const filePath = path.join(CONTENT_BASE, template, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`    [image] Content file not found for ${template}/${slug} — skipping patch`);
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const record = JSON.parse(raw) as ContentRecord;

  const content = record.content as Record<string, unknown>;

  // Build a human-readable alt text from the image path and template
  const altText = buildAltText(template, slug);

  content.hero_image = {
    path: imagePath,
    alt: altText,
    prompt: imagePrompt,
  };

  record.content = content;
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
}

function buildAltText(template: string, slug: string): string {
  // Convert slug to readable text: "weight-loss-clinics-toronto" → "weight loss clinics toronto"
  const readable = slug.replace(/-/g, " ");
  switch (template) {
    case "location-service":
      return `Hero image for ${readable} — weight loss clinic`;
    case "location-product":
      return `Hero image for ${readable} — weight loss products`;
    case "product-review":
      return `Product photo for ${readable}`;
    case "comparison":
      return `Comparison hero image for ${readable}`;
    case "how-to":
      return `Lifestyle photo for ${readable}`;
    case "demographic-topic":
      return `Wellness lifestyle photo for ${readable}`;
    case "condition-topic":
      return `Health imagery for ${readable}`;
    case "best-list":
      return `Product collection for ${readable}`;
    case "trending-article":
      return `Editorial image for ${readable}`;
    default:
      return `Hero image for ${readable}`;
  }
}
