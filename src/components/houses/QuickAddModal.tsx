"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function QuickAddModal() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea/select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const architects = (form.get("architects") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      address: form.get("address"),
      suburb: form.get("suburb"),
      yearBuilt: form.get("yearBuilt"),
      architectNames: architects,
    };

    const res = await fetch("/api/houses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      setOpen(false);
      setSaving(false);
      router.push(`/houses/${data.id}`);
    } else {
      alert("Error saving house");
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-[#1A1A2E]">Quick Add House</h2>
          <button onClick={() => setOpen(false)} className="text-[#6B7280] hover:text-[#1A1A2E]">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
              Address *
            </label>
            <input
              name="address"
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              placeholder="e.g. 290 Walsh Street"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
              Suburb *
            </label>
            <input
              name="suburb"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              placeholder="e.g. South Yarra"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
              Year Built *
            </label>
            <input
              name="yearBuilt"
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              placeholder="e.g. 1958"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
              Architect(s)
            </label>
            <input
              name="architects"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
              placeholder="Robin Boyd, Glenn Murcutt (comma-separated)"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[#1A1A2E] text-white text-sm rounded hover:bg-[#1A1A2E]/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & View"}
          </button>
        </form>

        <p className="text-xs text-[#6B7280] mt-3 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">N</kbd> to open, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
