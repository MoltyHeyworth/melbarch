export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  await prisma.image.delete({ where: { id: params.imageId } });
  return NextResponse.json({ ok: true });
}
