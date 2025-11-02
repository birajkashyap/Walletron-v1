import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { ADDRESS_BOOK } from "@/lib/addressBook";

export async function GET() {
  const result = await prisma.txLog.groupBy({
    by: ["to"],
    _count: { to: true },
    orderBy: { _count: { to: "desc" } },
    take: 1,
  });

  if (!result || result.length === 0) {
    return NextResponse.json({ message: "No transactions yet" });
  }

  const top = result[0];
  const address = top.to;
  const count = top._count.to;

  // ✅ get name from ADDRESS_BOOK or fallback to the raw address
  const name = ADDRESS_BOOK[address] ?? address;

  return NextResponse.json({
    address,
    name,
    count,
  });
}
