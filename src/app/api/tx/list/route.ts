// src/app/api/tx/list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ADDRESS_BOOK } from "@/lib/addressBook";

export async function GET() {
  try {
    const txs = await prisma.txLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const enriched = txs.map((tx) => ({
      ...tx,
      name: ADDRESS_BOOK[tx.to] ?? null, // map address to name if exists
    }));

    return NextResponse.json({
      success: true,
      txs: enriched,
    });
  } catch (err) {
    console.error("Tx fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
