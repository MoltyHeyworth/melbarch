"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HouseCard from "./HouseCard";

interface HouseCardData {
  id: string;
  address: string;
  suburb: string;
  name: string | null;
  yearBuilt: number;
  status: string;
  featured: boolean;
  architectNames: string[];
  styleArr: string[];
  primaryImage: { url: string | null; localPath: string | null; sourceCitation: string } | null;
}

interface ApiResponse {
  houses: HouseCardData[];
  total: number;
  page: number;
  pages: number;
}

export default function HouseGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/houses?${searchParams.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch houses:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/houses?${params.toString()}`);
  };

  // Sort control
  const currentSort = searchParams.get("sort") || "added_newest";
  const setSort = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", val);
    params.delete("page");
    router.push(`/houses?${params.toString()}`);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.houses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </div>
        <p className="text-[#6B7280] mb-2">No houses match your filters.</p>
        <button
          onClick={() => router.push("/houses")}
          className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] transition-colors"
        >
          Clear filters
        </button>
      </div>
    );
  }

  const start = (data.page - 1) * 24 + 1;
  const end = Math.min(data.page * 24, data.total);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6B7280]">
          Showing {start}--{end} of {data.total}
        </p>
        <select
          value={currentSort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-gray-200 rounded px-3 py-1.5 bg-white text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        >
          <option value="added_newest">Newest Added</option>
          <option value="year_desc">Year (newest)</option>
          <option value="year_asc">Year (oldest)</option>
          <option value="suburb_az">Suburb A-Z</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.houses.map((house) => (
          <HouseCard key={house.id} {...house} />
        ))}
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => goToPage(data.page - 1)}
            disabled={data.page <= 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded bg-white text-[#1A1A2E] hover:border-[#C9A96E] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-sm text-[#6B7280]">
            Page {data.page} of {data.pages}
          </span>
          <button
            onClick={() => goToPage(data.page + 1)}
            disabled={data.page >= data.pages}
            className="px-4 py-2 text-sm border border-gray-200 rounded bg-white text-[#1A1A2E] hover:border-[#C9A96E] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
