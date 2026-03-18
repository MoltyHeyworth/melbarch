export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const houses = await prisma.house.findMany({
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      awards: true,
      architects: { include: { architect: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = houses.map((h) => ({
    id: h.id,
    address: h.address,
    suburb: h.suburb,
    state: h.state,
    postcode: h.postcode,
    name: h.name,
    yearBuilt: h.yearBuilt,
    yearBuiltApprox: h.yearBuiltApprox,
    style: JSON.parse(h.style),
    materials: JSON.parse(h.materials),
    description: h.description,
    architecturalNotes: h.architecturalNotes,
    sourceReferences: JSON.parse(h.sourceReferences),
    status: h.status,
    featured: h.featured,
    architects: h.architects.map((ha) => ({
      name: ha.architect.name,
      nationality: ha.architect.nationality,
      activePeriod: ha.architect.activePeriod,
    })),
    images: h.images.map((img) => ({
      url: img.url,
      localPath: img.localPath,
      sourceType: img.sourceType,
      sourceCitation: img.sourceCitation,
      caption: img.caption,
    })),
    awards: h.awards.map((a) => ({
      awardName: a.awardName,
      awardingBody: a.awardingBody,
      yearAwarded: a.yearAwarded,
    })),
  }))

  const today = new Date().toISOString().slice(0, 10)
  const json = JSON.stringify(data, null, 2)

  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="melbarch-export-${today}.json"`,
    },
  })
}
