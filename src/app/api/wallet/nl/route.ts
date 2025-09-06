// /src/app/api/wallet/nl/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseNL, resolveRecipient } from "@/lib/parse";
import { sendEth, getEthBalance } from "@/lib/ethereum";
import { sendSol, getSolBalance } from "@/lib/solana";
import { logTransaction } from "@/lib/logger";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(2),
  addressBook: z.record(z.string(), z.string()).optional(),
  defaults: z
    .object({ chain: z.enum(["ethereum", "solana"]).optional() })
    .optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { text, addressBook, defaults } = parsed.data;
  const intent = parseNL(text);

  intent.chain ??= defaults?.chain;
  if (!intent.token && intent.chain === "ethereum") intent.token = "ETH";
  if (!intent.token && intent.chain === "solana") intent.token = "SOL";

  const resolvedTo = resolveRecipient(intent.to, addressBook);

  try {
    if (intent.action === "balance") {
      const chain = intent.chain ?? "ethereum";
      const balance =
        chain === "ethereum" ? await getEthBalance() : await getSolBalance();

      await logTransaction({
        type: "balance",
        chain,
        status: "success",
      });

      return NextResponse.json({ intent, result: { chain, balance } });
    }

    if (intent.action === "send") {
      if (!intent.chain || !intent.amount || !resolvedTo) {
        return NextResponse.json(
          {
            error:
              "Missing required info to send (chain, amount, or recipient)",
            intent,
          },
          { status: 400 }
        );
      }

      const hash =
        intent.chain === "ethereum"
          ? await sendEth(resolvedTo, intent.amount)
          : await sendSol(resolvedTo, intent.amount);

      await logTransaction({
        type: "send",
        chain: intent.chain,
        to: resolvedTo,
        amount: parseFloat(intent.amount),
        hash,
        status: "success",
      });

      return NextResponse.json({
        status: "success",
        chain: intent.chain,
        hash,
        intent,
      });
    }

    return NextResponse.json(
      { error: "Unsupported or unknown intent", intent },
      { status: 400 }
    );
  } catch (e: any) {
    await logTransaction({
      type:
        intent.action === "send" || intent.action === "balance"
          ? intent.action
          : "send",

      chain: intent.chain ?? "ethereum",
      to: resolvedTo,
      amount: parseFloat(intent.amount ?? "0"),
      status: "error",
    });

    return NextResponse.json(
      {
        status: "error",
        message: e?.message ?? "Unhandled error",
        intent,
      },
      { status: 500 }
    );
  }
}
