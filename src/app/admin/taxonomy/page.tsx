import fs from "fs";
import path from "path";
import Link from "next/link";

interface TaxonomyFileMeta {
  filename: string;
  slug: string;
  itemCount: number;
}

function getTaxonomyFiles(): TaxonomyFileMeta[] {
  const taxonomyDir = path.join(process.cwd(), "src/data/taxonomy");
  const files = fs.readdirSync(taxonomyDir).filter((f) => f.endsWith(".json"));

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(taxonomyDir, filename), "utf-8");
    let itemCount = 0;
    try {
      const data: unknown = JSON.parse(raw);
      if (Array.isArray(data)) {
        itemCount = data.length;
      } else if (data !== null && typeof data === "object") {
        const values = Object.values(data as Record<string, unknown>);
        for (const v of values) {
          if (Array.isArray(v)) itemCount += v.length;
        }
      }
    } catch {
      itemCount = 0;
    }

    return {
      filename,
      slug: filename.replace(".json", ""),
      itemCount,
    };
  });
}

export default function TaxonomyPage() {
  const files = getTaxonomyFiles();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Taxonomy Browser</h1>
      <p className="text-gray-400 text-sm mb-8">
        {files.length} taxonomy files — click a file to view and edit items
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <Link
            key={file.slug}
            href={`/admin/taxonomy/${file.slug}`}
            className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-indigo-600 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-500 mt-1">{file.itemCount} items</p>
              </div>
              <span className="text-gray-600 group-hover:text-indigo-400 transition-colors text-lg leading-none">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
