export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; awardId: string } }
) {
  await prisma.award.delete({ where: { id: params.awardId } });
  return NextResponse.json({ ok: true });
}
