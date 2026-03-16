import fs from "fs";
import path from "path";
import https from "https";
import type { AnySeed } from "./types.js";

const IMAGES_BASE = path.resolve(process.cwd(), "public/images/content");
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

// ─── API key resolution ───────────────────────────────────────────────────────

function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? null;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildImagePrompt(seed: AnySeed): string {
  switch (seed.template) {
    case "location-service":
      return (
        `Weight loss clinic interior in ${seed.city}, modern Canadian medical office, ` +
        `professional healthcare setting, clean white walls, natural light, consultation room, ` +
        `welcoming atmosphere, ${seed.service_type} facility. ` +
        `No text, no words, photorealistic`
      );

    case "location-product":
      return (
        `Canadian pharmacy interior in ${seed.city}, ${seed.product_category} products on shelves, ` +
        `clean retail health store, bright lighting, organized display, professional setting. ` +
        `No text, no words, photorealistic`
      );

    case "product-review":
      return (
        `${seed.product_name} ${seed.product_type} by ${seed.brand}, ` +
        `product photography, clean white background, professional studio lighting, ` +
        `health supplement or wellness product, minimalist composition. ` +
        `No text, no words, photorealistic`
      );

    case "comparison":
      return (
        `Split comparison concept for ${seed.option_a} versus ${seed.option_b}, ` +
        `clean minimal health and wellness visual, two-panel layout concept, ` +
        `${seed.comparison_type} theme, professional photography, neutral background. ` +
        `No text, no words, photorealistic`
      );

    case "how-to":
      return (
        `Lifestyle fitness photography showing person ${seed.topic}, ` +
        `healthy Canadian lifestyle, natural daylight, ${seed.goal} concept, ` +
        `motivational health and wellness scene, diverse person, active and positive. ` +
        `No text, no words, photorealistic`
      );

    case "demographic-topic":
      return (
        `${seed.demographic} person engaged in healthy weight loss lifestyle, ` +
        `Canadian health and wellness, diverse representation, positive and empowering, ` +
        `natural setting, ${seed.topic} theme, warm natural light. ` +
        `No text, no words, photorealistic`
      );

    case "condition-topic":
      return (
        `Calm and professional medical health imagery representing ${seed.condition_full}, ` +
        `Canadian healthcare setting, doctor consultation or wellness scene, ` +
        `hopeful and professional atmosphere, clean clinical environment. ` +
        `No text, no words, photorealistic`
      );

    case "best-list":
      return (
        `Flat lay collection of best ${seed.category} products for weight loss, ` +
        `${seed.qualifier} selection, clean white surface, organized arrangement, ` +
        `health and wellness items, professional product photography, overhead shot. ` +
        `No text, no words, photorealistic`
      );

    case "trending-article":
      return (
        `Editorial news photography style for ${seed.topic}, ` +
        `current health trend visual, Canadian wellness lifestyle, ` +
        `${seed.trending_hook} concept, professional journalism style, clean composition. ` +
        `No text, no words, photorealistic`
      );

    default: {
      const _exhaustive: never = seed;
      throw new Error(`Unknown template: ${(_exhaustive as AnySeed).template}`);
    }
  }
}

// ─── Gemini API call ──────────────────────────────────────────────────────────

interface GeminiInlineData {
  data: string;
  mimeType: string;
}

interface GeminiPart {
  inlineData?: GeminiInlineData;
  text?: string;
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message: string };
}

function httpsPost(url: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function generateImage(
  seed: AnySeed
): Promise<{ base64: string; mimeType: string } | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn(
      "    [image] No GEMINI_API_KEY or GOOGLE_AI_API_KEY found — skipping image generation"
    );
    return null;
  }

  const prompt = buildImagePrompt(seed);
  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      responseMimeType: "image/jpeg",
    },
  });

  try {
    const raw = await httpsPost(url, requestBody);
    const response: GeminiResponse = JSON.parse(raw) as GeminiResponse;

    if (response.error) {
      console.warn(`    [image] Gemini API error: ${response.error.message}`);
      return null;
    }

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      console.warn("    [image] No candidates returned from Gemini");
      return null;
    }

    const parts = candidates[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData != null);

    if (!imagePart?.inlineData) {
      console.warn("    [image] No image data in Gemini response");
      return null;
    }

    return {
      base64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    };
  } catch (err) {
    console.warn(`    [image] Failed to generate image: ${(err as Error).message}`);
    return null;
  }
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

export function imageExists(template: string, slug: string): boolean {
  const filePath = path.join(IMAGES_BASE, template, `${slug}.jpg`);
  return fs.existsSync(filePath);
}

export async function saveImage(
  template: string,
  slug: string,
  base64: string,
  mimeType: string
): Promise<string> {
  const dir = path.join(IMAGES_BASE, template);
  fs.mkdirSync(dir, { recursive: true });

  const buffer = Buffer.from(base64, "base64");
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const fileName = `${slug}.${ext}`;
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/images/content/${template}/${fileName}`;
}
