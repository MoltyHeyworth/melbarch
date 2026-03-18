export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
      styleArr: JSON.parse(h.style),
      primaryImage: primaryImage
        ? {
            url: primaryImage.url,
            localPath: primaryImage.localPath,
            sourceCitation: primaryImage.sourceCitation,
          }
        : null,
    }
  })

  return NextResponse.json({
    id: architect.id,
    name: architect.name,
    altNames: JSON.parse(architect.altNames),
    biography: architect.biography,
    website: architect.website,
    nationality: architect.nationality,
    activePeriod: architect.activePeriod,
    houses: houseCards,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const allowedFields = ['biography', 'website', 'nationality', 'activePeriod']
  const data: Record<string, string | null> = {}
  for (const key of allowedFields) {
    if (key in body) {
      data[key] = body[key]
    }
  }

  const updated = await prisma.architect.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}
