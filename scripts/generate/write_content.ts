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
