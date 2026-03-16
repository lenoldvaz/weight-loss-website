import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const DemographicTopicSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Quick answer
  quick_answer: z.string().min(60).max(200),

  // Intro
  intro: z.string().min(150).max(400),

  // Why this demographic is different
  unique_challenges: z.array(
    z.object({
      challenge: z.string(),
      explanation: z.string().min(60),
    })
  ).min(3).max(6),

  // Strategies tailored to this group
  strategies: z.array(
    z.object({
      title: z.string(),
      description: z.string().min(80),
      evidence_note: z.string().optional(),
    })
  ).min(4).max(8),

  // Diet recommendations
  diet_recommendations: z.array(z.string()).min(3).max(6),

  // Exercise recommendations
  exercise_recommendations: z.array(z.string()).min(3).max(6),

  // Product / program recommendations relevant to this group
  product_recommendations: z.array(
    z.object({
      name: z.string(),
      reason: z.string().min(40),
    })
  ).min(2).max(5),

  // What to avoid
  what_to_avoid: z.array(z.string()).min(2).max(4),

  // Canadian context
  canadian_context: z.string().min(80),

  // When to see a doctor
  see_a_doctor_if: z.array(z.string()).min(2).max(4),

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

export type DemographicTopic = z.infer<typeof DemographicTopicSchema>;
