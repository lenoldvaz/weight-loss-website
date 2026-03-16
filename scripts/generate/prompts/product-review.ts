export interface ProductReviewSeed {
  product_name: string; // e.g. "Ozempic"
  product_type: string; // e.g. "GLP-1 medication"
  brand: string; // e.g. "Novo Nordisk"
  year?: number;
}

export function buildProductReviewPrompt(seed: ProductReviewSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian health content writer for weight-loss.ca. You write balanced, evidence-informed reviews of weight loss products, supplements, and medications.

Write a complete JSON object for a review page: "${seed.product_name} Review (${year}) — Does It Work for Weight Loss in Canada?"

Context:
- Product: ${seed.product_name}
- Type: ${seed.product_type}
- Brand/Manufacturer: ${seed.brand}
- Audience: Canadians considering this product for weight loss
- Health Canada regulatory status must be accurate
- Prices in CAD. Mention provincial drug coverage (ODB, PharmaCare, etc.) where relevant.
- Be balanced — acknowledge both evidence and limitations. This is a YMYL health page.
- overall_score is a number from 1-10 (e.g. 7.5)
- recommended is a boolean

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars — include product name and 'Review'",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "verdict_summary": "string, 80-200 chars — honest one-paragraph verdict",
  "overall_score": 7.5,
  "recommended": true,
  "best_for": "Who this product is best suited for",
  "not_for": "Who should avoid this product",
  "intro": "string, 150-400 chars",
  "key_facts": {
    "product_type": "${seed.product_type}",
    "manufacturer": "${seed.brand}",
    "health_canada_status": "Accurate Health Canada approval/status string",
    "price_cad": "e.g. '$350-500/month'",
    "where_to_buy": ["pharmacy", "online"],
    "prescription_required": true
  },
  "ratings": [
    {
      "category": "Effectiveness",
      "score": 8.5,
      "notes": "Notes on effectiveness"
    }
  ],
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "how_it_works": "100+ chars — mechanism of action explained clearly for general audience",
  "evidence_summary": "100+ chars — what clinical evidence shows, citing key studies if applicable",
  "side_effects": ["side effect 1", "side effect 2"],
  "who_should_consider": "80+ chars — ideal candidate profile",
  "canadian_availability": "60+ chars — where to get it in Canada, prescription pathway, cost assistance programs",
  "vs_alternatives": [
    {
      "name": "Alternative product name",
      "comparison_note": "Brief comparison note"
    }
  ],
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
- ratings: 4 to 7 items with score values between 1-10
- pros: 3 to 6 items
- cons: 2 to 5 items
- side_effects: at least 2 items
- vs_alternatives: 2 to 4 items (optional but include if possible)
- faqs: 5 to 8 items
- overall_score must be a number (e.g. 7.5), not a string
- prescription_required must be a boolean
- recommended must be a boolean
- Return ONLY the JSON object`;
}
