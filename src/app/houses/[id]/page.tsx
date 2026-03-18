"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCompletenessScore } from "@/lib/completeness";

interface HouseDetail {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string | null;
  name: string | null;
  yearBuilt: number;
  yearBuiltApprox: boolean;
  architectureFirm: string | null;
  style: string;
  materials: string;
  bedrooms: number | null;
  landSizeSqm: number | null;
  floorAreaSqm: number | null;
  description: string | null;
  architecturalNotes: string | null;
  sourceReferences: string;
  ownerContact: string | null;
  myNotes: string | null;
  status: string;
  featured: boolean;
  architects: { architect: { id: string; name: string } }[];
  images: {
    id: string;
    url: string | null;
    localPath: string | null;
    sourceType: string;
    sourceCitation: string;
    caption: string | null;
    sortOrder: number;
  }[];
  awards: {
    id: string;
    awardName: string;
    awardingBody: string | null;
    yearAwarded: number | null;
    notes: string | null;
  }[];
}

const STATUS_OPTIONS = [
  { value: "UNREVIEWED", label: "Unreviewed", icon: "" },
  { value: "INTERESTED", label: "Interested", icon: "⭐" },
  { value: "CONTACTED", label: "Contacted", icon: "📞" },
  { value: "PASSED", label: "Passed", icon: "✗" },
];

export default function HouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState<HouseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [showAddImage, setShowAddImage] = useState(false);
  const [showAddAward, setShowAddAward] = useState(false);

  const fetchHouse = useCallback(async () => {
    const res = await fetch(`/api/houses/${params.id}`);
    if (!res.ok) {
      router.push("/houses");
      return;
    }
    const data = await res.json();
    setHouse(data);
    setNotesValue(data.myNotes || "");
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchHouse();
  }, [fetchHouse]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/houses/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setHouse((prev) => (prev ? { ...prev, status } : prev));
  };

  const saveNotes = async () => {
    await fetch(`/api/houses/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ myNotes: notesValue }),
    });
    setHouse((prev) => (prev ? { ...prev, myNotes: notesValue } : prev));
    setEditingNotes(false);
  };

  const addImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      url: form.get("url") || null,
      sourceType: form.get("sourceType") || "OTHER",
      sourceCitation: form.get("sourceCitation"),
      caption: form.get("caption") || null,
    };
    await fetch(`/api/houses/${params.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowAddImage(false);
    fetchHouse();
  };

  const deleteImage = async (imageId: string) => {
    await fetch(`/api/houses/${params.id}/images/${imageId}`, { method: "DELETE" });
    fetchHouse();
  };

  const addAward = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      awardName: form.get("awardName"),
      awardingBody: form.get("awardingBody") || null,
      yearAwarded: form.get("yearAwarded") || null,
      notes: form.get("notes") || null,
    };
    await fetch(`/api/houses/${params.id}/awards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowAddAward(false);
    fetchHouse();
  };

  const deleteAward = async (awardId: string) => {
    await fetch(`/api/houses/${params.id}/awards/${awardId}`, { method: "DELETE" });
    fetchHouse();
  };

  if (loading || !house) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-pulse text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  const styleArr = safeParseArr(house.style);
  const materialsArr = safeParseArr(house.materials);
  const sourcesArr = safeParseArr(house.sourceReferences);
  const architectNames = house.architects.map((a) => a.architect.name);
  const heroImage = house.images[heroIdx] || null;
  const heroSrc = heroImage?.url || heroImage?.localPath || null;

  const completeness = getCompletenessScore(house);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Image */}
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100 relative">
        {heroSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroSrc} alt={house.name || house.address} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
        )}
        {heroImage && (
          <p className="absolute bottom-2 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
            {heroImage.sourceCitation}
          </p>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <Link href="/houses" className="text-sm text-[#C9A96E] hover:text-[#1A1A2E]">
            ← Back to browse
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/houses/${house.id}/edit`}
              className="px-4 py-2 text-sm border border-[#1A1A2E] text-[#1A1A2E] rounded hover:bg-[#1A1A2E] hover:text-white transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6B7280]">Completeness</span>
            <span className="text-xs text-[#6B7280]">{completeness.pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#C9A96E] h-1.5 rounded-full transition-all"
              style={{ width: `${completeness.pct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Gallery */}
          <div className="lg:w-1/2">
            {house.images.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {house.images.map((img, i) => {
                  const src = img.url || img.localPath || null;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setHeroIdx(i)}
                      className={`shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                        i === heroIdx ? "border-[#C9A96E]" : "border-transparent"
                      }`}
                    >
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Add image */}
            <button
              onClick={() => setShowAddImage(!showAddImage)}
              className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] mb-4"
            >
              + Add image
            </button>
            {showAddImage && (
              <form onSubmit={addImage} className="bg-white p-4 rounded border border-gray-200 mb-4 space-y-3">
                <input name="url" placeholder="Image URL" className="w-full px-3 py-2 border rounded text-sm" />
                <select name="sourceType" className="w-full px-3 py-2 border rounded text-sm">
                  <option value="OTHER">Other</option>
                  <option value="MAGAZINE">Magazine</option>
                  <option value="BOOK">Book</option>
                  <option value="ARCHITECT_WEBSITE">Architect Website</option>
                  <option value="DIGITIZED_ARCHIVE">Digitized Archive</option>
                </select>
                <input name="sourceCitation" placeholder="Source citation (required)" required className="w-full px-3 py-2 border rounded text-sm" />
                <input name="caption" placeholder="Caption" className="w-full px-3 py-2 border rounded text-sm" />
                <button type="submit" className="px-4 py-2 bg-[#1A1A2E] text-white text-sm rounded">
                  Add Image
                </button>
              </form>
            )}

            {/* Image list with delete */}
            {house.images.length > 0 && (
              <div className="space-y-2">
                {house.images.map((img) => (
                  <div key={img.id} className="flex items-center justify-between text-xs text-[#6B7280] bg-white px-3 py-2 rounded border border-gray-100">
                    <span>{img.caption || img.sourceCitation}</span>
                    <button onClick={() => deleteImage(img.id)} className="text-red-400 hover:text-red-600 ml-2">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Metadata */}
          <div className="lg:w-1/2 space-y-6">
            {/* Overview */}
            <section>
              <h1 className="text-2xl font-light text-[#1A1A2E] mb-1">
                {house.name || house.address}
              </h1>
              {house.name && (
                <p className="text-sm text-[#6B7280] mb-1">{house.address}</p>
              )}
              <p className="text-sm text-[#6B7280]">
                {house.suburb}, {house.state} {house.postcode || ""}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                {house.yearBuilt}
                {house.yearBuiltApprox ? " (approx.)" : ""}
              </p>

              {architectNames.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-[#6B7280] uppercase tracking-wider">Architects</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {house.architects.map((a) => (
                      <Link
                        key={a.architect.id}
                        href={`/architects/${a.architect.id}`}
                        className="text-sm text-[#C9A96E] hover:text-[#1A1A2E]"
                      >
                        {a.architect.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {house.architectureFirm && (
                <p className="text-sm text-[#6B7280] mt-2">
                  <span className="text-xs uppercase tracking-wider">Firm:</span> {house.architectureFirm}
                </p>
              )}

              {styleArr.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {styleArr.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-[#6B7280] rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {materialsArr.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {materialsArr.map((m) => (
                    <span key={m} className="text-xs px-2 py-0.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded">
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mt-3 text-sm text-[#6B7280]">
                {house.bedrooms && <div>🛏 {house.bedrooms} bed</div>}
                {house.landSizeSqm && <div>📐 {house.landSizeSqm}m² land</div>}
                {house.floorAreaSqm && <div>📏 {house.floorAreaSqm}m² floor</div>}
              </div>
            </section>

            {/* Description */}
            {house.description && (
              <section>
                <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Description</h2>
                <p className="text-sm text-[#1A1A2E] leading-relaxed">{house.description}</p>
              </section>
            )}

            {/* Architectural Notes */}
            {house.architecturalNotes && (
              <section>
                <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Architectural Notes</h2>
                <p className="text-sm text-[#1A1A2E] leading-relaxed">{house.architecturalNotes}</p>
              </section>
            )}

            {/* Awards */}
            <section>
              <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Awards</h2>
              {house.awards.length > 0 ? (
                <div className="space-y-2">
                  {house.awards.map((a) => (
                    <div key={a.id} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-100 text-sm">
                      <div>
                        <span className="text-[#1A1A2E] font-medium">{a.awardName}</span>
                        {a.awardingBody && <span className="text-[#6B7280]"> - {a.awardingBody}</span>}
                        {a.yearAwarded && <span className="text-[#6B7280]"> ({a.yearAwarded})</span>}
                      </div>
                      <button onClick={() => deleteAward(a.id)} className="text-red-400 hover:text-red-600 ml-2 text-xs">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">No awards recorded</p>
              )}
              <button
                onClick={() => setShowAddAward(!showAddAward)}
                className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] mt-2"
              >
                + Add award
              </button>
              {showAddAward && (
                <form onSubmit={addAward} className="bg-white p-4 rounded border border-gray-200 mt-2 space-y-3">
                  <input name="awardName" placeholder="Award name (required)" required className="w-full px-3 py-2 border rounded text-sm" />
                  <input name="awardingBody" placeholder="Awarding body" className="w-full px-3 py-2 border rounded text-sm" />
                  <input name="yearAwarded" type="number" placeholder="Year" className="w-full px-3 py-2 border rounded text-sm" />
                  <input name="notes" placeholder="Notes" className="w-full px-3 py-2 border rounded text-sm" />
                  <button type="submit" className="px-4 py-2 bg-[#1A1A2E] text-white text-sm rounded">Add Award</button>
                </form>
              )}
            </section>

            {/* Sources */}
            {sourcesArr.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Sources</h2>
                <ul className="list-disc list-inside text-sm text-[#6B7280] space-y-1">
                  {sourcesArr.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* My Status */}
            <section>
              <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">My Status</h2>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateStatus(opt.value)}
                    className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                      house.status === opt.value
                        ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                        : "bg-white text-[#6B7280] border-gray-200 hover:border-[#C9A96E]"
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* My Notes */}
            <section>
              <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">My Notes</h2>
              {editingNotes ? (
                <div>
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    onBlur={saveNotes}
                    autoFocus
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">Auto-saves on blur</p>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNotes(true)}
                  className="cursor-pointer p-3 bg-white rounded border border-gray-100 text-sm text-[#1A1A2E] min-h-[60px] hover:border-[#C9A96E] transition-colors"
                >
                  {house.myNotes || <span className="text-[#6B7280] italic">Click to add notes...</span>}
                </div>
              )}
            </section>

            {/* Owner Contact */}
            {house.ownerContact && (
              <section>
                <h2 className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Owner Contact</h2>
                <div className="bg-white p-3 rounded border border-gray-100 text-sm text-[#1A1A2E]">
                  {house.ownerContact}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function safeParseArr(val: string): string[] {
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
