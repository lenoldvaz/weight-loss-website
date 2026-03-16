/**
 * seeds-manifest.ts
 *
 * Static list of all seed slugs per template. These are derived from the
 * actual seed files in scripts/generate/seeds/ using the same buildSlug
 * logic from scripts/generate/prompt_builder.ts.
 *
 * This module is NOT a route — it's a plain TypeScript module imported by
 * server components and API routes to know the full list of seeds without
 * executing the seed files at runtime.
 *
 * To update: re-run the derivation below any time seed files change.
 */

// ─── location-service ────────────────────────────────────────────────────────
// Formula: `${service_slug}-${city.toLowerCase().replace(/\s+/g, "-")}`
// 20 cities × 3 services = 60 slugs

// Cities lowercased with spaces replaced by hyphens (exactly as buildSlug does)
const LOCATION_SERVICE_CITIES = [
  "toronto", "ottawa", "mississauga", "hamilton", "london",
  "vancouver", "surrey", "burnaby", "victoria",
  "calgary", "edmonton", "red-deer",
  "montreal", "quebec-city", "laval",
  "winnipeg", "halifax", "saskatoon", "regina", "st.-john's",
] as const;

const LOCATION_SERVICE_SERVICE_SLUGS = [
  "weight-loss-clinics",
  "dietitians",
  "bariatric-surgery",
] as const;

const locationServiceSlugs: string[] = LOCATION_SERVICE_CITIES.flatMap((city) =>
  LOCATION_SERVICE_SERVICE_SLUGS.map((service) => `${service}-${city}`)
);

// ─── how-to ──────────────────────────────────────────────────────────────────
// Formula: `how-to-${topic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`

const HOW_TO_TOPICS = [
  "lose belly fat",
  "lose belly fat fast",
  "lose love handles",
  "lose face fat",
  "lose thigh fat",
  "lose arm fat",
  "lose weight after 40",
  "lose weight after 50",
  "lose weight after pregnancy",
  "lose weight with PCOS",
  "lose weight with hypothyroidism",
  "lose weight with a desk job",
  "start intermittent fasting",
  "count macros for weight loss",
  "start a keto diet in Canada",
  "lose weight on a budget in Canada",
  "lose weight without exercise",
  "break a weight loss plateau",
  "get Ozempic for weight loss in Canada",
  "lose 10 pounds in a month",
  "lose 20 pounds",
  "stop emotional eating",
  "speed up metabolism",
  "meal prep for weight loss",
  "walk for weight loss",
] as const;

const howToSlugs: string[] = HOW_TO_TOPICS.map(
  (topic) =>
    `how-to-${topic
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`
);

// ─── product-review ───────────────────────────────────────────────────────────
// Formula: `${product_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-review`

const PRODUCT_REVIEW_NAMES = [
  "Ozempic",
  "Wegovy",
  "Saxenda",
  "Mounjaro",
  "Contrave",
  "PhenQ",
  "Hydroxycut",
  "Leanbean",
  "Berberine",
  "Garcinia Cambogia",
  "HelloFresh Canada",
  "Jenny Craig Canada",
  "Noom",
  "WW (Weight Watchers) Canada",
  "MyFitnessPal",
  "Cronometer",
  "Orgain Organic Protein",
  "Optimum Nutrition Gold Standard Whey",
] as const;

const productReviewSlugs: string[] = PRODUCT_REVIEW_NAMES.map(
  (name) =>
    `${name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}-review`
);

// ─── Exported manifest ────────────────────────────────────────────────────────

export const SEED_SLUGS: Record<string, string[]> = {
  "location-service": locationServiceSlugs,
  "how-to": howToSlugs,
  "product-review": productReviewSlugs,
};
