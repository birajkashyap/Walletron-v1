import prisma from "@/prisma/client";

type LogTxParams = {
  type: "send" | "balance";
  chain: "ethereum" | "solana";
  to: string;
  amount: number;
  hash?: string;
  status: "success" | "error";
  userId?: string | null; // ← optional
};

export async function logTransaction(data: LogTxParams) {
  try {
    await prisma.txLog.create({
      data: {
        userId: data.userId ?? null, // ✅ enforce null if not set
        type: data.type,
        chain: data.chain,
        to: data.to,
        amount: data.amount,
        hash: data.hash,
        status: data.status,
      },
    });
  } catch (err) {
    console.error("Failed to log transaction:", err);
  }
}
