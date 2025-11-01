// src/lib/parse.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ADDRESS_BOOK } from "./addressBook";

export type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseNL(input: string): Promise<ParsedIntent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Parse this crypto wallet command into JSON:

type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
};

Rules:
- Transfer/Send/Pay -> "send"
- Balance/holdings/funds -> "balance"
- ETH => chain: "ethereum", token: "ETH"
- SOL => chain: "solana", token: "SOL"
- Respond ONLY with JSON. No comments.

User input: "${input}"
`;

  try {
    const res = await model.generateContent(prompt);
    const raw = res.response.text();

    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json);

    // ✅ normalize and infer safely
    const intent: ParsedIntent = {
      action: parsed.action?.toLowerCase() || "unknown",
      chain: parsed.chain,
      token: parsed.token,
      to: parsed.to,
      amount: parsed.amount,
      note: parsed.note,
    };

    // Fallback logic
    if (!intent.chain && intent.token === "ETH") intent.chain = "ethereum";
    if (!intent.chain && intent.token === "SOL") intent.chain = "solana";

    return intent;
  } catch (err) {
    console.error("[Gemini parse error]", err);
    return { action: "unknown" };
  }
}

export function resolveRecipient(to?: string) {
  if (!to) return undefined;

  // If "Ananya" → find address by name
  const byName = Object.entries(ADDRESS_BOOK).find(
    ([, name]) => name.toLowerCase() === to.toLowerCase()
  );
  if (byName) return byName[0];

  //  If already a valid wallet address
  if (/^0x[a-fA-F0-9]{40}$/.test(to)) return to;
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) return to;

  // ❗ If user enters address that happens to match a KEY in map
  if (ADDRESS_BOOK[to]) return to;

  // ❓ unknown → return raw (frontend will confirm)
  return to;
}
