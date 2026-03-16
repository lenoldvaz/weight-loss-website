export interface TrendingArticleSeed {
  topic: string; // e.g. "Ozempic shortage Canada 2026"
  trending_hook: string; // e.g. "why Ozempic is still hard to get in Canada"
  publish_date?: string; // ISO date string e.g. "2026-03-16"
  year?: number;
}

export function buildTrendingArticlePrompt(seed: TrendingArticleSeed): string {
  const year = seed.year ?? 2026;
  const publishDate = seed.publish_date ?? new Date().toISOString().split("T")[0];
  return `You are a Canadian health journalist for weight-loss.ca. You write timely, well-sourced articles about trending weight loss topics in Canada.

Write a complete JSON object for a trending article about: "${seed.topic}"

Context:
- Topic: ${seed.topic}
- Trending hook: ${seed.trending_hook}
- Audience: Canadians who are actively searching for news and information about this topic
- Tone: Journalistic but accessible. Inform and educate, not sensationalize.
- Must include a strong Canadian angle — why this matters specifically for Canadians
- Sources must be real, credible publishers (Health Canada, CBC, Globe and Mail, Canadian medical journals, etc.)
- reading_time_minutes should be accurate (roughly 200 words per minute)
- publish_date: "${publishDate}"
- last_updated: "${publishDate}"

Output ONLY a valid JSON object — no markdown, no explanation:

{
  "page_title": "string, 30-65 chars",
  "meta_description": "string, 120-160 chars",
  "h1": "string, 20-70 chars",
  "publish_date": "${publishDate}",
  "last_updated": "${publishDate}",
  "reading_time_minutes": 5,
  "quick_summary": "string, 60-250 chars — 2-3 sentence summary for featured snippet",
  "intro": "string, 150-500 chars",
  "body_sections": [
    {
      "heading": "Section heading",
      "body": "100+ chars — substantive section content",
      "key_point": "Optional key point or pull quote from this section"
    }
  ],
  "key_takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "canadian_context": "80+ chars — why this topic is specifically relevant to Canadians (policy, healthcare system, availability, cost, etc.)",
  "sources": [
    {
      "title": "Article or document title",
      "publisher": "Publisher name (e.g. Health Canada, CBC News, CMAJ)",
      "url": null
    }
  ],
  "related_topics": ["related topic 1", "related topic 2", "related topic 3"],
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
- body_sections: 3 to 8 items
- key_takeaways: 3 to 6 items
- sources: 2 to 6 items with real publisher names
- related_topics: 3 to 6 items
- faqs: 3 to 6 items
- reading_time_minutes must be an integer between 3 and 20
- Return ONLY the JSON object`;
}
