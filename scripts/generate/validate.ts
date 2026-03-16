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

/**
 * Walk a parsed JSON object and truncate any string values that exceed
 * known schema max lengths. Prevents retries for minor over-length fields.
 */
const MAX_LENGTHS: Record<string, number> = {
  page_title: 65,
  meta_description: 160,
  h1: 70,
  intro: 400,
  local_context: 300,
  quick_answer: 200,
  verdict_summary: 200,
};

function sanitize(obj: unknown): unknown {
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof v === "string" && MAX_LENGTHS[k] !== undefined) {
        out[k] = v.length > MAX_LENGTHS[k] ? v.slice(0, MAX_LENGTHS[k]).trimEnd() : v;
      } else {
        out[k] = sanitize(v);
      }
    }
    return out;
  }
  return obj;
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
    parsed = sanitize(JSON.parse(cleaned));
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
