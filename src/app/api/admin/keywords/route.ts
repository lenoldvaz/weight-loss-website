import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/seo/keyword-data.json");

function checkAuth(request: NextRequest) {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const raw = fs.existsSync(DATA_PATH) ? fs.readFileSync(DATA_PATH, "utf-8") : "{}";
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { spawn } = await import("child_process");
  spawn("npx", ["tsx", "scripts/seo/fetch-keyword-data.ts", "--refresh"], {
    detached: true,
    stdio: "ignore",
    cwd: process.cwd(),
  }).unref();
  return NextResponse.json({ ok: true, message: "Fetching keyword data in background. Refresh the page in 2–3 minutes." });
}
