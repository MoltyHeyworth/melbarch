export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { awardName, awardingBody, yearAwarded, notes } = body;

  if (!awardName) {
    return NextResponse.json({ error: "awardName is required" }, { status: 400 });
  }

  const award = await prisma.award.create({
    data: {
      houseId: params.id,
      awardName,
      awardingBody: awardingBody || null,
      yearAwarded: yearAwarded ? parseInt(yearAwarded) : null,
      notes: notes || null,
    },
  });

  return NextResponse.json(award, { status: 201 });
}
