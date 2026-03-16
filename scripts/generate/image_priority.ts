/**
 * Priority image list — generate images for top ~10% of pages.
 * These are the pages most likely to rank and drive traffic.
 * Only these slugs get hero images; all others use a text-only layout.
 *
 * Update this list as new high-priority pages are added.
 */

export const PRIORITY_IMAGE_SLUGS = new Set<string>([
  // ─── Location × Service — top 8 cities × 3 services (24 pages) ───
  "weight-loss-clinics-toronto",
  "weight-loss-clinics-vancouver",
  "weight-loss-clinics-montreal",
  "weight-loss-clinics-calgary",
  "weight-loss-clinics-ottawa",
  "weight-loss-clinics-edmonton",
  "weight-loss-clinics-mississauga",
  "weight-loss-clinics-hamilton",

  "dietitians-toronto",
  "dietitians-vancouver",
  "dietitians-montreal",
  "dietitians-calgary",
  "dietitians-ottawa",
  "dietitians-edmonton",
  "dietitians-mississauga",
  "dietitians-hamilton",

  "bariatric-surgery-toronto",
  "bariatric-surgery-vancouver",
  "bariatric-surgery-montreal",
  "bariatric-surgery-calgary",
  "bariatric-surgery-ottawa",
  "bariatric-surgery-edmonton",
  "bariatric-surgery-mississauga",
  "bariatric-surgery-hamilton",

  // ─── Product Reviews — all of them (high purchase intent) ───
  "ozempic-review",
  "wegovy-review",
  "mounjaro-review",
  "saxenda-review",
  "victoza-review",
  "contrave-review",
  "qsymia-review",
  "plenity-review",
  "noom-review",
  "ww-weightwatchers-review",
  "hello-fresh-weight-loss-review",
  "goodfood-weight-loss-review",
  "myfitnesspal-review",
  "lose-it-app-review",
  "ideal-protein-review",
  "optifast-review",
  "jenny-craig-canada-review",
  "isagenix-review",

  // ─── How-To — top search-volume guides ───
  "how-to-lose-belly-fat",
  "how-to-lose-weight-fast",
  "how-to-start-keto-canada",
  "how-to-get-ozempic-canada",
  "how-to-lose-weight-after-50",
]);

/** Returns true if this slug should have a hero image generated */
export function shouldGenerateImage(slug: string): boolean {
  return PRIORITY_IMAGE_SLUGS.has(slug);
}
