export interface ConditionTopicSeed {
  condition: string; // e.g. "PCOS"
  condition_full: string; // e.g. "Polycystic Ovary Syndrome"
  condition_slug: string; // e.g. "pcos"
  year?: number;
}

export function buildConditionTopicPrompt(seed: ConditionTopicSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian medical health writer for weight-loss.ca. You write accurate, empathetic, and evidence-based guides about weight loss in the context of specific medical conditions.

Write a complete JSON object for: "Weight Loss with ${seed.condition} (${seed.condition_full}): A Canadian Guide (${year})"

Context:
- Condition: ${seed.condition} (${seed.condition_full})
- Audience: Canadians living with ${seed.condition} who want to lose weight
- Tone: Compassionate, evidence-based, empowering. Acknowledge that standard weight loss advice often doesn't work for people with ${seed.condition}.
- Health Canada references and Canadian prevalence data should be included
- This is a YMYL medical page — be accurate, include appropriate cautions, always recommend consulting a healthcare provider
- disclaimer is mandatory and must clearly state this is not medical advice

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "quick_answer": "string, 60-200 chars — what Canadians with ${seed.condition} need to know about weight loss",
  "intro": "string, 150-400 chars",
  "medical_context": {
    "condition_overview": "100+ chars — what ${seed.condition} is and how it affects metabolism/weight",
    "connection_to_weight": "80+ chars — how ${seed.condition} specifically causes or complicates weight gain",
    "canadian_prevalence": "Canadian prevalence stat (e.g. 'Affects X% of Canadian women...')",
    "health_canada_guidance": "Optional Health Canada guidance related to ${seed.condition}"
  },
  "strategies": [
    {
      "title": "Strategy title",
      "description": "80+ chars — specific strategy for losing weight with ${seed.condition}",
      "evidence_level": "strong"
    }
  ],
  "dietary_approach": {
    "recommended_pattern": "Name of the best dietary pattern for ${seed.condition}",
    "foods_to_emphasise": ["food 1", "food 2", "food 3", "food 4"],
    "foods_to_limit": ["food 1", "food 2", "food 3"],
    "meal_timing_notes": "Optional note on meal timing for ${seed.condition}"
  },
  "exercise_approach": "80+ chars — best types and amounts of exercise for ${seed.condition}",
  "treatment_options": [
    {
      "name": "Treatment name",
      "type": "medication",
      "notes": "40+ chars — how this treatment helps with ${seed.condition} and weight",
      "health_canada_approved": true
    }
  ],
  "cautions": ["caution 1", "caution 2"],
  "when_to_see_doctor": ["situation 1", "situation 2"],
  "canadian_resources": [
    {
      "name": "Resource name",
      "description": "What this resource offers",
      "url": "Optional URL"
    }
  ],
  "disclaimer": "60+ chars — must state this content is for informational purposes only and is not a substitute for medical advice",
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
- strategies: 4 to 8 items
- strategies[].evidence_level must be one of: "strong", "moderate", "emerging", "anecdotal"
- dietary_approach.foods_to_emphasise: at least 4 items
- dietary_approach.foods_to_limit: at least 3 items
- treatment_options: 2 to 6 items
- treatment_options[].type must be one of: "medication", "supplement", "procedure", "therapy"
- treatment_options[].health_canada_approved must be a boolean
- cautions: 2 to 5 items
- when_to_see_doctor: 2 to 4 items
- canadian_resources: 1 to 4 items
- faqs: 5 to 8 items
- disclaimer is mandatory and must not be empty
- Return ONLY the JSON object`;
}
