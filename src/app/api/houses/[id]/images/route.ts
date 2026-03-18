export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { url, localPath, sourceType, sourceCitation, caption, sortOrder } = body;

  if (!sourceCitation) {
    return NextResponse.json({ error: "sourceCitation is required" }, { status: 400 });
  }

  const image = await prisma.image.create({
    data: {
      houseId: params.id,
      url: url || null,
      localPath: localPath || null,
      sourceType: sourceType || "OTHER",
      sourceCitation,
      caption: caption || null,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
