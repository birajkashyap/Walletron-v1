import { GoogleGenAI } from "@google/genai";
import { ADDRESS_BOOK } from "./addressBook";

export type ParsedIntent = {
  action: "send" | "balance" | "analytics" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
  queryType?: "top-recipient" | "biggest" | "summary" | "history";
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function parseNL(input: string): Promise<ParsedIntent> {
  const prompt = `
You are a crypto wallet parser. Convert the user command into JSON.

JSON Shape:
{
  "action": "send" | "balance" | "analytics" | "unknown",
  "chain"?: "ethereum" | "solana",
  "token"?: "ETH" | "SOL",
  "to"?: string,
  "amount"?: string,
  "note"?: string,
  "queryType"?: "top-recipient" | "biggest" | "summary" | "history"
}

Rules:
- "send", "transfer", "pay" → action = "send"
- "balance", "funds", "holdings" → action = "balance"
- "biggest", "highest", "largest" → analytics: "biggest"
- "top", "most", "frequent" → analytics: "top-recipient"
- "summary", "total", "spent" → analytics: "summary"
- "history", "transactions" → analytics: "history"
- ETH → chain = "ethereum", token = "ETH"
- SOL → chain = "solana", token = "SOL"

User Input:
"${input}"

Respond ONLY with JSON. No explanations.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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
      queryType: parsed.queryType,
    };

    // Normalize chain inference
    if (!intent.chain && intent.token === "ETH") intent.chain = "ethereum";
    if (!intent.chain && intent.token === "SOL") intent.chain = "solana";

    return intent;
  } catch (err) {
    console.error("[Gemini parse error]", err);
    return { action: "unknown" };
  }
}

/** resolves names → wallet addresses */
export function resolveRecipient(to?: string, book?: Record<string, string>) {
  if (!to) return undefined;

  const addressMap = book || ADDRESS_BOOK;

  const byName = Object.entries(addressMap).find(
    ([, name]) => name.toLowerCase() === to.toLowerCase()
  );
  if (byName) return byName[0];

  if (/^0x[a-fA-F0-9]{40}$/.test(to)) return to;
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) return to;
  if (addressMap[to]) return to;

  return to;
}
