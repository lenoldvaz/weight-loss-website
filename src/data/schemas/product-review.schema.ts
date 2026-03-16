import { z } from "zod";

export const RatingSchema = z.object({
  category: z.string(),
  score: z.number().min(1).max(10),
  notes: z.string(),
});

export const ProductReviewSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Verdict summary (above the fold)
  verdict_summary: z.string().min(80).max(200),
  overall_score: z.number().min(1).max(10),
  recommended: z.boolean(),
  best_for: z.string(),
  not_for: z.string(),

  // Intro
  intro: z.string().min(150).max(400),

  // Key facts
  key_facts: z.object({
    product_type: z.string(),
    manufacturer: z.string(),
    health_canada_status: z.string(),
    price_cad: z.string(),
    where_to_buy: z.array(z.string()).min(1),
    prescription_required: z.boolean(),
  }),

  // Ratings breakdown
  ratings: z.array(RatingSchema).min(4).max(7),

  // Pros / Cons
  pros: z.array(z.string()).min(3).max(6),
  cons: z.array(z.string()).min(2).max(5),

  // Deep sections
  how_it_works: z.string().min(100),
  evidence_summary: z.string().min(100),
  side_effects: z.array(z.string()).min(2),
  who_should_consider: z.string().min(80),
  canadian_availability: z.string().min(60),

  // Comparisons (optional)
  vs_alternatives: z.array(
    z.object({
      name: z.string(),
      comparison_note: z.string(),
    })
  ).min(2).max(4).optional(),

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
});

export type ProductReview = z.infer<typeof ProductReviewSchema>;
