import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.txLog.groupBy({
    by: ["chain"],
    _sum: { amount: true },
    _count: { chain: true },
  });

  return NextResponse.json(
    data.map((row) => ({
      chain: row.chain,
      totalAmount: row._sum.amount || 0,
      totalTx: row._count.chain,
    }))
  );
}
