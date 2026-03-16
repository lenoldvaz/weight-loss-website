import { z } from "zod";
import { HeroImageSchema } from "./location-service.schema.js";

export const ArticleSectionSchema = z.object({
  heading: z.string(),
  body: z.string().min(100),
  key_point: z.string().optional(),
});

export const TrendingArticleSchema = z.object({
  // SEO
  page_title: z.string().min(30).max(65),
  meta_description: z.string().min(120).max(160),
  h1: z.string().min(20).max(70),

  // Publish metadata
  publish_date: z.string(),
  last_updated: z.string(),
  reading_time_minutes: z.number().int().min(3).max(20),

  // Quick summary (for featured snippet / AI overview)
  quick_summary: z.string().min(60).max(250),

  // Intro
  intro: z.string().min(150).max(500),

  // Body sections (flexible — 3-8 sections)
  body_sections: z.array(ArticleSectionSchema).min(3).max(8),

  // Key takeaways (checklist / summary box)
  key_takeaways: z.array(z.string()).min(3).max(6),

  // Canadian angle (mandatory)
  canadian_context: z.string().min(80),

  // Sources / citations
  sources: z.array(
    z.object({
      title: z.string(),
      publisher: z.string(),
      url: z.string().optional(),
    })
  ).min(2).max(6),

  // Related topics for internal linking
  related_topics: z.array(z.string()).min(3).max(6),

  // FAQ
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string().min(40),
    })
  ).min(3).max(6),

  // CTA
  cta_heading: z.string(),
  cta_body: z.string(),

  // Hero image (generated after content, optional)
  hero_image: HeroImageSchema.optional(),
});

export type TrendingArticle = z.infer<typeof TrendingArticleSchema>;
export type ArticleSection = z.infer<typeof ArticleSectionSchema>;
