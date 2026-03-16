export interface ComparisonSeed {
  option_a: string; // e.g. "Ozempic"
  option_b: string; // e.g. "Wegovy"
  comparison_type: string; // e.g. "GLP-1 medications", "diet plans", "meal kit services"
  year?: number;
}

export function buildComparisonPrompt(seed: ComparisonSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian health content writer for weight-loss.ca. You write balanced head-to-head comparisons to help Canadians make informed weight loss decisions.

Write a complete JSON object for: "${seed.option_a} vs ${seed.option_b}: Which Is Better for Weight Loss in Canada? (${year})"

Context:
- Option A: ${seed.option_a}
- Option B: ${seed.option_b}
- Category: ${seed.comparison_type}
- Audience: Canadians deciding between these two options
- All costs in CAD. Include Canadian availability, Health Canada status where relevant.
- Be genuinely balanced — the "winner" should be the best overall, but acknowledge each has strengths
- score values are numbers 1-10

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "quick_verdict": "string, 80-250 chars — clear verdict to satisfy skimmers",
  "overall_winner": "${seed.option_a} or ${seed.option_b}",
  "winner_reason": "string, 60+ chars — why this option wins overall",
  "intro": "string, 150-400 chars",
  "option_a": {
    "name": "${seed.option_a}",
    "tagline": "Short tagline",
    "overview": "80+ char overview",
    "pros": ["pro 1", "pro 2", "pro 3"],
    "cons": ["con 1", "con 2"],
    "best_for": "Who option A is best for",
    "cost_cad": "e.g. '$300-450/month'",
    "availability_canada": "Canadian availability summary",
    "score": 8.0
  },
  "option_b": {
    "name": "${seed.option_b}",
    "tagline": "Short tagline",
    "overview": "80+ char overview",
    "pros": ["pro 1", "pro 2", "pro 3"],
    "cons": ["con 1", "con 2"],
    "best_for": "Who option B is best for",
    "cost_cad": "e.g. '$400-600/month'",
    "availability_canada": "Canadian availability summary",
    "score": 7.5
  },
  "category_winners": [
    {
      "category": "Category name (e.g. 'Cost')",
      "winner": "${seed.option_a} or ${seed.option_b}",
      "reason": "40+ char reason why this option wins this category"
    }
  ],
  "comparison_table": [
    {
      "attribute": "Attribute name",
      "option_a_value": "Value for ${seed.option_a}",
      "option_b_value": "Value for ${seed.option_b}"
    }
  ],
  "choose_a_if": ["situation 1", "situation 2", "situation 3"],
  "choose_b_if": ["situation 1", "situation 2", "situation 3"],
  "canadian_context": "60+ chars — Canada-specific context (drug coverage, availability, Health Canada)",
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
- option_a.pros: 3 to 6 items
- option_a.cons: 2 to 5 items
- option_b.pros: 3 to 6 items
- option_b.cons: 2 to 5 items
- category_winners: 4 to 8 items
- comparison_table: 6 to 12 rows
- choose_a_if: 3 to 5 items
- choose_b_if: 3 to 5 items
- faqs: 5 to 8 items
- score values must be numbers (e.g. 8.0), not strings
- Return ONLY the JSON object`;
}
