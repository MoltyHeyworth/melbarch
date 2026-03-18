"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HouseFormProps {
  initialData?: {
    id?: string;
    address: string;
    suburb: string;
    postcode: string;
    name: string;
    yearBuilt: number | string;
    yearBuiltApprox: boolean;
    architectureFirm: string;
    style: string[];
    materials: string[];
    bedrooms: number | string;
    landSizeSqm: number | string;
    floorAreaSqm: number | string;
    description: string;
    architecturalNotes: string;
    sourceReferences: string[];
    ownerContact: string;
    featured: boolean;
    architectNames: string[];
  };
}

export default function HouseForm({ initialData }: HouseFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    address: initialData?.address || "",
    suburb: initialData?.suburb || "",
    postcode: initialData?.postcode || "",
    name: initialData?.name || "",
    yearBuilt: initialData?.yearBuilt?.toString() || "",
    yearBuiltApprox: initialData?.yearBuiltApprox || false,
    architectureFirm: initialData?.architectureFirm || "",
    bedrooms: initialData?.bedrooms?.toString() || "",
    landSizeSqm: initialData?.landSizeSqm?.toString() || "",
    floorAreaSqm: initialData?.floorAreaSqm?.toString() || "",
    description: initialData?.description || "",
    architecturalNotes: initialData?.architecturalNotes || "",
    ownerContact: initialData?.ownerContact || "",
    featured: initialData?.featured || false,
  });

  const [architectNames, setArchitectNames] = useState<string[]>(initialData?.architectNames || []);
  const [archInput, setArchInput] = useState("");
  const [styleArr, setStyleArr] = useState<string[]>(initialData?.style || []);
  const [styleInput, setStyleInput] = useState("");
  const [materialsArr, setMaterialsArr] = useState<string[]>(initialData?.materials || []);
  const [matInput, setMatInput] = useState("");
  const [sourceRefs, setSourceRefs] = useState<string[]>(initialData?.sourceReferences || []);
  const [srcInput, setSrcInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = (
    value: string,
    arr: string[],
    setArr: (v: string[]) => void,
    setInput: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !arr.includes(trimmed)) {
      setArr([...arr, trimmed]);
    }
    setInput("");
  };

  const removeTag = (idx: number, arr: string[], setArr: (v: string[]) => void) => {
    setArr(arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      ...form,
      yearBuilt: parseInt(form.yearBuilt),
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      landSizeSqm: form.landSizeSqm ? parseFloat(form.landSizeSqm) : null,
      floorAreaSqm: form.floorAreaSqm ? parseFloat(form.floorAreaSqm) : null,
      style: styleArr,
      materials: materialsArr,
      sourceReferences: sourceRefs,
      architectNames,
    };

    const url = isEdit ? `/api/houses/${initialData!.id}` : "/api/houses";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/houses/${data.id || initialData!.id}`);
    } else {
      alert("Error saving house");
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]";
  const labelClass = "block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Basic Info */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Address *</label>
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Suburb *</label>
            <input required value={form.suburb} onChange={(e) => setForm({ ...form, suburb: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Postcode</label>
            <input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>House Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Walsh Street House" />
          </div>
          <div>
            <label className={labelClass}>Year Built *</label>
            <input required type="number" value={form.yearBuilt} onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })} className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.yearBuiltApprox} onChange={(e) => setForm({ ...form, yearBuiltApprox: e.target.checked })} className="accent-[#C9A96E]" />
            <label className="text-sm text-[#6B7280]">Year is approximate</label>
          </div>
          <div>
            <label className={labelClass}>Architecture Firm</label>
            <input value={form.architectureFirm} onChange={(e) => setForm({ ...form, architectureFirm: e.target.value })} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Architects */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Architects</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={archInput}
            onChange={(e) => setArchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(archInput, architectNames, setArchitectNames, setArchInput);
              }
            }}
            placeholder="Type name and press Enter"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => addTag(archInput, architectNames, setArchitectNames, setArchInput)}
            className="px-3 py-2 bg-[#1A1A2E] text-white text-sm rounded shrink-0"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {architectNames.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded">
              {name}
              <button type="button" onClick={() => removeTag(i, architectNames, setArchitectNames)} className="text-red-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Style */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Style</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={styleInput}
            onChange={(e) => setStyleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(styleInput, styleArr, setStyleArr, setStyleInput);
              }
            }}
            placeholder="e.g. Modernist"
            className={inputClass}
          />
          <button type="button" onClick={() => addTag(styleInput, styleArr, setStyleArr, setStyleInput)} className="px-3 py-2 bg-[#1A1A2E] text-white text-sm rounded shrink-0">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {styleArr.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded">
              {s}
              <button type="button" onClick={() => removeTag(i, styleArr, setStyleArr)} className="text-red-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Materials</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={matInput}
            onChange={(e) => setMatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(matInput, materialsArr, setMaterialsArr, setMatInput);
              }
            }}
            placeholder="e.g. Concrete"
            className={inputClass}
          />
          <button type="button" onClick={() => addTag(matInput, materialsArr, setMaterialsArr, setMatInput)} className="px-3 py-2 bg-[#1A1A2E] text-white text-sm rounded shrink-0">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {materialsArr.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#C9A96E]/10 text-sm rounded">
              {m}
              <button type="button" onClick={() => removeTag(i, materialsArr, setMaterialsArr)} className="text-red-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Details */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Land Size (m²)</label>
            <input type="number" step="0.1" value={form.landSizeSqm} onChange={(e) => setForm({ ...form, landSizeSqm: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Floor Area (m²)</label>
            <input type="number" step="0.1" value={form.floorAreaSqm} onChange={(e) => setForm({ ...form, floorAreaSqm: e.target.value })} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Description & Notes */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Description</h2>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={inputClass} placeholder="Describe the house..." />
      </section>

      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Architectural Notes</h2>
        <textarea value={form.architecturalNotes} onChange={(e) => setForm({ ...form, architecturalNotes: e.target.value })} rows={4} className={inputClass} placeholder="Technical notes on design significance..." />
      </section>

      {/* Source References */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Source References</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={srcInput}
            onChange={(e) => setSrcInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(srcInput, sourceRefs, setSourceRefs, setSrcInput);
              }
            }}
            placeholder="e.g. Architecture Australia, Nov 1992"
            className={inputClass}
          />
          <button type="button" onClick={() => addTag(srcInput, sourceRefs, setSourceRefs, setSrcInput)} className="px-3 py-2 bg-[#1A1A2E] text-white text-sm rounded shrink-0">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sourceRefs.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded">
              {s}
              <button type="button" onClick={() => removeTag(i, sourceRefs, setSourceRefs)} className="text-red-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Owner Contact */}
      <section>
        <h2 className="text-lg font-light text-[#1A1A2E] mb-4">Owner Contact</h2>
        <input value={form.ownerContact} onChange={(e) => setForm({ ...form, ownerContact: e.target.value })} className={inputClass} placeholder="Contact details (private)" />
      </section>

      {/* Featured */}
      <section>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#C9A96E]" />
          <span className="text-sm text-[#1A1A2E]">Mark as Featured</span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#1A1A2E] text-white text-sm rounded hover:bg-[#1A1A2E]/90 disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create House"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-sm rounded text-[#6B7280] hover:border-[#C9A96E]">
          Cancel
        </button>
      </div>
    </form>
  );
}
