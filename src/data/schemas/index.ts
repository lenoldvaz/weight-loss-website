export * from "./location-service.schema";
export * from "./location-product.schema";
export * from "./product-review.schema";
export * from "./comparison.schema";
export * from "./how-to.schema";
export * from "./demographic-topic.schema";
export * from "./condition-topic.schema";
export * from "./best-list.schema";
export * from "./trending-article.schema";

// Template name → schema map (used by the generation pipeline)
export const TEMPLATE_SCHEMAS = {
  "location-service": "LocationServiceSchema",
  "location-product": "LocationProductSchema",
  "product-review": "ProductReviewSchema",
  "comparison": "ComparisonSchema",
  "how-to": "HowToSchema",
  "demographic-topic": "DemographicTopicSchema",
  "condition-topic": "ConditionTopicSchema",
  "best-list": "BestListSchema",
  "trending-article": "TrendingArticleSchema",
} as const;

export type TemplateName = keyof typeof TEMPLATE_SCHEMAS;
