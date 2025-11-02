import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { ADDRESS_BOOK } from "@/lib/addressBook";

export async function GET() {
  const txs = await prisma.txLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const mapped = txs.map((tx) => ({
    type: tx.type,
    chain: tx.chain,
    amount: tx.amount,
    hash: tx.hash,
    address: tx.to,
    name: ADDRESS_BOOK[tx.to] ?? tx.to,
    createdAt: tx.createdAt,
  }));

  return NextResponse.json(mapped);
}
