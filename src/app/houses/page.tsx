import { Suspense } from "react";
import FilterPanel from "@/components/houses/FilterPanel";
import HouseGrid from "@/components/houses/HouseGrid";

export default function HousesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-1">
            Browse Houses
          </h1>
          <p className="text-sm text-[#6B7280]">
            Melbourne&apos;s architecturally significant residences
          </p>
        </div>

        <Suspense fallback={<div className="animate-pulse h-screen bg-gray-50 rounded" />}>
          <div className="flex flex-col lg:flex-row gap-6">
            <FilterPanel />
            <main className="flex-1 min-w-0">
              <HouseGrid />
            </main>
          </div>
        </Suspense>
      </div>
    </div>
  );
}
