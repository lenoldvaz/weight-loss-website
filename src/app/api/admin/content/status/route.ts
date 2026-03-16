import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SEED_SLUGS } from "../seeds-manifest";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "authenticated";
}

/**
 * GET /api/admin/content/status
 *
 * Returns a map of { [template]: string[] } listing all generated slugs
 * for every template that has a seed manifest entry.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentBase = path.join(process.cwd(), "src/data/content");
  const result: Record<string, string[]> = {};

  for (const template of Object.keys(SEED_SLUGS)) {
    const templateDir = path.join(contentBase, template);
    let generatedSlugs: string[] = [];

    try {
      if (fs.existsSync(templateDir)) {
        generatedSlugs = fs
          .readdirSync(templateDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(".json", ""));
      }
    } catch {
      generatedSlugs = [];
    }

    result[template] = generatedSlugs;
  }

  return NextResponse.json(result);
}
