import type { AnySeed } from "./types.js";
import { buildLocationServicePrompt } from "./prompts/location-service.js";
import { buildLocationProductPrompt } from "./prompts/location-product.js";
import { buildProductReviewPrompt } from "./prompts/product-review.js";
import { buildComparisonPrompt } from "./prompts/comparison.js";
import { buildHowToPrompt } from "./prompts/how-to.js";
import { buildDemographicTopicPrompt } from "./prompts/demographic-topic.js";
import { buildConditionTopicPrompt } from "./prompts/condition-topic.js";
import { buildBestListPrompt } from "./prompts/best-list.js";
import { buildTrendingArticlePrompt } from "./prompts/trending-article.js";

export const SYSTEM_PROMPT = `You are a JSON content generator for weight-loss.ca, a Canadian health publication.
Your sole job is to produce valid JSON objects that match the exact schema provided in the user's prompt.

Rules:
1. Output ONLY raw JSON — no markdown code fences, no explanation, no preamble or postamble
2. Every required field must be present and non-empty
3. All string fields must meet the minimum character lengths specified
4. All arrays must have at least the minimum number of items specified
5. Numeric fields (scores, ranks, etc.) must be actual numbers, not strings
6. Boolean fields must be actual booleans (true/false), not strings
7. The response must start with { and end with }
8. Do not add any fields that are not in the schema
9. All content must be accurate, helpful, and appropriate for a Canadian health audience`;

export function buildPrompt(seed: AnySeed): string {
  switch (seed.template) {
    case "location-service":
      return buildLocationServicePrompt(seed);
    case "location-product":
      return buildLocationProductPrompt(seed);
    case "product-review":
      return buildProductReviewPrompt(seed);
    case "comparison":
      return buildComparisonPrompt(seed);
    case "how-to":
      return buildHowToPrompt(seed);
    case "demographic-topic":
      return buildDemographicTopicPrompt(seed);
    case "condition-topic":
      return buildConditionTopicPrompt(seed);
    case "best-list":
      return buildBestListPrompt(seed);
    case "trending-article":
      return buildTrendingArticlePrompt(seed);
    default: {
      const _exhaustive: never = seed;
      throw new Error(`Unknown template: ${(_exhaustive as AnySeed).template}`);
    }
  }
}

/** Derive a URL slug from a seed */
export function buildSlug(seed: AnySeed): string {
  switch (seed.template) {
    case "location-service":
      return `${seed.service_slug}-${seed.city.toLowerCase().replace(/\s+/g, "-")}`;
    case "location-product":
      return `best-${seed.product_slug}-${seed.city.toLowerCase().replace(/\s+/g, "-")}`;
    case "product-review":
      return `${seed.product_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-review`;
    case "comparison":
      return `${seed.option_a.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-vs-${seed.option_b.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    case "how-to":
      return `how-to-${seed.topic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    case "demographic-topic":
      return `weight-loss-for-${seed.demographic_slug}`;
    case "condition-topic":
      return `weight-loss-with-${seed.condition_slug}`;
    case "best-list":
      return `best-${seed.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}${seed.qualifier ? "-" + seed.qualifier.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : ""}`;
    case "trending-article":
      return seed.topic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    default: {
      const _exhaustive: never = seed;
      throw new Error(`Unknown template: ${(_exhaustive as AnySeed).template}`);
    }
  }
}
