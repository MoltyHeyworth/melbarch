import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ArchitectsPage() {
  const architects = await prisma.architect.findMany({
    include: {
      _count: { select: { houses: true } },
    },
    orderBy: { name: 'asc' },
  })

  // Sort by house count desc
  architects.sort((a, b) => b._count.houses - a._count.houses)

  if (architects.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-1">
            Architects
          </h1>
          <div className="text-center py-16 text-[#6B7280]">
            <p>No architects in the database yet.</p>
            <p className="text-sm mt-1">Add houses with architect names to populate this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-1">
            Architects
          </h1>
          <p className="text-sm text-[#6B7280]">
            {architects.length} architect{architects.length !== 1 ? 's' : ''} in the database
          </p>
        </div>

        <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-[#6B7280] uppercase tracking-wider text-xs">
                    Name
                  </th>
                  <th className="px-4 py-3 font-medium text-[#6B7280] uppercase tracking-wider text-xs hidden sm:table-cell">
                    Active Period
                  </th>
                  <th className="px-4 py-3 font-medium text-[#6B7280] uppercase tracking-wider text-xs hidden md:table-cell">
                    Nationality
                  </th>
                  <th className="px-4 py-3 font-medium text-[#6B7280] uppercase tracking-wider text-xs text-center">
                    Houses
                  </th>
                  <th className="px-4 py-3 font-medium text-[#6B7280] uppercase tracking-wider text-xs hidden lg:table-cell">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody>
                {architects.map((architect) => (
                  <tr
                    key={architect.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/architects/${architect.id}`}
                        className="text-[#1A1A2E] hover:text-[#C9A96E] font-medium transition-colors"
                      >
                        {architect.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] hidden sm:table-cell">
                      {architect.activePeriod || '-'}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] hidden md:table-cell">
                      {architect.nationality || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-[#1A1A2E] text-xs font-medium">
                        {architect._count.houses}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {architect.website ? (
                        <a
                          href={architect.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C9A96E] hover:underline text-xs truncate block max-w-[200px]"
                        >
                          {architect.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      ) : (
                        <span className="text-[#6B7280]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
