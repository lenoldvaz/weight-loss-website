import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template, slug } = await params;
  const contentPath = getContentPath(template, slug);

  // Ensure content file exists
  try {
    await fs.access(contentPath);
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file field in form data" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only jpg and png files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 5MB limit" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const imagePath = getImagePath(template, slug);
  const imageDir = path.dirname(imagePath);

  try {
    fsSync.mkdirSync(imageDir, { recursive: true });
    await fs.writeFile(imagePath, buffer);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to save image: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  const publicPath = `/images/content/${safeTemplate}/${safeSlug}.jpg`;

  // Update the content JSON hero_image.path and hero_image.alt
  try {
    const raw = await fs.readFile(contentPath, "utf-8");
    const record = JSON.parse(raw) as Record<string, unknown>;
    const content = (record.content ?? {}) as Record<string, unknown>;
    const existingHeroImage = (content.hero_image ?? {}) as Record<string, unknown>;

    const readable = safeSlug.replace(/-/g, " ");
    const defaultAlt = `Hero image for ${readable}`;

    content.hero_image = {
      ...existingHeroImage,
      path: publicPath,
      alt: existingHeroImage.alt ?? defaultAlt,
    };
    record.content = content;
    await fs.writeFile(contentPath, JSON.stringify(record, null, 2) + "\n", "utf-8");
  } catch (err) {
    return NextResponse.json(
      { error: `Image saved but failed to update content JSON: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: publicPath });
}
