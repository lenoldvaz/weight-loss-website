import fs from "fs";
import path from "path";
import Link from "next/link";

function countContentPages(): number {
  const contentDir = path.join(process.cwd(), "src/data/content");
  let total = 0;
  try {
    const templates = fs.readdirSync(contentDir);
    for (const template of templates) {
      const templatePath = path.join(contentDir, template);
      if (fs.statSync(templatePath).isDirectory()) {
        const files = fs.readdirSync(templatePath).filter((f) => f.endsWith(".json"));
        total += files.length;
      }
    }
  } catch {
    // directory may not exist yet
  }
  return total;
}

function countTaxonomyFiles(): number {
  const taxonomyDir = path.join(process.cwd(), "src/data/taxonomy");
  try {
    return fs.readdirSync(taxonomyDir).filter((f) => f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}

function countSeeds(): number {
  const taxonomyDir = path.join(process.cwd(), "src/data/taxonomy");
  let total = 0;
  try {
    const files = fs.readdirSync(taxonomyDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(taxonomyDir, file), "utf-8");
      const data: unknown = JSON.parse(raw);
      if (Array.isArray(data)) {
        total += data.length;
      } else if (data !== null && typeof data === "object") {
        const values = Object.values(data as Record<string, unknown>);
        for (const v of values) {
          if (Array.isArray(v)) total += v.length;
        }
      }
    }
  } catch {
    // ignore
  }
  return total;
}

interface StatCardProps {
  label: string;
  value: number | string;
  href: string;
}

function StatCard({ label, value, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-indigo-600 transition-colors"
    >
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-400">{label}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const taxonomyCount = countTaxonomyFiles();
  const contentCount = countContentPages();
  const seedCount = countSeeds();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Overview of weight-loss.ca content data</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Taxonomy Files" value={taxonomyCount} href="/admin/taxonomy" />
        <StatCard label="Content Pages Generated" value={contentCount} href="/admin/content" />
        <StatCard label="Total Seed Items" value={seedCount} href="/admin/taxonomy" />
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: "/admin/taxonomy", label: "Browse Taxonomy", desc: "View and edit all taxonomy JSON files" },
          { href: "/admin/schemas", label: "View Schemas", desc: "Inspect field definitions for all 9 templates" },
          { href: "/admin/content", label: "Browse Content", desc: "See all generated pages by template" },
          { href: "/admin/login", label: "Login Page", desc: "Test or re-authenticate" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-indigo-600 transition-colors"
          >
            <p className="text-sm font-medium text-white">{link.label}</p>
            <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
