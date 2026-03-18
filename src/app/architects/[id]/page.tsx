import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import HouseCard from '@/components/houses/HouseCard'
import ArchitectEditor from '@/components/architects/ArchitectEditor'

export default async function ArchitectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const architect = await prisma.architect.findUnique({
    where: { id },
    include: {
      houses: {
        include: {
          house: {
            include: {
              images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              architects: { include: { architect: true } },
            },
          },
        },
      },
    },
  })

  if (!architect) {
    notFound()
  }

  const houseCards = architect.houses.map((ha) => {
    const h = ha.house
    const primaryImage = h.images[0] || null
    return {
      id: h.id,
      address: h.address,
      suburb: h.suburb,
      name: h.name,
      yearBuilt: h.yearBuilt,
      status: h.status,
      featured: h.featured,
      architectNames: h.architects.map((a) => a.architect.name),
      styleArr: JSON.parse(h.style) as string[],
      primaryImage: primaryImage
        ? {
            url: primaryImage.url,
            localPath: primaryImage.localPath,
            sourceCitation: primaryImage.sourceCitation,
          }
        : null,
    }
  })

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/architects"
          className="text-sm text-[#C9A96E] hover:text-[#1A1A2E] transition-colors mb-6 inline-block"
        >
          &larr; All Architects
        </Link>

        <h1 className="text-3xl font-light tracking-tight text-[#1A1A2E] mb-4">
          {architect.name}
        </h1>

        <div className="mb-8">
          <ArchitectEditor
            id={architect.id}
            biography={architect.biography}
            website={architect.website}
            nationality={architect.nationality}
            activePeriod={architect.activePeriod}
          />
        </div>

        {houseCards.length > 0 ? (
          <div>
            <h2 className="text-lg font-medium text-[#1A1A2E] mb-4">
              Houses ({houseCards.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {houseCards.map((house) => (
                <HouseCard key={house.id} {...house} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[#6B7280]">No houses linked to this architect yet.</p>
        )}
      </div>
    </div>
  )
}
