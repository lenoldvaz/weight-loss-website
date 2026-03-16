import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

function getContentPath(template: string, slug: string): string {
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  return path.join(process.cwd(), "src/data/content", safeTemplate, `${safeSlug}.json`);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template, slug } = await params;
  const filePath = getContentPath(template, slug);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ template: string; slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template, slug } = await params;
  const filePath = getContentPath(template, slug);

  // Ensure file exists before overwriting
  try {
    await fs.access(filePath);
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation: must be an object with required top-level keys
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (!record.template || !record.slug || !record.content) {
    return NextResponse.json(
      { error: "Body must include template, slug, and content fields" },
      { status: 400 }
    );
  }

  try {
    await fs.writeFile(filePath, JSON.stringify(body, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not write file" }, { status: 500 });
  }
}
