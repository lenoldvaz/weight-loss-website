import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const ComparisonSideSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  overview: z.string().min(80),
  pros: z.array(z.string()).min(3).max(6),
  cons: z.array(z.string()).min(2).max(5),
  best_for: z.string(),
  cost_cad: z.string(),
  availability_canada: z.string(),
  score: z.number().min(1).max(10),
});

export const CategoryWinnerSchema = z.object({
  category: z.string(),
  winner: z.string(),
  reason: z.string().min(40),
});

export const ComparisonSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Verdict (above the fold)
  quick_verdict: z.string().min(80).max(250),
  overall_winner: z.string(),
  winner_reason: z.string().min(60),

  // Intro
  intro: z.string().min(150).max(400),

  // The two sides
  option_a: ComparisonSideSchema,
  option_b: ComparisonSideSchema,

  // Category breakdown
  category_winners: z.array(CategoryWinnerSchema).min(4).max(8),

  // Comparison table rows
  comparison_table: z.array(
    z.object({
      attribute: z.string(),
      option_a_value: z.string(),
      option_b_value: z.string(),
    })
  ).min(6).max(12),

  // Who should choose what
  choose_a_if: z.array(z.string()).min(3).max(5),
  choose_b_if: z.array(z.string()).min(3).max(5),

  // Canadian context
  canadian_context: z.string().min(60),

  // FAQ
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string().min(40),
    })
  ).min(5).max(8),

  // CTA
  cta_heading: z.string(),
  cta_body: z.string(),

  // Hero image (generated after content, optional)
  hero_image: HeroImageSchema.optional(),
});

export type Comparison = z.infer<typeof ComparisonSchema>;
