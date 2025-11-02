import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { ADDRESS_BOOK } from "@/lib/addressBook";

export async function GET() {
  const tx = await prisma.txLog.findFirst({
    orderBy: { amount: "desc" },
  });

  if (!tx) return NextResponse.json({ message: "No transactions" });

  return NextResponse.json({
    hash: tx.hash,
    chain: tx.chain,
    address: tx.to,
    name: ADDRESS_BOOK[tx.to] ?? tx.to,
    amount: tx.amount,
  });
}
