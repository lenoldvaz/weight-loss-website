import type { TemplateName } from "../../src/data/schemas/index.js";

export type { TemplateName };

export type AnySeed =
  | LocationServiceSeedData
  | LocationProductSeedData
  | ProductReviewSeedData
  | ComparisonSeedData
  | HowToSeedData
  | DemographicTopicSeedData
  | ConditionTopicSeedData
  | BestListSeedData
  | TrendingArticleSeedData;

export interface LocationServiceSeedData {
  template: "location-service";
  city: string;
  province: string;
  province_code: string;
  service_type: string;
  service_slug: string;
  year?: number;
}

export interface LocationProductSeedData {
  template: "location-product";
  city: string;
  province: string;
  province_code: string;
  product_category: string;
  product_slug: string;
  year?: number;
}

export interface ProductReviewSeedData {
  template: "product-review";
  product_name: string;
  product_type: string;
  brand: string;
  year?: number;
}

export interface ComparisonSeedData {
  template: "comparison";
  option_a: string;
  option_b: string;
  comparison_type: string;
  year?: number;
}

export interface HowToSeedData {
  template: "how-to";
  topic: string;
  goal: string;
  audience?: string;
  year?: number;
}

export interface DemographicTopicSeedData {
  template: "demographic-topic";
  demographic: string;
  demographic_slug: string;
  topic: string;
  year?: number;
}

export interface ConditionTopicSeedData {
  template: "condition-topic";
  condition: string;
  condition_full: string;
  condition_slug: string;
  year?: number;
}

export interface BestListSeedData {
  template: "best-list";
  category: string;
  qualifier: string;
  location?: string;
  year?: number;
}

export interface TrendingArticleSeedData {
  template: "trending-article";
  topic: string;
  trending_hook: string;
  publish_date?: string;
  year?: number;
}

export interface GenerationResult {
  seed: AnySeed;
  slug: string;
  template: TemplateName;
  status: "success" | "validation_error" | "api_error";
  content?: unknown;
  errors?: string[];
  raw?: string;
  duration_ms?: number;
}
