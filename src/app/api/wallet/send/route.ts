import { NextRequest, NextResponse } from "next/server";
import { sendEth } from "@/lib/ethereum";
import { sendSol } from "@/lib/solana";
import { logTransaction } from "@/lib/logger";
import { resolveRecipient } from "@/lib/parse";
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

  // ✅ Resolve (Name → Address OR raw address)
  const resolvedTo = resolveRecipient(to);

  // ✅ Type guard
  if (!resolvedTo || typeof resolvedTo !== "string") {
    return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
  }

  try {
    // ✅ Actual send
    const txHash =
      chain === "ethereum"
        ? await sendEth(resolvedTo, amount.toString())
        : await sendSol(resolvedTo, amount.toString());

    await logTransaction({
      type: "send",
      chain,
      to: resolvedTo,
      amount,
      hash: txHash,
      status: "success",
    });

    return NextResponse.json({ status: "success", chain, hash: txHash });
  } catch (e: any) {
    await logTransaction({
      type: "send",
      chain,
      to: resolvedTo,
      amount,
      status: "error",
    });

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
