import { NextRequest, NextResponse } from "next/server";
import { sendEth } from "@/lib/ethereum";
import { sendSol } from "@/lib/solana";
import { logTransaction } from "@/lib/logger";
import { z } from "zod";

const SendSchema = z.object({
  chain: z.enum(["ethereum", "solana"]),
  to: z.string(),
  amount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = SendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { chain, to, amount } = parsed.data;

  try {
    const txHash =
      chain === "ethereum"
        ? await sendEth(to, amount.toString())
        : await sendSol(to, amount.toString());

    await logTransaction({
      type: "send",
      chain,
      to,
      amount,
      hash: txHash,
      status: "success",
    });

    return NextResponse.json({ status: "success", chain, hash: txHash });
  } catch (e: any) {
    await logTransaction({
      type: "send",
      chain,
      to,
      amount,
      status: "error",
    });

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
