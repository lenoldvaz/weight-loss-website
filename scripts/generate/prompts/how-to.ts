export interface HowToSeed {
  topic: string; // e.g. "lose belly fat"
  goal: string; // e.g. "reduce abdominal fat"
  audience?: string; // e.g. "Canadians over 40"
  year?: number;
}

export function buildHowToPrompt(seed: HowToSeed): string {
  const year = seed.year ?? 2026;
  const audience = seed.audience ?? "Canadians";
  return `You are a Canadian health content writer for weight-loss.ca. You write helpful, evidence-informed how-to guides for Canadians trying to lose weight.

Write a complete JSON object for a how-to guide: "How to ${seed.topic} in Canada (${year} Guide)"

Context:
- Topic: How to ${seed.topic}
- Goal: Help ${audience} ${seed.goal}
- Audience: ${audience}
- Tone: Practical, warm, expert. Like a personal trainer who is also a dietitian.
- Reference Canadian context: food products available in Canada, Canadian health guidelines (e.g. Canada's Food Guide), provincial resources, Canadian seasons/lifestyle where relevant
- Steps must be actionable and specific — not vague advice
- quick_answer should be a concise 1-3 sentence answer that could win a Google featured snippet

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "quick_answer": "string, 60-200 chars — direct answer to 'How to ${seed.topic}'",
  "intro": "string, 150-400 chars",
  "steps": [
    {
      "step_number": 1,
      "title": "Step title",
      "description": "80+ char description of exactly what to do",
      "tip": "Optional practical tip",
      "canadian_note": "Optional Canada-specific detail (e.g. 'Available at Costco Canada', 'Covered by most provincial plans')"
    }
  ],
  "key_takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "common_mistakes": [
    {
      "mistake": "Mistake name",
      "why_it_matters": "Why this mistake slows progress",
      "fix": "What to do instead"
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "canadian_context": "80+ chars — Canadian-specific context: food access, healthcare resources, seasonal factors, local options",
  "expert_note": "Optional 60+ char expert/evidence note — can reference a study or Canadian guideline",
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
- steps: 5 to 10 items, step_number must be sequential integers starting at 1
- key_takeaways: 3 to 5 items
- common_mistakes: 3 to 6 items
- tips: 3 to 6 items
- faqs: 5 to 8 items
- Return ONLY the JSON object`;
}
