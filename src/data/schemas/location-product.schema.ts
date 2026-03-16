import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const ProductItemSchema = z.object({
  rank: z.number().int().min(1),
  name: z.string(),
  brand: z.string(),
  tagline: z.string(),
  description: z.string().min(80),
  price_cad: z.string(),
  where_to_buy_canada: z.array(z.string()).min(1),
  pros: z.array(z.string()).min(2).max(5),
  cons: z.array(z.string()).min(1).max(3),
  best_for: z.string(),
  affiliate_url: z.string().optional(),
});

export const LocationProductSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Content
  intro: z.string().min(150).max(400),
  canadian_context: z.string().min(80).max(300),

  // Core data
  product_list: z.array(ProductItemSchema).min(3).max(8),

  // Supporting content
  buying_guide: z.object({
    what_to_look_for: z.array(z.string()).min(3).max(6),
    red_flags: z.array(z.string()).min(2).max(4),
    budget_tip: z.string(),
  }),

  // Canadian availability note
  where_to_buy_summary: z.string().min(60),

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

export type LocationProduct = z.infer<typeof LocationProductSchema>;
