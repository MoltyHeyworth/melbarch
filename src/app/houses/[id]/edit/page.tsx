"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import HouseForm from "@/components/houses/HouseForm";

export default function EditHousePage() {
  const params = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/houses/${params.id}`);
      if (!res.ok) {
        router.push("/houses");
        return;
      }
      const data = await res.json();
      setHouse(data);
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  if (loading || !house) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-pulse text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  let styleArr: string[] = [];
  let materialsArr: string[] = [];
  let sourceRefs: string[] = [];
  try { styleArr = JSON.parse(house.style); } catch { /* empty */ }
  try { materialsArr = JSON.parse(house.materials); } catch { /* empty */ }
  try { sourceRefs = JSON.parse(house.sourceReferences); } catch { /* empty */ }

  const initialData = {
    id: house.id,
    address: house.address,
    suburb: house.suburb,
    postcode: house.postcode || "",
    name: house.name || "",
    yearBuilt: house.yearBuilt,
    yearBuiltApprox: house.yearBuiltApprox,
    architectureFirm: house.architectureFirm || "",
    style: styleArr,
    materials: materialsArr,
    bedrooms: house.bedrooms || "",
    landSizeSqm: house.landSizeSqm || "",
    floorAreaSqm: house.floorAreaSqm || "",
    description: house.description || "",
    architecturalNotes: house.architecturalNotes || "",
    sourceReferences: sourceRefs,
    ownerContact: house.ownerContact || "",
    featured: house.featured,
    architectNames: house.architects.map((a: { architect: { name: string } }) => a.architect.name),
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <Link href={`/houses/${house.id}`} className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] mb-4 inline-block">
          ← Back to detail
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-6">
          Edit: {house.name || house.address}
        </h1>
        <HouseForm initialData={initialData} />
      </div>
    </div>
  );
}
