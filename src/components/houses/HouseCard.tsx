import Link from "next/link";

interface HouseCardProps {
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

const STATUS_BADGES: Record<string, string> = {
  INTERESTED: "⭐ Interested",
  CONTACTED: "📞 Contacted",
  PASSED: "✗ Passed",
};

export default function HouseCard({
  id,
  address,
  suburb,
  name,
  yearBuilt,
  status,
  featured,
  architectNames,
  styleArr,
  primaryImage,
}: HouseCardProps) {
  const imgSrc = primaryImage?.url || primaryImage?.localPath || null;
  const displayName = name || address;

  return (
    <Link href={`/houses/${id}`}>
      <div
        className={`group bg-white rounded shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
          featured ? "ring-2 ring-[#C9A96E]" : "border border-gray-100"
        }`}
      >
        {/* Image */}
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-300">
                <svg
                  className="w-12 h-12 mx-auto mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 22V12h6v10"
                  />
                </svg>
                <span className="text-xs">No image</span>
              </div>
            </div>
          )}
          {featured && (
            <span className="absolute top-2 right-2 bg-[#C9A96E] text-white text-xs px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-[#1A1A2E] text-sm leading-tight mb-1 truncate">
            {displayName}
          </h3>
          <p className="text-xs text-[#6B7280] mb-1">
            {suburb} &middot; {yearBuilt}
          </p>
          {architectNames.length > 0 && (
            <p className="text-xs text-[#6B7280] truncate">
              {architectNames.join(", ")}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            {styleArr.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {styleArr.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-[#6B7280] rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {STATUS_BADGES[status] && (
              <span className="text-xs text-[#6B7280]">
                {STATUS_BADGES[status]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
