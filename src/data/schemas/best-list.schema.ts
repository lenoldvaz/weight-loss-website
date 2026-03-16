import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const ListItemSchema = z.object({
  rank: z.number().int().min(1),
  name: z.string(),
  tagline: z.string(),
  description: z.string().min(80),
  why_it_made_the_list: z.string().min(60),
  pros: z.array(z.string()).min(2).max(5),
  cons: z.array(z.string()).min(1).max(3),
  price_cad: z.string(),
  best_for: z.string(),
  affiliate_url: z.string().optional(),
});

export const BestListSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Quick picks (for readers who want the answer fast)
  quick_picks: z.array(
    z.object({
      category: z.string(),
      winner: z.string(),
    })
  ).min(3).max(5),

  // Intro
  intro: z.string().min(150).max(400),

  // Methodology (required for credibility — E-E-A-T)
  methodology: z.object({
    how_we_selected: z.string().min(80),
    criteria: z.array(z.string()).min(3).max(6),
    canadian_factors: z.string().min(60),
  }),

  // The ranked list
  ranked_list: z.array(ListItemSchema).min(5).max(10),

  // Buying guide
  buying_guide: z.object({
    intro: z.string().min(60),
    key_factors: z.array(
      z.object({
        factor: z.string(),
        explanation: z.string().min(40),
      })
    ).min(3).max(6),
  }),

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

export type BestList = z.infer<typeof BestListSchema>;
export type ListItem = z.infer<typeof ListItemSchema>;
