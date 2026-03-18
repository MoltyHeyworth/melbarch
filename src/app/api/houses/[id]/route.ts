export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const house = await prisma.house.findUnique({
    where: { id: params.id },
    include: {
      architects: { include: { architect: true } },
      images: { orderBy: { sortOrder: "asc" } },
      awards: true,
    },
  });

  if (!house) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(house);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  // Handle architect updates separately
  const { architectNames, ...data } = body;

  // Normalise suburb if provided
  if (data.suburb) {
    data.suburb = data.suburb
      .trim()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // Stringify array fields if provided as arrays
  if (Array.isArray(data.style)) data.style = JSON.stringify(data.style);
  if (Array.isArray(data.materials)) data.materials = JSON.stringify(data.materials);
  if (Array.isArray(data.sourceReferences)) data.sourceReferences = JSON.stringify(data.sourceReferences);

  // Parse numeric fields
  if (data.yearBuilt !== undefined) data.yearBuilt = parseInt(data.yearBuilt);
  if (data.bedrooms !== undefined) data.bedrooms = data.bedrooms ? parseInt(data.bedrooms) : null;
  if (data.landSizeSqm !== undefined) data.landSizeSqm = data.landSizeSqm ? parseFloat(data.landSizeSqm) : null;
  if (data.floorAreaSqm !== undefined) data.floorAreaSqm = data.floorAreaSqm ? parseFloat(data.floorAreaSqm) : null;

  const house = await prisma.house.update({
    where: { id: params.id },
    data,
  });

  // Update architects if provided
  if (architectNames && Array.isArray(architectNames)) {
    // Remove existing links
    await prisma.houseArchitect.deleteMany({ where: { houseId: params.id } });
    // Add new links
    for (const archName of architectNames) {
      const trimmed = archName.trim();
      if (!trimmed) continue;
      const architect = await prisma.architect.upsert({
        where: { name: trimmed },
        update: {},
        create: { name: trimmed },
      });
      await prisma.houseArchitect.create({
        data: { houseId: params.id, architectId: architect.id },
      });
    }
  }

  return NextResponse.json(house);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.house.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
