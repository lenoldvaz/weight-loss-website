import {
  LocationServiceSchema,
  LocationProductSchema,
  ProductReviewSchema,
  ComparisonSchema,
  HowToSchema,
  DemographicTopicSchema,
  ConditionTopicSchema,
  BestListSchema,
  TrendingArticleSchema,
} from "../../src/data/schemas/index.js";
import type { TemplateName } from "../../src/data/schemas/index.js";
import { ZodError } from "zod";

const SCHEMAS: Record<TemplateName, { parse: (data: unknown) => unknown }> = {
  "location-service": LocationServiceSchema,
  "location-product": LocationProductSchema,
  "product-review": ProductReviewSchema,
  "comparison": ComparisonSchema,
  "how-to": HowToSchema,
  "demographic-topic": DemographicTopicSchema,
  "condition-topic": ConditionTopicSchema,
  "best-list": BestListSchema,
  "trending-article": TrendingArticleSchema,
};

export interface ValidationResult {
  valid: boolean;
  data?: unknown;
  errors?: string[];
}

/** Parse raw LLM output string and validate against the schema for the given template */
export function validateContent(
  raw: string,
  template: TemplateName
): ValidationResult {
  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return {
      valid: false,
      errors: [`JSON parse error: ${(err as Error).message}`],
    };
  }

  const schema = SCHEMAS[template];
  if (!schema) {
    return { valid: false, errors: [`Unknown template: ${template}`] };
  }

  try {
    const data = schema.parse(parsed);
    return { valid: true, data };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map(
        (e) => `${e.path.join(".")} — ${e.message}`
      );
      return { valid: false, errors };
    }
    return { valid: false, errors: [(err as Error).message] };
  }
}
