import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import https from "https";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

function getContentPath(template: string, slug: string): string {
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  return path.join(process.cwd(), "src/data/content", safeTemplate, `${safeSlug}.json`);
}

function getImagePath(template: string, slug: string): string {
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  return path.join(process.cwd(), "public/images/content", safeTemplate, `${safeSlug}.jpg`);
}

function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? null;
}

function buildImagePrompt(seed: Record<string, unknown>, template: string): string {
  switch (template) {
    case "location-service":
      return (
        `Weight loss clinic interior in ${seed.city ?? "Canada"}, modern Canadian medical office, ` +
        `professional healthcare setting, clean white walls, natural light, consultation room, ` +
        `welcoming atmosphere, ${seed.service_type ?? "weight loss"} facility. ` +
        `No text, no words, photorealistic`
      );
    case "location-product":
      return (
        `Canadian pharmacy interior in ${seed.city ?? "Canada"}, ${seed.product_category ?? "health"} products on shelves, ` +
        `clean retail health store, bright lighting, organized display, professional setting. ` +
        `No text, no words, photorealistic`
      );
    case "product-review":
      return (
        `${seed.product_name ?? "health product"} ${seed.product_type ?? ""} by ${seed.brand ?? ""}, ` +
        `product photography, clean white background, professional studio lighting, ` +
        `health supplement or wellness product, minimalist composition. ` +
        `No text, no words, photorealistic`
      );
    case "comparison":
      return (
        `Split comparison concept for ${seed.option_a ?? "option A"} versus ${seed.option_b ?? "option B"}, ` +
        `clean minimal health and wellness visual, two-panel layout concept, ` +
        `${seed.comparison_type ?? "health"} theme, professional photography, neutral background. ` +
        `No text, no words, photorealistic`
      );
    case "how-to":
      return (
        `Lifestyle fitness photography showing person ${seed.topic ?? "exercising"}, ` +
        `healthy Canadian lifestyle, natural daylight, ${seed.goal ?? "weight loss"} concept, ` +
        `motivational health and wellness scene, diverse person, active and positive. ` +
        `No text, no words, photorealistic`
      );
    case "demographic-topic":
      return (
        `${seed.demographic ?? "person"} engaged in healthy weight loss lifestyle, ` +
        `Canadian health and wellness, diverse representation, positive and empowering, ` +
        `natural setting, ${seed.topic ?? "wellness"} theme, warm natural light. ` +
        `No text, no words, photorealistic`
      );
    case "condition-topic":
      return (
        `Calm and professional medical health imagery representing ${seed.condition_full ?? "health condition"}, ` +
        `Canadian healthcare setting, doctor consultation or wellness scene, ` +
        `hopeful and professional atmosphere, clean clinical environment. ` +
        `No text, no words, photorealistic`
      );
    case "best-list":
      return (
        `Flat lay collection of best ${seed.category ?? "health"} products for weight loss, ` +
        `${seed.qualifier ?? ""} selection, clean white surface, organized arrangement, ` +
        `health and wellness items, professional product photography, overhead shot. ` +
        `No text, no words, photorealistic`
      );
    case "trending-article":
      return (
        `Editorial news photography style for ${seed.topic ?? "health trend"}, ` +
        `current health trend visual, Canadian wellness lifestyle, ` +
        `${seed.trending_hook ?? ""} concept, professional journalism style, clean composition. ` +
        `No text, no words, photorealistic`
      );
    default:
      return (
        `Canadian health and wellness lifestyle photography, weight loss journey, ` +
        `positive and empowering, natural daylight, professional photography. ` +
        `No text, no words, photorealistic`
      );
  }
}

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

function buildAltText(template: string, slug: string): string {
  const readable = slug.replace(/-/g, " ");
  switch (template) {
    case "location-service": return `Hero image for ${readable} — weight loss clinic`;
    case "location-product": return `Hero image for ${readable} — weight loss products`;
    case "product-review": return `Product photo for ${readable}`;
    case "comparison": return `Comparison hero image for ${readable}`;
    case "how-to": return `Lifestyle photo for ${readable}`;
    case "demographic-topic": return `Wellness lifestyle photo for ${readable}`;
    case "condition-topic": return `Health imagery for ${readable}`;
    case "best-list": return `Product collection for ${readable}`;
    case "trending-article": return `Editorial image for ${readable}`;
    default: return `Hero image for ${readable}`;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { template, slug } = await params;
  const contentPath = getContentPath(template, slug);

  let record: Record<string, unknown>;
  try {
    const raw = await fs.readFile(contentPath, "utf-8");
    record = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }

  const seed = (record.seed ?? {}) as Record<string, unknown>;
  const prompt = buildImagePrompt(seed, template);

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      responseMimeType: "image/jpeg",
    },
  });

  let base64Data: string;
  let mimeType: string;

  try {
    const raw = await httpsPost(url, requestBody);
    const response: GeminiResponse = JSON.parse(raw) as GeminiResponse;

    if (response.error) {
      return NextResponse.json(
        { error: `Gemini API error: ${response.error.message}` },
        { status: 502 }
      );
    }

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: "No image returned from Gemini" }, { status: 502 });
    }

    const parts = candidates[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData != null);

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: "No image data in Gemini response" }, { status: 502 });
    }

    base64Data = imagePart.inlineData.data;
    mimeType = imagePart.inlineData.mimeType;
  } catch (err) {
    return NextResponse.json(
      { error: `Image generation failed: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  // Save image to disk
  const imagePath = getImagePath(template, slug);
  const imageDir = path.dirname(imagePath);
  try {
    fsSync.mkdirSync(imageDir, { recursive: true });
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(imagePath, buffer);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to save image: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const publicPath = `/images/content/${safeTemplate}/${safeSlug}.${ext}`;
  const altText = buildAltText(template, slug);

  // Update the content JSON hero_image field
  try {
    const content = (record.content ?? {}) as Record<string, unknown>;
    content.hero_image = {
      path: publicPath,
      alt: altText,
      prompt,
    };
    record.content = content;
    await fs.writeFile(contentPath, JSON.stringify(record, null, 2) + "\n", "utf-8");
  } catch (err) {
    return NextResponse.json(
      { error: `Image saved but failed to update content JSON: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: publicPath, alt: altText, prompt });
}
