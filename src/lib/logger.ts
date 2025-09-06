// /src/lib/logger.ts
import prisma from "@/prisma/client";

type LogTxParams = {
  type: "send" | "balance";
  chain: "ethereum" | "solana";
  to: string;
  amount: number;
  hash?: string;
  status: "success" | "error";
};

export async function logTransaction(data: LogTxParams) {
  try {
    await prisma.txLog.create({ data });
  } catch (err) {
    console.error("Failed to log transaction:", err);
  }
}
