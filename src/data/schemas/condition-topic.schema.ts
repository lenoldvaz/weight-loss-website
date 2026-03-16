import { z } from "zod";

export const ConditionTopicSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Quick answer
  quick_answer: z.string().min(60).max(200),

  // Intro
  intro: z.string().min(150).max(400),

  // Medical context — why this condition makes weight loss different
  medical_context: z.object({
    condition_overview: z.string().min(100),
    connection_to_weight: z.string().min(80),
    canadian_prevalence: z.string(),
    health_canada_guidance: z.string().optional(),
  }),

  // Strategies
  strategies: z.array(
    z.object({
      title: z.string(),
      description: z.string().min(80),
      evidence_level: z.enum(["strong", "moderate", "emerging", "anecdotal"]),
    })
  ).min(4).max(8),

  // Diet approach
  dietary_approach: z.object({
    recommended_pattern: z.string(),
    foods_to_emphasise: z.array(z.string()).min(4),
    foods_to_limit: z.array(z.string()).min(3),
    meal_timing_notes: z.string().optional(),
  }),

  // Exercise
  exercise_approach: z.string().min(80),

  // Medications / treatments relevant to this condition
  treatment_options: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["medication", "supplement", "procedure", "therapy"]),
      notes: z.string().min(40),
      health_canada_approved: z.boolean(),
    })
  ).min(2).max(6),

  // Cautions — important for YMYL
  cautions: z.array(z.string()).min(2).max(5),

  // When to seek help
  when_to_see_doctor: z.array(z.string()).min(2).max(4),

  // Canadian resources
  canadian_resources: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      url: z.string().optional(),
    })
  ).min(1).max(4),

  // Medical disclaimer (always required for condition pages)
  disclaimer: z.string().min(60),

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

export type ConditionTopic = z.infer<typeof ConditionTopicSchema>;
