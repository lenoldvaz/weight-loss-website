export interface DemographicTopicSeed {
  demographic: string; // e.g. "women over 40"
  demographic_slug: string; // e.g. "women-over-40"
  topic: string; // e.g. "weight loss"
  year?: number;
}

export function buildDemographicTopicPrompt(seed: DemographicTopicSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian health content writer for weight-loss.ca. You write targeted, empathetic guides for specific demographic groups trying to lose weight in Canada.

Write a complete JSON object for: "Weight Loss for ${seed.demographic}: The Complete Canadian Guide (${year})"

Context:
- Demographic: ${seed.demographic}
- Topic: ${seed.topic}
- Audience: ${seed.demographic} living in Canada
- Tone: Empathetic, practical, evidence-informed. Acknowledge the specific challenges this group faces.
- quick_answer should directly address what makes weight loss different for ${seed.demographic}
- Strategies should be specifically tailored to this demographic — not generic advice
- Reference Canadian resources: provincial health services, Canadian research, Canadian diet programs

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "quick_answer": "string, 60-200 chars — what makes weight loss different for ${seed.demographic}",
  "intro": "string, 150-400 chars",
  "unique_challenges": [
    {
      "challenge": "Challenge name",
      "explanation": "60+ chars — why this challenge is specific to ${seed.demographic}"
    }
  ],
  "strategies": [
    {
      "title": "Strategy title",
      "description": "80+ chars — specific, actionable strategy for ${seed.demographic}",
      "evidence_note": "Optional note on evidence or research backing this strategy"
    }
  ],
  "diet_recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "exercise_recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "product_recommendations": [
    {
      "name": "Product or program name",
      "reason": "40+ chars — why this is a good fit for ${seed.demographic}"
    }
  ],
  "what_to_avoid": ["thing to avoid 1", "thing to avoid 2"],
  "canadian_context": "80+ chars — Canadian resources, programs, and context for ${seed.demographic}",
  "see_a_doctor_if": ["situation 1", "situation 2"],
  "faqs": [
    {
      "question": "FAQ question",
      "answer": "40+ char answer"
    }
  ],
  "cta_heading": "CTA heading",
  "cta_body": "CTA body text"
}

Requirements:
- unique_challenges: 3 to 6 items
- strategies: 4 to 8 items
- diet_recommendations: 3 to 6 items
- exercise_recommendations: 3 to 6 items
- product_recommendations: 2 to 5 items
- what_to_avoid: 2 to 4 items
- see_a_doctor_if: 2 to 4 items
- faqs: 5 to 8 items
- Return ONLY the JSON object`;
}
