export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const architects = await prisma.architect.findMany({
    include: {
      _count: { select: { houses: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(
    architects.map((a) => ({
      id: a.id,
      name: a.name,
      activePeriod: a.activePeriod,
      nationality: a.nationality,
      website: a.website,
      _count: a._count,
    }))
  )
}
