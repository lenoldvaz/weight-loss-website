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

interface KeywordData {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  traffic_potential: number;
}

type KeywordMap = Record<string, KeywordData>;

type SortKey = "traffic_potential" | "volume" | "cpc" | "kd" | "none";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "generated" | "pending";

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

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function fmtCpc(n: number | undefined): string {
  if (n === undefined || n === null || n === 0) return "—";
  return `$${n.toFixed(2)}`;
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
  kwData,
  onGenerate,
}: {
  slug: string;
  template: string;
  rowState: RowState;
  kwData: KeywordData | undefined;
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

      {/* Traffic potential */}
      <td className="px-5 py-2.5 tabular-nums">
        {kwData ? (
          <span className={`text-xs font-medium ${kwData.traffic_potential >= 500 ? "text-emerald-400" : kwData.traffic_potential >= 100 ? "text-yellow-400" : "text-gray-500"}`}>
            {fmt(kwData.traffic_potential)}
          </span>
        ) : (
          <span className="text-xs text-gray-700">—</span>
        )}
      </td>

      {/* Volume */}
      <td className="px-5 py-2.5 tabular-nums">
        <span className="text-xs text-gray-400">{kwData ? fmt(kwData.volume) : "—"}</span>
      </td>

      {/* CPC */}
      <td className="px-5 py-2.5 tabular-nums">
        <span className="text-xs text-gray-400">{kwData ? fmtCpc(kwData.cpc) : "—"}</span>
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
  keywordMap,
  sortKey,
  sortDir,
  statusFilter,
  minVolume,
  onGenerate,
}: {
  template: string;
  slugs: string[];
  slugStates: SlugStateMap;
  keywordMap: KeywordMap;
  sortKey: SortKey;
  sortDir: SortDir;
  statusFilter: StatusFilter;
  minVolume: number;
  onGenerate: (template: string, slug: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const generatedCount = slugs.filter((s) => slugStates[s]?.generated).length;
  const label = templateLabel(template);

  // Filter
  let filtered = slugs.filter((slug) => {
    const state = slugStates[slug];
    if (statusFilter === "generated" && !state?.generated) return false;
    if (statusFilter === "pending" && state?.generated) return false;
    const kw = keywordMap[slug];
    if (minVolume > 0 && (!kw || kw.volume < minVolume)) return false;
    return true;
  });

  // Sort
  if (sortKey !== "none") {
    filtered = [...filtered].sort((a, b) => {
      const ka = keywordMap[a];
      const kb = keywordMap[b];
      const va = ka?.[sortKey] ?? -1;
      const vb = kb?.[sortKey] ?? -1;
      return sortDir === "desc" ? vb - va : va - vb;
    });
  }

  if (filtered.length === 0) return null;

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
          {filtered.length !== slugs.length && (
            <span className="text-xs text-gray-600">({filtered.length} shown)</span>
          )}
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
                  Traffic
                </th>
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Volume
                </th>
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  CPC
                </th>
                <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((slug) => (
                <SlugRow
                  key={slug}
                  slug={slug}
                  template={template}
                  rowState={slugStates[slug] ?? { generated: false, generateStatus: "idle", errorMessage: "" }}
                  kwData={keywordMap[slug]}
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

// ─── Sort/Filter bar ──────────────────────────────────────────────────────────

function SortFilterBar({
  sortKey,
  sortDir,
  statusFilter,
  minVolume,
  onSortChange,
  onStatusChange,
  onMinVolumeChange,
  onHighValue,
  onClearFilters,
  keywordRefreshing,
  onRefreshKeywords,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  statusFilter: StatusFilter;
  minVolume: number;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  onStatusChange: (s: StatusFilter) => void;
  onMinVolumeChange: (n: number) => void;
  onHighValue: () => void;
  onClearFilters: () => void;
  keywordRefreshing: boolean;
  onRefreshKeywords: () => void;
}) {
  const sortOptions: { label: string; key: SortKey; dir: SortDir }[] = [
    { label: "Traffic ↓", key: "traffic_potential", dir: "desc" },
    { label: "Traffic ↑", key: "traffic_potential", dir: "asc" },
    { label: "Volume ↓", key: "volume", dir: "desc" },
    { label: "CPC ↓", key: "cpc", dir: "desc" },
    { label: "KD ↑", key: "kd", dir: "asc" },
    { label: "Default", key: "none", dir: "desc" },
  ];

  const activeSort = sortOptions.find((o) => o.key === sortKey && o.dir === sortDir);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Sort</span>
        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split(":") as [SortKey, SortDir];
            onSortChange(k, d);
          }}
          className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1"
        >
          {sortOptions.map((o) => (
            <option key={`${o.key}:${o.dir}`} value={`${o.key}:${o.dir}`}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-4 bg-gray-700" />

      {/* Status filter */}
      <div className="flex items-center gap-1">
        {(["all", "generated", "pending"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              statusFilter === s
                ? "bg-indigo-700 text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-gray-700" />

      {/* Min volume */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Min vol</span>
        <select
          value={minVolume}
          onChange={(e) => onMinVolumeChange(Number(e.target.value))}
          className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-1"
        >
          <option value={0}>Any</option>
          <option value={100}>100+</option>
          <option value={500}>500+</option>
          <option value={1000}>1,000+</option>
          <option value={5000}>5,000+</option>
        </select>
      </div>

      <div className="w-px h-4 bg-gray-700" />

      {/* Quick filters */}
      <button
        onClick={onHighValue}
        className="text-xs px-2.5 py-1 rounded bg-emerald-900 border border-emerald-700 text-emerald-300 hover:bg-emerald-800 transition-colors"
      >
        High value
      </button>
      <button
        onClick={onClearFilters}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        Clear
      </button>

      <div className="flex-1" />

      {/* Refresh keyword data */}
      <button
        onClick={onRefreshKeywords}
        disabled={keywordRefreshing}
        className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors disabled:opacity-40"
      >
        {keywordRefreshing ? "Refreshing…" : "Refresh keyword data"}
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [templateStates, setTemplateStates] = useState<TemplateStateMap>(() => {
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
  const [keywordMap, setKeywordMap] = useState<KeywordMap>({});
  const [keywordRefreshing, setKeywordRefreshing] = useState(false);

  // Sort/filter state
  const [sortKey, setSortKey] = useState<SortKey>("traffic_potential");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [minVolume, setMinVolume] = useState(0);

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
                next[template][slug] = { ...next[template][slug], generated: true };
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

  // Load keyword data on mount
  useEffect(() => {
    async function loadKeywords() {
      try {
        const res = await fetch("/api/admin/keywords");
        if (!res.ok) return;
        const data = (await res.json()) as KeywordMap;
        setKeywordMap(data);
      } catch {
        // keyword data optional
      }
    }
    void loadKeywords();
  }, []);

  const handleRefreshKeywords = useCallback(async () => {
    setKeywordRefreshing(true);
    try {
      await fetch("/api/admin/keywords", { method: "POST" });
      // Poll for updated data after a delay
      setTimeout(async () => {
        try {
          const res = await fetch("/api/admin/keywords");
          if (res.ok) {
            const data = (await res.json()) as KeywordMap;
            setKeywordMap(data);
          }
        } finally {
          setKeywordRefreshing(false);
        }
      }, 5000);
    } catch {
      setKeywordRefreshing(false);
    }
  }, []);

  const handleGenerate = useCallback(async (template: string, slug: string) => {
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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-white">Content Browser</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        {statusLoaded ? (
          <>
            {totalGenerated} / {totalSeeds} pages generated across {templates.length} templates
          </>
        ) : (
          "Loading status…"
        )}
      </p>

      <SortFilterBar
        sortKey={sortKey}
        sortDir={sortDir}
        statusFilter={statusFilter}
        minVolume={minVolume}
        onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        onStatusChange={setStatusFilter}
        onMinVolumeChange={setMinVolume}
        onHighValue={() => {
          setSortKey("traffic_potential");
          setSortDir("desc");
          setMinVolume(100);
          setStatusFilter("all");
        }}
        onClearFilters={() => {
          setSortKey("traffic_potential");
          setSortDir("desc");
          setStatusFilter("all");
          setMinVolume(0);
        }}
        keywordRefreshing={keywordRefreshing}
        onRefreshKeywords={handleRefreshKeywords}
      />

      <div className="space-y-6">
        {templates.map((template) => (
          <TemplateSection
            key={template}
            template={template}
            slugs={SEED_SLUGS[template]}
            slugStates={templateStates[template] ?? {}}
            keywordMap={keywordMap}
            sortKey={sortKey}
            sortDir={sortDir}
            statusFilter={statusFilter}
            minVolume={minVolume}
            onGenerate={handleGenerate}
          />
        ))}
      </div>
    </div>
  );
}
