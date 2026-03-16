"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SEED_SLUGS } from "@/app/api/admin/content/seeds-manifest";

// ─── Types ───────────────────────────────────────────────────────────────────

type GenerateStatus = "idle" | "loading" | "done" | "error";

interface RowState {
  generated: boolean;
  generateStatus: GenerateStatus;
  errorMessage: string;
}

type SlugStateMap = Record<string, RowState>;
type TemplateStateMap = Record<string, SlugStateMap>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function templateToRoutePrefix(template: string): string {
  const map: Record<string, string> = {
    "how-to": "/how-to",
    "location-service": "",
    "product-review": "/reviews",
  };
  return map[template] ?? `/${template}`;
}

function templateLabel(template: string): string {
  return template
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ generated, total }: { generated: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((generated / total) * 100);
  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
        {generated}/{total}
      </span>
    </div>
  );
}

// ─── Single row ───────────────────────────────────────────────────────────────

function SlugRow({
  slug,
  template,
  rowState,
  onGenerate,
}: {
  slug: string;
  template: string;
  rowState: RowState;
  onGenerate: (template: string, slug: string) => void;
}) {
  const prefix = templateToRoutePrefix(template);
  const liveUrl = `https://weight-loss.ca${prefix}/${slug}`;
  const editorUrl = `/admin/content/${template}/${slug}`;

  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-950 transition-colors">
      {/* Slug */}
      <td className="px-5 py-2.5">
        <span className="font-mono text-xs text-gray-300">{slug}</span>
      </td>

      {/* Status badge */}
      <td className="px-5 py-2.5">
        {rowState.generated ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Generated
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950 border border-amber-800 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Pending
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-2.5">
        <div className="flex items-center gap-3">
          {rowState.generated ? (
            <>
              <Link
                href={editorUrl}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Edit
              </Link>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                View Live ↗
              </a>
            </>
          ) : rowState.generateStatus === "loading" ? (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg
                className="animate-spin h-3.5 w-3.5 text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Generating…
            </span>
          ) : rowState.generateStatus === "error" ? (
            <span className="text-xs text-red-400 max-w-xs truncate" title={rowState.errorMessage}>
              {rowState.errorMessage}
            </span>
          ) : (
            <button
              onClick={() => onGenerate(template, slug)}
              className="text-xs text-indigo-400 border border-indigo-700 rounded px-2.5 py-1 hover:bg-indigo-950 transition-colors"
            >
              Generate
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Template section ──────────────────────────────────────────────────────────

function TemplateSection({
  template,
  slugs,
  slugStates,
  onGenerate,
}: {
  template: string;
  slugs: string[];
  slugStates: SlugStateMap;
  onGenerate: (template: string, slug: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const generatedCount = slugs.filter((s) => slugStates[s]?.generated).length;
  const label = templateLabel(template);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-850 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold text-white">{label}</span>
          <ProgressBar generated={generatedCount} total={slugs.length} />
        </div>
        <span className="text-gray-600 text-xs select-none">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {slugs.map((slug) => (
                <SlugRow
                  key={slug}
                  slug={slug}
                  template={template}
                  rowState={slugStates[slug] ?? { generated: false, generateStatus: "idle", errorMessage: "" }}
                  onGenerate={onGenerate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [templateStates, setTemplateStates] = useState<TemplateStateMap>(() => {
    // Initialise all rows as pending
    const initial: TemplateStateMap = {};
    for (const [template, slugs] of Object.entries(SEED_SLUGS)) {
      initial[template] = {};
      for (const slug of slugs) {
        initial[template][slug] = { generated: false, generateStatus: "idle", errorMessage: "" };
      }
    }
    return initial;
  });

  const [statusLoaded, setStatusLoaded] = useState(false);

  // Load generated status on mount
  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/admin/content/status");
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, string[]>;

        setTemplateStates((prev) => {
          const next = { ...prev };
          for (const [template, generatedSlugs] of Object.entries(data)) {
            if (!next[template]) continue;
            next[template] = { ...next[template] };
            for (const slug of generatedSlugs) {
              if (next[template][slug]) {
                next[template][slug] = {
                  ...next[template][slug],
                  generated: true,
                };
              }
            }
          }
          return next;
        });
      } finally {
        setStatusLoaded(true);
      }
    }
    void loadStatus();
  }, []);

  const handleGenerate = useCallback(async (template: string, slug: string) => {
    // Mark as loading
    setTemplateStates((prev) => ({
      ...prev,
      [template]: {
        ...prev[template],
        [slug]: { generated: false, generateStatus: "loading", errorMessage: "" },
      },
    }));

    try {
      const res = await fetch("/api/admin/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, slug }),
      });

      const body = (await res.json()) as { ok?: boolean; slug?: string; error?: string; alreadyExists?: boolean };

      if (res.ok && body.ok) {
        setTemplateStates((prev) => ({
          ...prev,
          [template]: {
            ...prev[template],
            [slug]: { generated: true, generateStatus: "done", errorMessage: "" },
          },
        }));
      } else {
        const msg = body.error ?? "Generation failed";
        setTemplateStates((prev) => ({
          ...prev,
          [template]: {
            ...prev[template],
            [slug]: { generated: false, generateStatus: "error", errorMessage: msg },
          },
        }));
      }
    } catch (err) {
      const msg = (err as Error).message ?? "Network error";
      setTemplateStates((prev) => ({
        ...prev,
        [template]: {
          ...prev[template],
          [slug]: { generated: false, generateStatus: "error", errorMessage: msg },
        },
      }));
    }
  }, []);

  const templates = Object.keys(SEED_SLUGS);
  const totalSeeds = templates.reduce((sum, t) => sum + SEED_SLUGS[t].length, 0);
  const totalGenerated = templates.reduce(
    (sum, t) =>
      sum + Object.values(templateStates[t] ?? {}).filter((s) => s.generated).length,
    0
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Content Browser</h1>
      <p className="text-gray-400 text-sm mb-8">
        {statusLoaded ? (
          <>
            {totalGenerated} / {totalSeeds} pages generated across {templates.length} templates
          </>
        ) : (
          "Loading status…"
        )}
      </p>

      <div className="space-y-6">
        {templates.map((template) => (
          <TemplateSection
            key={template}
            template={template}
            slugs={SEED_SLUGS[template]}
            slugStates={templateStates[template] ?? {}}
            onGenerate={handleGenerate}
          />
        ))}
      </div>
    </div>
  );
}
