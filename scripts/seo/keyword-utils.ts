/**
 * keyword-utils.ts
 *
 * Utility to convert a URL slug into a search keyword.
 * Replaces hyphens with spaces and trims whitespace.
 *
 * Examples:
 *   "weight-loss-clinics-toronto"  → "weight loss clinics toronto"
 *   "how-to-lose-belly-fat"        → "how to lose belly fat"
 *   "ozempic-review"               → "ozempic review"
 */

export function slugToKeyword(slug: string): string {
  return slug.replace(/-/g, " ").trim();
}
