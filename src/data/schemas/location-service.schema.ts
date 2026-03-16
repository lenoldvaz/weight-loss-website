import { z } from "zod";

export const PickSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string().min(80),
  services_offered: z.array(z.string()).min(2),
  price_range: z.string(),
  covered_by_insurance: z.boolean(),
  address_area: z.string(),
  phone: z.string().optional(),
  website: z.string().optional(),
  pros: z.array(z.string()).min(2).max(4),
  cons: z.array(z.string()).min(1).max(3),
  best_for: z.string(),
});

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string().min(40),
});

export const LocationServiceSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Content
  intro: z.string().min(150).max(400),
  local_context: z.string().min(100).max(300),

  // Core data
  top_picks: z.array(PickSchema).min(3).max(7),

  // Supporting content
  what_to_look_for: z.array(z.string()).min(4).max(6),
  average_cost_context: z.string().min(60),
  insurance_notes: z.string().min(60),

  // FAQ
  faqs: z.array(FaqSchema).min(5).max(8),

  // CTA
  cta_heading: z.string(),
  cta_body: z.string(),
});

export type LocationService = z.infer<typeof LocationServiceSchema>;
export type Pick = z.infer<typeof PickSchema>;
