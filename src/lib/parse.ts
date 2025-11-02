// src/lib/parse.ts
import { GoogleGenAI } from "@google/genai";
import { ADDRESS_BOOK } from "./addressBook";

export type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function parseNL(input: string): Promise<ParsedIntent> {
  const prompt = `
You are a crypto wallet parser. Convert the user command into JSON.

Type:
{
  "action": "send" | "balance" | "unknown",
  "chain"?: "ethereum" | "solana",
  "token"?: "ETH" | "SOL",
  "to"?: string,
  "amount"?: string,
  "note"?: string
}

Rules:
- send / transfer / pay → "send"
- balance / holdings → "balance"
- ETH → ethereum
- SOL → solana
- Respond ONLY with JSON.

User: "${input}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "{}";

    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json);

    const intent: ParsedIntent = {
      action: parsed.action?.toLowerCase() || "unknown",
      chain: parsed.chain,
      token: parsed.token,
      to: parsed.to,
      amount: parsed.amount,
      note: parsed.note,
    };

    if (!intent.chain && intent.token === "ETH") intent.chain = "ethereum";
    if (!intent.chain && intent.token === "SOL") intent.chain = "solana";

    return intent;
  } catch (err) {
    console.error("[Gemini parse error]", err);
    return { action: "unknown" };
  }
}

export function resolveRecipient(to?: string, book?: Record<string, string>) {
  if (!to) return undefined;
  const map = book || ADDRESS_BOOK;

  const match = Object.entries(map).find(
    ([, name]) => name.toLowerCase() === to.toLowerCase()
  );
  if (match) return match[0];

  if (/^0x[a-fA-F0-9]{40}$/.test(to)) return to;
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) return to;
  if (map[to]) return to;

  return to;
}
