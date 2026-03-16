import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

function getFilePath(file: string): string {
  // Prevent directory traversal
  const safe = path.basename(file);
  return path.join(process.cwd(), "src/data/taxonomy", `${safe}.json`);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { file } = await params;
  const filePath = getFilePath(file);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data: unknown = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Could not read file" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { file } = await params;
  const filePath = getFilePath(file);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not write file" }, { status: 500 });
  }
}
