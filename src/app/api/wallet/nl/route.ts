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
  const parsedBody = BodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.message },
      { status: 400 }
    );
  }

  const { text, addressBook, defaults } = parsedBody.data;

  // ✅ parse NL into intent
  const intent = await parseNL(text);

  // defaults
  intent.chain ??= defaults?.chain;
  if (!intent.token && intent.chain === "ethereum") intent.token = "ETH";
  if (!intent.token && intent.chain === "solana") intent.token = "SOL";

  const resolvedTo = resolveRecipient(intent.to, addressBook);

  try {
    // ✅ ANALYTICS HANDLING -------------------------------------------
    if (intent.action === "analytics") {
      const { nextUrl } = req;
      const base = `${nextUrl.protocol}//${nextUrl.host}`;

      const endpoints: Record<string, string> = {
        "top-recipient": "/api/tx/top-recipient",
        biggest: "/api/tx/biggest",
        summary: "/api/tx/summary",
        history: "/api/tx/history",
      };

      const path = intent.queryType ? endpoints[intent.queryType] : null;

      if (!path) {
        return NextResponse.json(
          { error: "Unknown analytics query", intent },
          { status: 400 }
        );
      }

      const url = `${base}${path}`;
      const result = await fetch(url).then((r) => r.json());

      return NextResponse.json({ intent, result });
    }

    // ✅ BALANCE -------------------------------------------------------
    if (intent.action === "balance") {
      const chain = intent.chain ?? "ethereum";
      const balance =
        chain === "ethereum" ? await getEthBalance() : await getSolBalance();

      await logTransaction({
        type: "balance",
        chain,
        status: "success",
        to: "self",
        amount: 0,
        hash: "",
      });

      return NextResponse.json({ intent, result: { chain, balance } });
    }

    // ✅ SEND -----------------------------------------------------------
    if (intent.action === "send") {
      if (!intent.chain || !intent.amount || !resolvedTo) {
        return NextResponse.json(
          { error: "Missing chain, amount or recipient", intent },
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

    // ❓ Unknown intent
    return NextResponse.json(
      { error: "Unsupported or unknown intent", intent },
      { status: 400 }
    );
  } catch (err: any) {
    await logTransaction({
      type: intent.action === "send" ? "send" : "balance",
      chain: intent.chain ?? "ethereum",
      to: resolvedTo ?? "unknown",
      amount: parseFloat(intent.amount ?? "0"),
      hash: "",
      status: "error",
    });

    return NextResponse.json(
      { status: "error", message: err?.message ?? "Unhandled error", intent },
      { status: 500 }
    );
  }
}
