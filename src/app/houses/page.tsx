import { prisma } from "@/lib/prisma";

export default async function HousesPage() {
  const count = await prisma.house.count();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-[#1A1A2E] mb-2">
          Browse
        </h1>
        <p className="text-lg text-[#6B7280]">
          {count} {count === 1 ? "house" : "houses"} in database
        </p>
      </div>
    </div>
  );
}
