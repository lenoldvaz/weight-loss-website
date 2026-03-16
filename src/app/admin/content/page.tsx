import fs from "fs";
import path from "path";
import Link from "next/link";

interface TemplateGroup {
  template: string;
  slugs: string[];
}

function getContentGroups(): TemplateGroup[] {
  const contentDir = path.join(process.cwd(), "src/data/content");

  let templates: string[] = [];
  try {
    templates = fs
      .readdirSync(contentDir)
      .filter((f) => fs.statSync(path.join(contentDir, f)).isDirectory());
  } catch {
    return [];
  }

  return templates.map((template) => {
    const templateDir = path.join(contentDir, template);
    const slugs = fs
      .readdirSync(templateDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
      .sort();

    return { template, slugs };
  });
}

function templateToRoutePrefix(template: string): string {
  // Map template directory names to live URL path segments
  // e.g. "how-to" → "/how-to", "location-service" → "/", "product-review" → "/reviews"
  const map: Record<string, string> = {
    "how-to": "/how-to",
    "location-service": "",
    "product-review": "/reviews",
  };
  return map[template] ?? `/${template}`;
}

export default function ContentPage() {
  const groups = getContentGroups();
  const total = groups.reduce((sum, g) => sum + g.slugs.length, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Content Browser</h1>
      <p className="text-gray-400 text-sm mb-8">
        {total} generated pages across {groups.length} templates
      </p>

      <div className="space-y-6">
        {groups.map((group) => (
          <ContentGroup key={group.template} group={group} />
        ))}

        {groups.length === 0 && (
          <div className="text-gray-500 text-sm bg-gray-900 border border-gray-800 rounded-lg p-6">
            No content pages found in <code className="font-mono text-gray-400">src/data/content/</code>.
            Run the generation scripts to produce pages.
          </div>
        )}
      </div>
    </div>
  );
}

function ContentGroup({ group }: { group: TemplateGroup }) {
  const prefix = templateToRoutePrefix(group.template);
  const templateLabel = group.template
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <details className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group" open>
      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-850 list-none">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-white">{templateLabel}</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            {group.slugs.length} pages
          </span>
        </div>
        <span className="text-gray-600 text-xs select-none">▼</span>
      </summary>

      <div className="border-t border-gray-800">
        {group.slugs.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {group.slugs.map((slug) => {
              const livePath = `${prefix}/${slug}`;
              const liveUrl = `https://weight-loss.ca${livePath}`;
              const editorUrl = `/admin/content/${group.template}/${slug}`;
              return (
                <li key={slug} className="flex items-center justify-between px-6 py-2.5 hover:bg-gray-950">
                  <Link
                    href={editorUrl}
                    className="font-mono text-xs text-gray-300 hover:text-indigo-300 transition-colors flex-1 mr-4 truncate"
                  >
                    {slug}
                  </Link>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                  >
                    ↗ Live
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-6 py-4 text-sm text-gray-600">No pages generated yet.</p>
        )}
      </div>
    </details>
  );
}
