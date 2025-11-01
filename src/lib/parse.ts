// src/lib/parse.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

export type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
};

export type AddressBook = Record<string, string>;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Uses Gemini API to parse natural language into structured JSON intent.
 */
export async function parseNL(input: string): Promise<ParsedIntent> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an assistant that converts natural language cryptocurrency commands 
into a structured JSON object following this TypeScript type:

type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string;
  note?: string;
};

Rules:
- If the user asks to transfer, send, or pay, action = "send".
- If the user asks for balance, holdings, or funds, action = "balance".
- Infer chain based on mentioned token ("ETH" => ethereum, "SOL" => solana).
- Return "unknown" if unsure.
- Respond only with valid JSON, no explanations.

Now parse this input:
"${input}"
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean and safely parse
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");
    const jsonString = response.slice(jsonStart, jsonEnd + 1);

    const parsed: ParsedIntent = JSON.parse(jsonString);

    return parsed;
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return { action: "unknown" };
  }
}

/**
 * Resolves names to addresses, same as before.
 */
export function resolveRecipient(
  to: string | undefined,
  addressBook?: AddressBook
): string | undefined {
  if (!to) return undefined;

  if (/^0x[a-fA-F0-9]{40}$/.test(to)) return to; // Ethereum
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) return to; // Solana
  if (addressBook && addressBook[to]) return addressBook[to];

  return to;
}
