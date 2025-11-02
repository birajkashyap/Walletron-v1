import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await prisma.txLog.groupBy({
    by: ["chain"],
    _count: { chain: true },
    orderBy: { _count: { chain: "desc" } },
    take: 1,
  });

  if (!result.length) return NextResponse.json({ msg: "No data" });

  return NextResponse.json({
    chain: result[0].chain,
    count: result[0]._count.chain,
  });
}
