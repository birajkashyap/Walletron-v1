// /src/app/api/wallet/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEthBalance } from "@/lib/ethereum";
import { getSolBalance } from "@/lib/solana";
import { z } from "zod";

const BalanceQuery = z.object({
  chain: z.enum(["ethereum", "solana"]),
  address: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get("chain");
  const address = searchParams.get("address") ?? undefined;

  const result = BalanceQuery.safeParse({ chain, address });
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  try {
    const { chain: parsedChain, address: parsedAddress } = result.data;

    const balance =
      parsedChain === "ethereum"
        ? await getEthBalance(parsedAddress)
        : await getSolBalance(parsedAddress);

    return NextResponse.json({
      chain: parsedChain,
      address: parsedAddress,
      balance,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
