"use client";

import { useState, useCallback } from "react";

interface TaxonomyEditorProps {
  fileSlug: string;
  initialData: unknown;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ─── Simple string-array editor ─────────────────────────────────────────────

function StringArrayEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  function handleEdit(index: number, value: string) {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  }

  function handleDelete(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleAdd() {
    if (newItem.trim() === "") return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => handleEdit(i, e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleDelete(i)}
            className="px-3 py-1.5 text-xs text-red-400 border border-gray-700 rounded hover:bg-red-950 hover:border-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      ))}
      <div className="flex gap-2 pt-2 border-t border-gray-800">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New item…"
          className="flex-1 bg-gray-800 border border-dashed border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 text-xs text-indigo-400 border border-indigo-700 rounded hover:bg-indigo-950 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Object-array editor (JSON textarea per item) ────────────────────────────

function ObjectArrayEditor({
  items,
  onChange,
}: {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
}) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<number, string>>({});

  function toggleExpand(i: number) {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
    if (!drafts[i]) {
      setDrafts((prev) => ({ ...prev, [i]: JSON.stringify(items[i], null, 2) }));
    }
  }

  function handleDraftChange(i: number, value: string) {
    setDrafts((prev) => ({ ...prev, [i]: value }));
    try {
      JSON.parse(value);
      setJsonErrors((prev) => ({ ...prev, [i]: "" }));
    } catch {
      setJsonErrors((prev) => ({ ...prev, [i]: "Invalid JSON" }));
    }
  }

  function handleSaveItem(i: number) {
    if (jsonErrors[i]) return;
    const parsed = JSON.parse(drafts[i]) as Record<string, unknown>;
    const updated = [...items];
    updated[i] = parsed;
    onChange(updated);
  }

  function handleDelete(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function handleAddBlank() {
    onChange([...items, {}]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const preview =
          (item["name"] as string) ||
          (item["slug"] as string) ||
          (item["title"] as string) ||
          `Item ${i + 1}`;
        const isOpen = !!expanded[i];

        return (
          <div key={i} className="border border-gray-800 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-2.5 bg-gray-900 cursor-pointer hover:bg-gray-850"
              onClick={() => toggleExpand(i)}
            >
              <span className="text-sm text-gray-300">{preview}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
                <span className="text-gray-600 text-xs">{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {isOpen && (
              <div className="p-4 bg-gray-950 space-y-2">
                <textarea
                  value={drafts[i] ?? JSON.stringify(item, null, 2)}
                  onChange={(e) => handleDraftChange(i, e.target.value)}
                  rows={Math.min(20, (drafts[i] ?? "").split("\n").length + 2)}
                  className="w-full bg-gray-800 border border-gray-700 text-white font-mono text-xs rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
                {jsonErrors[i] && (
                  <p className="text-red-400 text-xs">{jsonErrors[i]}</p>
                )}
                <button
                  onClick={() => handleSaveItem(i)}
                  disabled={!!jsonErrors[i]}
                  className="text-xs text-indigo-400 border border-indigo-700 rounded px-3 py-1.5 hover:bg-indigo-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Apply changes
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleAddBlank}
        className="mt-2 text-xs text-indigo-400 border border-dashed border-indigo-700 rounded px-4 py-2 hover:bg-indigo-950 transition-colors w-full"
      >
        + Add item
      </button>
    </div>
  );
}

// ─── Top-level object editor (keyed sections) ────────────────────────────────

function KeyedObjectEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleKey(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => {
        const isOpen = !!expanded[key];
        const isStringArray = Array.isArray(value) && value.every((v) => typeof v === "string");
        const isObjectArray =
          Array.isArray(value) && value.every((v) => v !== null && typeof v === "object");
        const itemCount = Array.isArray(value) ? value.length : "object";

        return (
          <div key={key} className="border border-gray-800 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-900 cursor-pointer"
              onClick={() => toggleKey(key)}
            >
              <div>
                <span className="text-sm font-medium text-white">{key}</span>
                <span className="ml-3 text-xs text-gray-500">{itemCount} {Array.isArray(value) ? "items" : ""}</span>
              </div>
              <span className="text-gray-600 text-xs">{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
              <div className="p-4 bg-gray-950">
                {isStringArray ? (
                  <StringArrayEditor
                    items={value as string[]}
                    onChange={(updated) => onChange({ ...data, [key]: updated })}
                  />
                ) : isObjectArray ? (
                  <ObjectArrayEditor
                    items={value as Record<string, unknown>[]}
                    onChange={(updated) => onChange({ ...data, [key]: updated })}
                  />
                ) : (
                  <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function TaxonomyEditor({ fileSlug, initialData }: TaxonomyEditorProps) {
  const [data, setData] = useState<unknown>(initialData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/admin/taxonomy/${fileSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        const body = await res.json() as { error?: string };
        setErrorMessage(body.error ?? "Save failed");
        setSaveStatus("error");
      }
    } catch {
      setErrorMessage("Network error — could not save");
      setSaveStatus("error");
    }
  }, [data, fileSlug]);

  const isStringArray =
    Array.isArray(data) && data.every((v) => typeof v === "string");
  const isObjectArray =
    Array.isArray(data) && data.every((v) => v !== null && typeof v === "object");
  const isKeyedObject =
    !Array.isArray(data) && data !== null && typeof data === "object";

  return (
    <div className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {Array.isArray(data)
            ? `${(data as unknown[]).length} items`
            : `${Object.keys(data as object).length} top-level keys`}
        </p>
        <div className="flex items-center gap-3">
          {saveStatus === "error" && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}
          {saveStatus === "saved" && (
            <p className="text-green-400 text-sm">Saved!</p>
          )}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded px-4 py-2 text-sm font-medium transition-colors"
          >
            {saveStatus === "saving" ? "Saving…" : "Save to disk"}
          </button>
        </div>
      </div>

      {/* Editor */}
      {isStringArray && (
        <StringArrayEditor
          items={data as string[]}
          onChange={setData}
        />
      )}
      {isObjectArray && (
        <ObjectArrayEditor
          items={data as Record<string, unknown>[]}
          onChange={setData}
        />
      )}
      {isKeyedObject && (
        <KeyedObjectEditor
          data={data as Record<string, unknown>}
          onChange={setData}
        />
      )}
    </div>
  );
}
