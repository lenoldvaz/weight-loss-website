import fs from "fs";
import path from "path";

interface FieldInfo {
  name: string;
  type: string;
  constraints: string[];
}

interface SchemaCard {
  filename: string;
  templateName: string;
  templateKey: string;
  fields: FieldInfo[];
  rawLines: number;
}

interface SchemaDescription {
  description: string;
  example: string;
  keyFields: string[];
}

// ─── Human-readable descriptions for each template ───────────────────────────

const SCHEMA_DESCRIPTIONS: Record<string, SchemaDescription> = {
  "location-service": {
    description:
      "Local service guide pages — one page per city × service type combination (e.g. weight loss clinics, dietitians, bariatric surgeons). The core programmatic SEO template.",
    example: "Best Weight Loss Clinics in Vancouver (2026)",
    keyFields: [
      "top_picks — 3–7 real clinic/provider listings with pros, cons, and price range",
      "local_context — city-specific healthcare context (100–300 chars)",
      "faqs — 5–8 questions a local resident would Google",
      "insurance_notes — provincial drug/service coverage details",
      "what_to_look_for — buyer's guide checklist (4–6 items)",
    ],
  },
  "location-product": {
    description:
      "City-scoped product roundup pages — best weight loss products available in a specific Canadian city or province. Combines local intent with product affiliate opportunities.",
    example: "Best Weight Loss Supplements in Calgary (2026)",
    keyFields: [
      "product_list — 3–8 ranked products with price, pros/cons, and where to buy in Canada",
      "canadian_context — province-specific availability and regulation notes (80–300 chars)",
      "buying_guide — what to look for, red flags, and a budget tip",
      "where_to_buy_summary — summary of Canadian retail/online options",
      "faqs — 5–8 location-relevant questions",
    ],
  },
  "product-review": {
    description:
      "In-depth single-product review pages covering medications, supplements, apps, and meal programs. Targets high-intent 'product name review' searches.",
    example: "Ozempic Review: Does It Work for Weight Loss in Canada? (2026)",
    keyFields: [
      "verdict_summary — above-the-fold verdict (80–200 chars)",
      "overall_score — numeric rating 1–10",
      "key_facts — product type, manufacturer, Health Canada status, CAD price, where to buy",
      "ratings — 4–7 category scores with notes (e.g. Efficacy, Side Effects, Cost)",
      "evidence_summary — what the science says (min 100 chars)",
      "canadian_availability — where Canadians can get it and coverage notes",
    ],
  },
  "comparison": {
    description:
      "Head-to-head comparison pages for two products, medications, or approaches. Targets 'X vs Y' search queries.",
    example: "Ozempic vs Wegovy: Which Is Better for Weight Loss in Canada?",
    keyFields: [
      "option_a / option_b — full profile for each side (pros, cons, cost_cad, score)",
      "quick_verdict — above-the-fold winner summary (80–250 chars)",
      "category_winners — 4–8 head-to-head category breakdowns",
      "comparison_table — 6–12 attribute rows (side-by-side values)",
      "choose_a_if / choose_b_if — scenario-based decision guidance",
    ],
  },
  "how-to": {
    description:
      "Step-by-step instructional guides targeting 'how to lose X' and 'how to start Y' queries. Each page must satisfy a featured-snippet intent.",
    example: "How to Lose Belly Fat: 7 Steps That Actually Work (Canada 2026)",
    keyFields: [
      "quick_answer — 60–200 char featured-snippet answer",
      "steps — 5–10 numbered steps, each with description (min 80 chars), optional tip and canadian_note",
      "common_mistakes — 3–6 mistakes with fix and why_it_matters",
      "key_takeaways — 3–5 bullet summary points",
      "canadian_context — Canada-specific advice (min 80 chars)",
    ],
  },
  "demographic-topic": {
    description:
      "Audience-specific weight loss guides for a defined demographic group (e.g. women over 50, men with desk jobs, postpartum mothers). Targets 'weight loss for [group]' queries.",
    example: "Weight Loss for Women Over 50: What Actually Works in Canada",
    keyFields: [
      "unique_challenges — 3–6 challenges specific to this demographic with explanations",
      "strategies — 4–8 tailored strategies with evidence notes",
      "diet_recommendations / exercise_recommendations — group-specific lists",
      "product_recommendations — 2–5 products suited to this demographic",
      "see_a_doctor_if — safety flags for when to seek medical advice",
    ],
  },
  "condition-topic": {
    description:
      "Medically-focused weight loss guides for people with a specific health condition (e.g. PCOS, hypothyroidism, type 2 diabetes). YMYL-sensitive — includes mandatory disclaimer.",
    example: "How to Lose Weight with PCOS: Evidence-Based Guide for Canadians",
    keyFields: [
      "medical_context — condition overview, its connection to weight, and Canadian prevalence",
      "strategies — 4–8 strategies each with evidence_level (strong/moderate/emerging/anecdotal)",
      "dietary_approach — recommended pattern, foods to emphasise/limit, meal timing",
      "treatment_options — 2–6 medications/supplements/procedures with health_canada_approved flag",
      "canadian_resources — 1–4 links to Canadian health organisations",
      "disclaimer — required medical disclaimer (min 60 chars)",
    ],
  },
  "best-list": {
    description:
      "Ranked 'best of' list pages for products or programs in a category. Targets 'best weight loss X' queries and supports affiliate monetisation.",
    example: "Best Weight Loss Apps in Canada (2026) — Ranked & Reviewed",
    keyFields: [
      "ranked_list — 5–10 items each with rank, pros/cons, price_cad, best_for, optional affiliate_url",
      "quick_picks — 3–5 category winners shown above the fold",
      "methodology — how_we_selected, criteria list, canadian_factors (E-E-A-T signal)",
      "buying_guide — key_factors with explanations (3–6 items)",
      "faqs — 5–8 purchase-intent questions",
    ],
  },
  "trending-article": {
    description:
      "News-style editorial articles tied to trending weight loss topics or recent research. Used for topical authority and freshness signals.",
    example: "Ozempic Shortage in Canada: What You Need to Know (2026)",
    keyFields: [
      "quick_summary — 60–250 char answer suitable for AI overview / featured snippet",
      "body_sections — 3–8 flexible sections (heading + body min 100 chars + optional key_point)",
      "key_takeaways — 3–6 bullet summary points",
      "canadian_context — Canada-specific angle (min 80 chars, mandatory)",
      "sources — 2–6 citations with title, publisher, and optional URL",
      "publish_date / last_updated — for freshness signals",
    ],
  },
};

/**
 * Very lightweight static analysis of a zod schema file.
 * Extracts field names and some common constraints without
 * executing the module (safe for a server component).
 */
function parseSchemaFile(content: string): FieldInfo[] {
  const fields: FieldInfo[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match lines like:   field_name: z.string().min(10).max(65),
    const match = line.match(/^\s{2,}(\w+):\s*z\.(\w+)\(([^)]*)\)(.*),?\s*$/);
    if (!match) continue;

    const name = match[1];
    const baseType = match[2];
    const rest = match[4] ?? "";

    const constraints: string[] = [];

    // min/max on the rest chain
    const minMatch = rest.match(/\.min\((\d+)\)/);
    const maxMatch = rest.match(/\.max\((\d+)\)/);
    if (minMatch) constraints.push(`min: ${minMatch[1]}`);
    if (maxMatch) constraints.push(`max: ${maxMatch[1]}`);

    // optional
    if (rest.includes(".optional()")) constraints.push("optional");

    // array?
    const isArray = baseType === "array";
    const displayType = isArray ? "array" : baseType;

    fields.push({ name, type: displayType, constraints });
  }

  return fields;
}

function getSchemaCards(): SchemaCard[] {
  const schemasDir = path.join(process.cwd(), "src/data/schemas");
  const files = fs.readdirSync(schemasDir).filter(
    (f) => f.endsWith(".schema.ts") || (f.endsWith(".ts") && f !== "index.ts")
  );

  return files.map((filename) => {
    const filePath = path.join(schemasDir, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").length;
    const fields = parseSchemaFile(content);
    const templateKey = filename
      .replace(".schema.ts", "")
      .replace(".ts", "");
    const templateName = templateKey
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { filename, templateName, templateKey, fields, rawLines: lines };
  });
}

export default function SchemasPage() {
  const schemas = getSchemaCards();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Schemas</h1>
      <p className="text-gray-400 text-sm mb-8">
        {schemas.length} template schemas — read-only (changes require code edits)
      </p>

      <div className="space-y-6">
        {schemas.map((schema) => {
          const desc = SCHEMA_DESCRIPTIONS[schema.templateKey];

          return (
            <div
              key={schema.filename}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">{schema.templateName}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{schema.filename}</p>
                </div>
                <span className="text-xs text-gray-600">{schema.rawLines} lines</span>
              </div>

              {/* Description card */}
              {desc && (
                <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 space-y-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{desc.description}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <p className="text-xs text-gray-500">
                      <span className="text-gray-400 font-medium">Example: </span>
                      <span className="italic">{desc.example}</span>
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Key fields</p>
                    <ul className="space-y-1">
                      {desc.keyFields.map((kf) => {
                        const dashIdx = kf.indexOf(" — ");
                        const fieldName = dashIdx !== -1 ? kf.slice(0, dashIdx) : kf;
                        const fieldDesc = dashIdx !== -1 ? kf.slice(dashIdx + 3) : "";
                        return (
                          <li key={kf} className="text-xs text-gray-500 flex gap-1">
                            <span className="font-mono text-indigo-400 shrink-0">{fieldName}</span>
                            {fieldDesc && <span>— {fieldDesc}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

              {/* Fields table */}
              {schema.fields.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Field
                        </th>
                        <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Constraints
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schema.fields.map((field, i) => (
                        <tr
                          key={field.name}
                          className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}
                        >
                          <td className="px-6 py-2 font-mono text-xs text-indigo-300">
                            {field.name}
                          </td>
                          <td className="px-6 py-2 text-xs text-gray-300">{field.type}</td>
                          <td className="px-6 py-2 text-xs text-gray-500">
                            {field.constraints.length > 0
                              ? field.constraints.join(", ")
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-6 py-4 text-sm text-gray-600">
                  No top-level fields detected — view the file directly for full schema.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
