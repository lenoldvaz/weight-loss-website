import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import TaxonomyEditor from "./TaxonomyEditor";

interface Props {
  params: Promise<{ file: string }>;
}

export default async function TaxonomyFilePage({ params }: Props) {
  const { file } = await params;
  const filename = `${file}.json`;
  const filePath = path.join(process.cwd(), "src/data/taxonomy", filename);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return (
      <div className="p-8">
        <p className="text-red-400">Could not parse {filename} — invalid JSON.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/taxonomy" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Taxonomy
        </Link>
        <span className="text-gray-700">/</span>
        <h1 className="text-xl font-semibold text-white">{filename}</h1>
      </div>

      <TaxonomyEditor fileSlug={file} initialData={data} />
    </div>
  );
}
