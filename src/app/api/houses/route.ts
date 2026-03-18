export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q")?.trim() || "";
  const suburb = sp.get("suburb")?.trim() || "";
  const architect = sp.get("architect")?.trim() || "";
  const style = sp.get("style")?.trim() || "";
  const status = sp.get("status")?.trim() || "";
  const featured = sp.get("featured");
  const yearMin = sp.get("yearMin") ? parseInt(sp.get("yearMin")!) : undefined;
  const yearMax = sp.get("yearMax") ? parseInt(sp.get("yearMax")!) : undefined;
  const sort = sp.get("sort") || "added_newest";
  const page = Math.max(1, parseInt(sp.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "24")));

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  const AND: unknown[] = [];

  if (q) {
    AND.push({
      OR: [
        { address: { contains: q } },
        { suburb: { contains: q } },
        { name: { contains: q } },
        { description: { contains: q } },
        { architecturalNotes: { contains: q } },
      ],
    });
  }

  if (suburb) {
    AND.push({ suburb: { contains: suburb } });
  }

  if (architect) {
    AND.push({
      architects: {
        some: {
          architect: {
            name: { contains: architect },
          },
        },
      },
    });
  }

  if (status) {
    AND.push({ status });
  }

  if (featured === "true") {
    AND.push({ featured: true });
  }

  if (yearMin !== undefined && !isNaN(yearMin)) {
    AND.push({ yearBuilt: { gte: yearMin } });
  }

  if (yearMax !== undefined && !isNaN(yearMax)) {
    AND.push({ yearBuilt: { lte: yearMax } });
  }

  if (AND.length > 0) {
    where.AND = AND;
  }

  // Get total
  const total = await prisma.house.count({ where });

  // Sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "year_asc":
      orderBy = { yearBuilt: "asc" };
      break;
    case "year_desc":
      orderBy = { yearBuilt: "desc" };
      break;
    case "suburb_az":
      orderBy = { suburb: "asc" };
      break;
    case "added_newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const houses = await prisma.house.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      architects: {
        include: { architect: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  // Filter by style post-query (JSON field)
  let filtered = houses;
  if (style) {
    const styleLower = style.toLowerCase();
    filtered = filtered.filter((h) => {
      try {
        const styles: string[] = JSON.parse(h.style);
        return styles.some((s) => s.toLowerCase().includes(styleLower));
      } catch {
        return false;
      }
    });
  }

  const cards = filtered.map((h) => {
    let styleArr: string[] = [];
    try {
      styleArr = JSON.parse(h.style);
    } catch {
      /* empty */
    }

    const primaryImage = h.images[0]
      ? {
          url: h.images[0].url,
          localPath: h.images[0].localPath,
          sourceCitation: h.images[0].sourceCitation,
        }
      : null;

    return {
      id: h.id,
      address: h.address,
      suburb: h.suburb,
      name: h.name,
      yearBuilt: h.yearBuilt,
      status: h.status,
      featured: h.featured,
      architectNames: h.architects.map((a) => a.architect.name),
      styleArr,
      primaryImage,
    };
  });

  const pages = Math.ceil(total / limit);

  return NextResponse.json({ houses: cards, total, page, pages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    address,
    suburb,
    postcode,
    name,
    yearBuilt,
    yearBuiltApprox,
    architectureFirm,
    style,
    materials,
    bedrooms,
    landSizeSqm,
    floorAreaSqm,
    description,
    architecturalNotes,
    sourceReferences,
    ownerContact,
    myNotes,
    status,
    featured,
    architectNames,
  } = body;

  if (!address || !suburb || !yearBuilt) {
    return NextResponse.json(
      { error: "address, suburb, and yearBuilt are required" },
      { status: 400 }
    );
  }

  // Normalise suburb to Title Case
  const normSuburb = suburb
    .trim()
    .split(" ")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const house = await prisma.house.create({
    data: {
      address: address.trim(),
      suburb: normSuburb,
      postcode: postcode || null,
      name: name || null,
      yearBuilt: parseInt(yearBuilt),
      yearBuiltApprox: yearBuiltApprox || false,
      architectureFirm: architectureFirm || null,
      style: JSON.stringify(style || []),
      materials: JSON.stringify(materials || []),
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      landSizeSqm: landSizeSqm ? parseFloat(landSizeSqm) : null,
      floorAreaSqm: floorAreaSqm ? parseFloat(floorAreaSqm) : null,
      description: description || null,
      architecturalNotes: architecturalNotes || null,
      sourceReferences: JSON.stringify(sourceReferences || []),
      ownerContact: ownerContact || null,
      myNotes: myNotes || null,
      status: status || "UNREVIEWED",
      featured: featured || false,
    },
  });

  // Handle architects
  if (architectNames && Array.isArray(architectNames)) {
    for (const archName of architectNames) {
      const trimmed = archName.trim();
      if (!trimmed) continue;
      const architect = await prisma.architect.upsert({
        where: { name: trimmed },
        update: {},
        create: { name: trimmed },
      });
      await prisma.houseArchitect.create({
        data: { houseId: house.id, architectId: architect.id },
      });
    }
  }

  return NextResponse.json(house, { status: 201 });
}
