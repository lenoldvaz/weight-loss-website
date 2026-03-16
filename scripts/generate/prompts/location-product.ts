export interface LocationProductSeed {
  city: string;
  province: string;
  province_code: string;
  product_category: string; // e.g. "protein powder"
  product_slug: string; // e.g. "protein-powder"
  year?: number;
}

export function buildLocationProductPrompt(seed: LocationProductSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian health content writer for weight-loss.ca.

Write a complete JSON object for a page titled: "Best ${seed.product_category} for Weight Loss in ${seed.city} (${year})"

Context:
- City: ${seed.city}, ${seed.province} (${seed.province_code})
- Product category: ${seed.product_category}
- Audience: ${seed.city} residents looking to buy this product for weight loss
- All prices must be in CAD. Reference where Canadians can buy (Amazon.ca, iHerb, local health stores, Walmart Canada, etc.)
- Mention ${seed.province}-specific availability where relevant (e.g. local health food chains, Shoppers Drug Mart, etc.)
- Be balanced — include mainstream and premium options at different price points.

Output ONLY a valid JSON object — no markdown, no explanation. Must match this exact structure:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "intro": "string, 150-400 chars — engaging intro mentioning ${seed.city} and the product",
  "canadian_context": "string, 80-300 chars — Canadian buying context: where to find it, HST/GST notes, shipping to ${seed.province}",
  "product_list": [
    {
      "rank": 1,
      "name": "Product name",
      "brand": "Brand name",
      "tagline": "Short tagline",
      "description": "80+ char product description",
      "price_cad": "e.g. '$39.99 / 2 lbs'",
      "where_to_buy_canada": ["Amazon.ca", "iHerb"],
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1"],
      "best_for": "Who this product suits best",
      "affiliate_url": null
    }
  ],
  "buying_guide": {
    "what_to_look_for": ["criterion 1", "criterion 2", "criterion 3"],
    "red_flags": ["red flag 1", "red flag 2"],
    "budget_tip": "Budget tip for Canadians buying this product"
  },
  "where_to_buy_summary": "60+ chars — summary of best places to buy in Canada",
  "faqs": [
    {
      "question": "FAQ question",
      "answer": "40+ char answer"
    }
  ],
  "cta_heading": "Short CTA heading",
  "cta_body": "CTA body text"
}

Requirements:
- product_list: 3 to 8 items, with sequential rank values starting at 1
- buying_guide.what_to_look_for: 3 to 6 items
- buying_guide.red_flags: 2 to 4 items
- faqs: 5 to 8 items
- Return ONLY the JSON object`;
}
