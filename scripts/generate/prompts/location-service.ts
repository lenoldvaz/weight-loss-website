export interface LocationServiceSeed {
  city: string;
  province: string;
  province_code: string;
  service_type: string; // e.g. "weight loss clinic"
  service_slug: string; // e.g. "weight-loss-clinics"
  year?: number;
}

export function buildLocationServicePrompt(seed: LocationServiceSeed): string {
  const year = seed.year ?? 2026;
  return `You are a Canadian health content writer producing a helpful, trustworthy local guide for weight-loss.ca.

Write a complete JSON object for a page titled: "Best ${seed.service_type}s in ${seed.city}, ${seed.province} (${year})"

Context:
- City: ${seed.city}, ${seed.province} (${seed.province_code})
- Service: ${seed.service_type}
- Audience: Canadians searching for local weight loss help
- Tone: Helpful, credible, not overly medical. Like a trusted friend who has done the research.
- All costs must be in CAD. Reference provincial health insurance (e.g. OHIP, MSP, AHCIP) accurately.
- Include 3-7 real, plausible clinic/provider picks. You may use well-known chains (Wharton Medical, Cleveland Clinic Canada, Ideal Protein, Herbal Magic) plus realistic local names.
- This is a YMYL (health) page. Be accurate and responsible.

Output ONLY a valid JSON object — no markdown fences, no explanation, no preamble. The JSON must match this exact structure:

{
  "page_title": "string, 30-65 chars — e.g. 'Best Weight Loss Clinics in ${seed.city} (${year})'",
  "meta_description": "string, 120-160 chars — enticing description with ${seed.city} keyword",
  "h1": "string, 20-70 chars",
  "intro": "string, 150-400 chars — engaging intro mentioning ${seed.city} and the service",
  "local_context": "string, 100-300 chars — specific local detail about ${seed.city} (obesity rates, healthcare landscape, notable hospitals, etc.)",
  "top_picks": [
    {
      "name": "Clinic or provider name",
      "tagline": "Short tagline",
      "description": "80+ char description of this provider",
      "services_offered": ["service 1", "service 2"],
      "price_range": "e.g. '$150-300/month' or 'Free with referral'",
      "covered_by_insurance": true,
      "address_area": "Neighbourhood or district in ${seed.city}",
      "phone": "Optional phone number",
      "website": "Optional website URL",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1"],
      "best_for": "Who this clinic is best suited for"
    }
  ],
  "what_to_look_for": ["criterion 1", "criterion 2", "criterion 3", "criterion 4"],
  "average_cost_context": "60+ chars — what ${seed.city} residents typically pay for this service in CAD",
  "insurance_notes": "60+ chars — which provincial plans cover this service in ${seed.province_code}, and what conditions apply",
  "faqs": [
    {
      "question": "A question a ${seed.city} resident would Google",
      "answer": "40+ char answer"
    }
  ],
  "cta_heading": "Short CTA heading",
  "cta_body": "CTA body text encouraging email sign-up or next step"
}

Requirements:
- top_picks: 3 to 7 items
- what_to_look_for: 4 to 6 items
- faqs: 5 to 8 items
- All string fields must meet the minimum character counts specified
- covered_by_insurance must be a boolean (true or false)
- Return ONLY the JSON object, starting with { and ending with }`;
}
