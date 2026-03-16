"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ContentRecord } from "@/lib/content";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroImage {
  path: string;
  alt: string;
  prompt?: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "unsaved" | "error";
type RegenerateStatus = "idle" | "regenerating" | "done" | "error";

interface ContentEditorProps {
  record: ContentRecord;
  template: string;
  slug: string;
}

// ─── Character counter ────────────────────────────────────────────────────────

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color =
    len > max
      ? "text-red-500"
      : len > max * 0.85
      ? "text-amber-500"
      : "text-gray-400";
  return (
    <span className={`text-xs ${color} ml-2`}>
      {len}/{max}
    </span>
  );
}

// ─── Auto-resizing textarea ───────────────────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  className = "",
  placeholder,
  minRows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent overflow-hidden ${className}`}
    />
  );
}

// ─── String array editor ──────────────────────────────────────────────────────

function StringArrayEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  function moveUp(i: number) {
    if (i === 0) return;
    const updated = [...items];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    onChange(updated);
  }

  function moveDown(i: number) {
    if (i === items.length - 1) return;
    const updated = [...items];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    onChange(updated);
  }

  function handleEdit(i: number, value: string) {
    const updated = [...items];
    updated[i] = value;
    onChange(updated);
  }

  function handleDelete(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function handleAdd() {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5 items-start">
          <div className="flex flex-col gap-0.5 mt-1">
            <button
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none px-0.5"
              title="Move up"
            >
              ▲
            </button>
            <button
              onClick={() => moveDown(i)}
              disabled={i === items.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none px-0.5"
              title="Move down"
            >
              ▼
            </button>
          </div>
          <AutoTextarea
            value={item}
            onChange={(v) => handleEdit(i, v)}
            minRows={1}
            className="flex-1"
          />
          <button
            onClick={() => handleDelete(i)}
            className="mt-1 px-2 py-1 text-xs text-red-500 border border-gray-200 rounded hover:bg-red-50 hover:border-red-300 transition-colors flex-shrink-0"
          >
            Del
          </button>
        </div>
      ))}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add item…"
          className="flex-1 bg-gray-50 border border-dashed border-gray-300 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 text-xs text-indigo-600 border border-indigo-300 rounded hover:bg-indigo-50 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Object card editor ───────────────────────────────────────────────────────

function ObjectCardEditor({
  item,
  onChange,
  onDelete,
}: {
  item: Record<string, unknown>;
  onChange: (item: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const preview =
    (item["name"] as string) ||
    (item["question"] as string) ||
    (item["title"] as string) ||
    (item["slug"] as string) ||
    "Item";

  function updateField(key: string, value: unknown) {
    onChange({ ...item, [key]: value });
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="text-sm text-gray-800 font-medium truncate pr-4">{preview}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
          <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3 bg-white border-t border-gray-100">
          {Object.entries(item).map(([key, value]) => {
            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-xs font-medium text-gray-500 w-40 flex-shrink-0">
                    {key}
                  </label>
                  <button
                    onClick={() => updateField(key, !value)}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
                      value ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 mt-0.5 ml-0.5 rounded-full bg-white transition-transform ${
                        value ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-gray-500">{value ? "true" : "false"}</span>
                </div>
              );
            }

            if (typeof value === "string") {
              return (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{key}</label>
                  <AutoTextarea
                    value={value}
                    onChange={(v) => updateField(key, v)}
                    minRows={1}
                  />
                </div>
              );
            }

            if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
              return (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{key}</label>
                  <StringArrayEditor
                    items={value as string[]}
                    onChange={(updated) => updateField(key, updated)}
                  />
                </div>
              );
            }

            // Fallback: JSON textarea
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{key}</label>
                <JsonFieldEditor
                  value={value}
                  onChange={(v) => updateField(key, v)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Object array editor ──────────────────────────────────────────────────────

function ObjectArrayEditor({
  items,
  onChange,
}: {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
}) {
  function handleUpdate(i: number, updated: Record<string, unknown>) {
    const next = [...items];
    next[i] = updated;
    onChange(next);
  }

  function handleDelete(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function handleAdd() {
    // Clone first item structure as blank template
    const template =
      items.length > 0
        ? Object.fromEntries(
            Object.entries(items[0]).map(([k, v]) => [
              k,
              typeof v === "boolean"
                ? false
                : Array.isArray(v)
                ? []
                : typeof v === "number"
                ? 0
                : "",
            ])
          )
        : {};
    onChange([...items, template]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <ObjectCardEditor
          key={i}
          item={item}
          onChange={(updated) => handleUpdate(i, updated)}
          onDelete={() => handleDelete(i)}
        />
      ))}
      <button
        onClick={handleAdd}
        className="w-full mt-2 text-xs text-indigo-600 border border-dashed border-indigo-300 rounded px-4 py-2 hover:bg-indigo-50 transition-colors"
      >
        + Add item
      </button>
    </div>
  );
}

// ─── JSON field editor (fallback for deeply nested objects) ───────────────────

function JsonFieldEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [draft, setDraft] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  function handleChange(text: string) {
    setDraft(text);
    try {
      const parsed = JSON.parse(text);
      setError("");
      onChange(parsed);
    } catch {
      setError("Invalid JSON");
    }
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        rows={Math.min(15, draft.split("\n").length + 2)}
        className={`w-full bg-gray-50 border text-gray-900 font-mono text-xs rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Field section ────────────────────────────────────────────────────────────

function FieldSection({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const isString = typeof value === "string";
  const isStringArray =
    Array.isArray(value) && value.every((v) => typeof v === "string");
  const isObjectArray =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => v !== null && typeof v === "object" && !Array.isArray(v));
  const isArray = Array.isArray(value);

  const [isOpen, setIsOpen] = useState(true);

  if (isString) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {fieldKey.replace(/_/g, " ")}
        </label>
        <AutoTextarea
          value={value as string}
          onChange={(v) => onChange(v)}
          minRows={2}
        />
      </div>
    );
  }

  // Expandable array/object sections
  const label = fieldKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const count = isArray ? (value as unknown[]).length : null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          {count !== null && (
            <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-100">
          {isStringArray ? (
            <StringArrayEditor
              items={value as string[]}
              onChange={(updated) => onChange(updated)}
            />
          ) : isObjectArray ? (
            <ObjectArrayEditor
              items={value as Record<string, unknown>[]}
              onChange={(updated) => onChange(updated)}
            />
          ) : (
            <JsonFieldEditor value={value} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── SEO meta panel ───────────────────────────────────────────────────────────

function SeoMetaPanel({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (key: string, value: string) => void;
}) {
  const pageTitle = (content["page_title"] as string) ?? "";
  const metaDesc = (content["meta_description"] as string) ?? "";
  const h1 = (content["h1"] as string) ?? "";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">SEO Meta</h3>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">Page Title</label>
          <CharCounter value={pageTitle} max={65} />
        </div>
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => onChange("page_title", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">Meta Description</label>
          <CharCounter value={metaDesc} max={160} />
        </div>
        <textarea
          value={metaDesc}
          onChange={(e) => onChange("meta_description", e.target.value)}
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">H1</label>
          <CharCounter value={h1} max={70} />
        </div>
        <input
          type="text"
          value={h1}
          onChange={(e) => onChange("h1", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}

// ─── Hero image panel ─────────────────────────────────────────────────────────

function HeroImagePanel({
  heroImage,
  template,
  slug,
  onImageUpdate,
}: {
  heroImage: HeroImage | null;
  template: string;
  slug: string;
  onImageUpdate: (img: HeroImage) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [altText, setAltText] = useState(heroImage?.alt ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep altText in sync if heroImage changes from parent
  useEffect(() => {
    setAltText(heroImage?.alt ?? "");
  }, [heroImage?.alt]);

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/content/${template}/${slug}/generate-image`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Generation failed");
      }
      const data = await res.json() as { path: string; alt: string; prompt: string };
      onImageUpdate({ path: data.path, alt: data.alt, prompt: data.prompt });
      setAltText(data.alt);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `/api/admin/content/${template}/${slug}/upload-image`,
        { method: "POST", body: formData }
      );
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Upload failed");
      }
      const data = await res.json() as { path: string };
      onImageUpdate({
        path: data.path,
        alt: altText || heroImage?.alt || "",
        prompt: heroImage?.prompt,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  }

  const imageUrl = heroImage?.path
    ? `${heroImage.path}?t=${Date.now()}`
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Hero Image</h3>

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={heroImage?.alt ?? ""}
          className="w-full rounded-lg object-cover aspect-video border border-gray-100"
        />
      ) : (
        <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <span className="text-sm text-gray-400">No image yet</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || isUploading}
          className="flex-1 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-300 rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "Generating…" : "Generate Image"}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isGenerating || isUploading}
          className="flex-1 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? "Uploading…" : "Upload Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Alt text</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value);
            if (heroImage) {
              onImageUpdate({ ...heroImage, alt: e.target.value });
            }
          }}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Descriptive alt text…"
        />
      </div>

      {heroImage?.prompt && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Image prompt (read-only)
          </label>
          <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded p-2 leading-relaxed">
            {heroImage.prompt}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page info panel ──────────────────────────────────────────────────────────

function PageInfoPanel({
  template,
  slug,
  generatedAt,
  content,
}: {
  template: string;
  slug: string;
  generatedAt: string;
  content: Record<string, unknown>;
}) {
  const templateLabel = template
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const wordCount = JSON.stringify(content)
    .replace(/"[^"]*":/g, "") // remove keys
    .replace(/[{}[\]",]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const generatedDate = new Date(generatedAt).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Page Info</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">Template</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            {templateLabel}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">Slug</span>
          <span className="text-xs font-mono text-gray-700 truncate max-w-[140px]" title={slug}>
            {slug}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">Generated</span>
          <span className="text-xs text-gray-600">{generatedDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">~Word count</span>
          <span className="text-xs text-gray-600">{wordCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

// Fields to skip from the main content editor (handled by SEO panel or hero image panel)
const SEO_FIELDS = new Set(["page_title", "meta_description", "h1"]);
const SKIP_FIELDS = new Set(["hero_image"]);

export default function ContentEditor({ record, template, slug }: ContentEditorProps) {
  const [content, setContent] = useState<Record<string, unknown>>(
    record.content as Record<string, unknown>
  );
  const [titleDraft, setTitleDraft] = useState(
    ((record.content as Record<string, unknown>)["h1"] as string) ??
      ((record.content as Record<string, unknown>)["page_title"] as string) ??
      slug
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [regenStatus, setRegenStatus] = useState<RegenerateStatus>("idle");
  const [regenError, setRegenError] = useState("");
  const [generatedAt, setGeneratedAt] = useState(record.generated_at);

  const heroImage = (content["hero_image"] as HeroImage | undefined) ?? null;

  const liveUrl = `https://weight-loss.ca/${slug}`;

  // Track unsaved changes
  const isDirty = useRef(false);

  function updateContent(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("unsaved");
    isDirty.current = true;
  }

  function updateSeoField(key: string, value: string) {
    updateContent(key, value);
    if (key === "h1") setTitleDraft(value);
    if (key === "page_title" && !content["h1"]) setTitleDraft(value);
  }

  function handleTitleChange(value: string) {
    setTitleDraft(value);
    updateContent("h1", value);
  }

  function handleHeroImageUpdate(img: HeroImage) {
    updateContent("hero_image", img);
  }

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setSaveError("");
    try {
      const updatedRecord = {
        ...record,
        generated_at: generatedAt,
        content,
      };
      const res = await fetch(`/api/admin/content/${template}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });
      if (res.ok) {
        setSaveStatus("saved");
        isDirty.current = false;
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        const body = await res.json() as { error?: string };
        setSaveError(body.error ?? "Save failed");
        setSaveStatus("error");
      }
    } catch {
      setSaveError("Network error — could not save");
      setSaveStatus("error");
    }
  }, [record, content, template, slug, generatedAt]);

  const handleRegenerate = useCallback(async () => {
    if (
      !confirm(
        "Regenerate this page using Claude? This will overwrite all content fields (hero image preserved). Continue?"
      )
    ) {
      return;
    }

    setRegenStatus("regenerating");
    setRegenError("");
    try {
      const res = await fetch(`/api/admin/content/${template}/${slug}/regenerate`, {
        method: "POST",
      });
      if (res.ok) {
        const newRecord = await res.json() as ContentRecord;
        const newContent = newRecord.content as Record<string, unknown>;
        setContent(newContent);
        setGeneratedAt(newRecord.generated_at);
        const newTitle =
          (newContent["h1"] as string) ??
          (newContent["page_title"] as string) ??
          slug;
        setTitleDraft(newTitle);
        setSaveStatus("idle");
        setRegenStatus("done");
        isDirty.current = false;
        setTimeout(() => setRegenStatus("idle"), 3000);
      } else {
        const body = await res.json() as { error?: string };
        setRegenError(body.error ?? "Regeneration failed");
        setRegenStatus("error");
      }
    } catch {
      setRegenError("Network error — regeneration failed");
      setRegenStatus("error");
    }
  }, [template, slug]);

  // Content fields except SEO, hero_image
  const mainFields = Object.entries(content).filter(
    ([key]) => !SEO_FIELDS.has(key) && !SKIP_FIELDS.has(key)
  );

  const statusLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
      ? "Saved"
      : saveStatus === "unsaved"
      ? "Unsaved changes"
      : saveStatus === "error"
      ? "Error"
      : "";

  const statusColor =
    saveStatus === "saved"
      ? "text-green-600"
      : saveStatus === "unsaved"
      ? "text-amber-600"
      : saveStatus === "error"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-0 py-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Editable title */}
          <input
            type="text"
            value={titleDraft}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex-1 text-xl font-semibold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 truncate min-w-0 placeholder-gray-300"
            placeholder="Page title…"
          />

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Status */}
            {statusLabel && (
              <span className={`text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            )}

            {/* View live */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              View Live ↗
            </a>

            {/* Regenerate */}
            <button
              onClick={handleRegenerate}
              disabled={regenStatus === "regenerating"}
              className="text-xs text-orange-600 border border-orange-300 rounded px-3 py-1.5 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {regenStatus === "regenerating"
                ? "Regenerating…"
                : regenStatus === "done"
                ? "Regenerated!"
                : "Regenerate"}
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white rounded px-4 py-1.5 font-medium transition-colors"
            >
              {saveStatus === "saving" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Error messages */}
        {saveStatus === "error" && saveError && (
          <p className="mt-2 text-xs text-red-500">{saveError}</p>
        )}
        {regenStatus === "error" && regenError && (
          <p className="mt-2 text-xs text-red-500">{regenError}</p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left: content fields (70%) */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* SEO fields at top */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">SEO Fields</h2>
            <div className="space-y-4">
              {/* page_title */}
              {typeof content["page_title"] === "string" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Page Title</label>
                    <CharCounter value={content["page_title"] as string} max={65} />
                  </div>
                  <input
                    type="text"
                    value={content["page_title"] as string}
                    onChange={(e) => updateSeoField("page_title", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              {/* meta_description */}
              {typeof content["meta_description"] === "string" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Meta Description</label>
                    <CharCounter value={content["meta_description"] as string} max={160} />
                  </div>
                  <textarea
                    value={content["meta_description"] as string}
                    onChange={(e) => updateSeoField("meta_description", e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              )}
              {/* h1 */}
              {typeof content["h1"] === "string" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">H1</label>
                    <CharCounter value={content["h1"] as string} max={70} />
                  </div>
                  <input
                    type="text"
                    value={content["h1"] as string}
                    onChange={(e) => updateSeoField("h1", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* All other content fields */}
          {mainFields.map(([key, value]) => (
            <FieldSection
              key={key}
              fieldKey={key}
              value={value}
              onChange={(v) => updateContent(key, v)}
            />
          ))}
        </div>

        {/* Right: sidebar (30%) */}
        <div className="w-80 flex-shrink-0 space-y-4">
          <HeroImagePanel
            heroImage={heroImage}
            template={template}
            slug={slug}
            onImageUpdate={handleHeroImageUpdate}
          />

          <SeoMetaPanel content={content} onChange={updateSeoField} />

          <PageInfoPanel
            template={template}
            slug={slug}
            generatedAt={generatedAt}
            content={content}
          />
        </div>
      </div>
    </div>
  );
}
