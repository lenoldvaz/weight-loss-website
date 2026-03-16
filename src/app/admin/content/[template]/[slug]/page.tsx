import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContentEditor from "./ContentEditor";
import type { ContentRecord } from "@/lib/content";

interface PageProps {
  params: Promise<{ template: string; slug: string }>;
}

function readContentRecord(template: string, slug: string): ContentRecord | null {
  const safeTemplate = path.basename(template);
  const safeSlug = path.basename(slug);
  const filePath = path.join(
    process.cwd(),
    "src/data/content",
    safeTemplate,
    `${safeSlug}.json`
  );

  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentRecord;
  } catch {
    return null;
  }
}

function templateLabel(template: string): string {
  return template
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ContentEditorPage({ params }: PageProps) {
  const { template, slug } = await params;
  const record = readContentRecord(template, slug);

  if (!record) {
    notFound();
  }

  return (
    <div className="p-8 min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-gray-900 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/content" className="hover:text-gray-900 transition-colors">
          Content
        </Link>
        <span>/</span>
        <Link
          href="/admin/content"
          className="hover:text-gray-900 transition-colors"
        >
          {templateLabel(template)}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium font-mono">{slug}</span>
      </nav>

      <ContentEditor record={record} template={template} slug={slug} />
    </div>
  );
}
