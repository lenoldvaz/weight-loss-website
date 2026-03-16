export interface BestListSeed {
  category: string; // e.g. "weight loss supplements"
  qualifier: string; // e.g. "for women" or "in Canada"
  location?: string; // optional city/province
  year?: number;
}

export function buildBestListPrompt(seed: BestListSeed): string {
  const year = seed.year ?? 2026;
  const locationStr = seed.location ? ` in ${seed.location}` : " in Canada";
  return `You are a Canadian health content writer for weight-loss.ca. You write expert roundup lists to help Canadians make informed purchasing decisions.

Write a complete JSON object for: "Best ${seed.category} ${seed.qualifier} (${year} Canadian Guide)"

Context:
- Category: ${seed.category}
- Qualifier: ${seed.qualifier}
- Location: ${locationStr}
- Audience: Canadians looking for the best ${seed.category} ${seed.qualifier}
- All prices in CAD. Include Canadian availability (Amazon.ca, iHerb, Costco Canada, etc.)
- Methodology section is required for E-E-A-T credibility — explain how you evaluated these picks
- quick_picks should be the best in key sub-categories (e.g. Best Budget, Best for Women, Best Overall)
- ranked_list items must have sequential rank values starting at 1

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "quick_picks": [
    {
      "category": "e.g. 'Best Overall'",
      "winner": "Product or provider name"
    }
  ],
  "intro": "string, 150-400 chars",
  "methodology": {
    "how_we_selected": "80+ chars — explain the evaluation criteria and research process",
    "criteria": ["criterion 1", "criterion 2", "criterion 3"],
    "canadian_factors": "60+ chars — what Canadian-specific factors were considered (Health Canada approval, CAD pricing, availability, etc.)"
  },
  "ranked_list": [
    {
      "rank": 1,
      "name": "Product/provider name",
      "tagline": "Short tagline",
      "description": "80+ char description",
      "why_it_made_the_list": "60+ chars — specific reason it earned its rank",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1"],
      "price_cad": "e.g. '$29.99/month'",
      "best_for": "Who this is best for",
      "affiliate_url": null
    }
  ],
  "buying_guide": {
    "intro": "60+ chars — intro to the buying guide",
    "key_factors": [
      {
        "factor": "Factor name",
        "explanation": "40+ chars — why this factor matters when choosing ${seed.category}"
      }
    ]
  },
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
- quick_picks: 3 to 5 items
- methodology.criteria: 3 to 6 items
- ranked_list: 5 to 10 items with sequential rank values
- buying_guide.key_factors: 3 to 6 items
- faqs: 5 to 8 items
- Return ONLY the JSON object`;
}
