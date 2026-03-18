"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const DECADES = [
  { label: "Pre-1900", min: 0, max: 1899 },
  { label: "1900s", min: 1900, max: 1909 },
  { label: "1910s", min: 1910, max: 1919 },
  { label: "1920s", min: 1920, max: 1929 },
  { label: "1930s", min: 1930, max: 1939 },
  { label: "1940s", min: 1940, max: 1949 },
  { label: "1950s", min: 1950, max: 1959 },
  { label: "1960s", min: 1960, max: 1969 },
  { label: "1970s", min: 1970, max: 1979 },
  { label: "1980s", min: 1980, max: 1989 },
  { label: "1990s", min: 1990, max: 1999 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2020s", min: 2020, max: 2029 },
];

const STATUSES = ["All", "UNREVIEWED", "INTERESTED", "CONTACTED", "PASSED"];

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentQ = searchParams.get("q") || "";
  const currentSuburb = searchParams.get("suburb") || "";
  const currentArchitect = searchParams.get("architect") || "";
  const currentStyle = searchParams.get("style") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentFeatured = searchParams.get("featured") === "true";
  const currentYearMin = searchParams.get("yearMin") || "";
  const currentYearMax = searchParams.get("yearMax") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset to page 1
      router.push(`/houses?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/houses");
  }, [router]);

  const setDecade = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      const curMin = searchParams.get("yearMin");
      const curMax = searchParams.get("yearMax");
      // Toggle off if already selected
      if (curMin === String(min) && curMax === String(max)) {
        params.delete("yearMin");
        params.delete("yearMax");
      } else {
        params.set("yearMin", String(min));
        params.set("yearMax", String(max));
      }
      params.delete("page");
      router.push(`/houses?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hasFilters =
    currentQ ||
    currentSuburb ||
    currentArchitect ||
    currentStyle ||
    currentStatus ||
    currentFeatured ||
    currentYearMin ||
    currentYearMax;

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Search
        </label>
        <input
          type="text"
          placeholder="Address, name, notes..."
          defaultValue={currentQ}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("q", (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam("q", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        />
      </div>

      {/* Suburb */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Suburb
        </label>
        <input
          type="text"
          placeholder="e.g. South Yarra"
          defaultValue={currentSuburb}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("suburb", (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam("suburb", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        />
      </div>

      {/* Architect */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Architect
        </label>
        <input
          type="text"
          placeholder="e.g. Robin Boyd"
          defaultValue={currentArchitect}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("architect", (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam("architect", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        />
      </div>

      {/* Style */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Style
        </label>
        <input
          type="text"
          placeholder="e.g. Modernist"
          defaultValue={currentStyle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("style", (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => updateParam("style", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        />
      </div>

      {/* Era */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Era
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DECADES.map((d) => {
            const active =
              currentYearMin === String(d.min) &&
              currentYearMax === String(d.max);
            return (
              <button
                key={d.label}
                onClick={() => setDecade(d.min, d.max)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  active
                    ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                    : "bg-white text-[#6B7280] border-gray-200 hover:border-[#C9A96E]"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Status
        </label>
        <div className="space-y-1">
          {STATUSES.map((s) => {
            const value = s === "All" ? "" : s;
            const active = currentStatus === value;
            const label =
              s === "UNREVIEWED"
                ? "Unreviewed"
                : s === "INTERESTED"
                  ? "⭐ Interested"
                  : s === "CONTACTED"
                    ? "📞 Contacted"
                    : s === "PASSED"
                      ? "✗ Passed"
                      : "All";
            return (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={active}
                  onChange={() => updateParam("status", value)}
                  className="accent-[#C9A96E]"
                />
                <span className="text-sm text-[#1A1A2E]">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFeatured}
            onChange={(e) =>
              updateParam("featured", e.target.checked ? "true" : "")
            }
            className="accent-[#C9A96E]"
          />
          <span className="text-sm text-[#1A1A2E]">Featured only</span>
        </label>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
          Year Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            defaultValue={currentYearMin}
            onBlur={(e) => updateParam("yearMin", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                updateParam("yearMin", (e.target as HTMLInputElement).value);
            }}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          />
          <input
            type="number"
            placeholder="To"
            defaultValue={currentYearMax}
            onBlur={(e) => updateParam("yearMax", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                updateParam("yearMax", (e.target as HTMLInputElement).value);
            }}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          />
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm text-[#C9A96E] hover:text-[#1A1A2E] transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="px-4 py-2 border border-gray-200 rounded bg-white text-sm text-[#1A1A2E] hover:border-[#C9A96E]"
        >
          {mobileOpen ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Mobile filters */}
      {mobileOpen && (
        <div className="lg:hidden mb-6 p-4 bg-white rounded border border-gray-200">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 p-4 bg-white rounded border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A2E] mb-4 uppercase tracking-wider">
            Filters
          </h2>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
