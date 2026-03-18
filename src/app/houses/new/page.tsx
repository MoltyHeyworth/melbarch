import Link from "next/link";
import HouseForm from "@/components/houses/HouseForm";

export default function NewHousePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <Link href="/houses" className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] mb-4 inline-block">
          ← Back to browse
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-6">
          Add House
        </h1>
        <HouseForm />
      </div>
    </div>
  );
}
