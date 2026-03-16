import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const HowToStepSchema = z.object({
  step_number: z.number().int().min(1),
  title: z.string(),
  description: z.string().min(80),
  tip: z.string().optional(),
  canadian_note: z.string().optional(),
});

export const HowToSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Quick answer (satisfies featured snippet)
  quick_answer: z.string().min(60).max(200),

  // Intro
  intro: z.string().min(150).max(400),

  // Core steps
  steps: z.array(HowToStepSchema).min(5).max(10),

  // Supporting content
  key_takeaways: z.array(z.string()).min(3).max(5),
  common_mistakes: z.array(
    z.object({
      mistake: z.string(),
      why_it_matters: z.string(),
      fix: z.string(),
    })
  ).min(3).max(6),
  tips: z.array(z.string()).min(3).max(6),

  // Canadian context
  canadian_context: z.string().min(80),

  // Evidence / expert note
  expert_note: z.string().min(60).optional(),

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

export type HowTo = z.infer<typeof HowToSchema>;
export type HowToStep = z.infer<typeof HowToStepSchema>;
