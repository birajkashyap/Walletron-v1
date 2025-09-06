// src/lib/parse.ts

export type ParsedIntent = {
  action: "send" | "balance" | "unknown";
  chain?: "ethereum" | "solana";
  token?: "ETH" | "SOL";
  to?: string;
  amount?: string; // decimal as string
  note?: string;
};

export type AddressBook = Record<string, string>; // e.g., { "Alice": "0xabc..." }

const CHAIN_HINTS: Record<"ethereum" | "solana", RegExp[]> = {
  ethereum: [/\beth(ereum)?\b/i],
  solana: [/\bsol(ana)?\b/i],
};

export function parseNL(input: string): ParsedIntent {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. action
  let action: ParsedIntent["action"] = /(send|transfer|pay)\b/i.test(text)
    ? "send"
    : /(balance|how much|holdings|funds)\b/i.test(text)
    ? "balance"
    : "unknown";

  // 2. chain inference
  let chain: ParsedIntent["chain"] | undefined;
  if (CHAIN_HINTS.ethereum.some((r) => r.test(text))) chain = "ethereum";
  if (CHAIN_HINTS.solana.some((r) => r.test(text))) chain = "solana";

  // 3. token inference (also sets chain)
  let token: ParsedIntent["token"] | undefined;
  if (/\beth\b/i.test(text)) {
    token = "ETH";
    chain ??= "ethereum";
  }
  if (/\bsol\b/i.test(text)) {
    token = "SOL";
    chain ??= "solana";
  }

  // 4. amount extraction (e.g., "0.5 ETH", "send 2 sol")
  const mAmt = text.match(/(\d+(?:[.,]\d+)?)(?=\s*(eth|sol|\b))/i);
  const amount = mAmt ? mAmt[1].replace(",", ".") : undefined;

  // 5. recipient address or name (after "to <...>")
  const mTo = text.match(/\bto\s+([^\s,\.]+)\b/i);
  const to = mTo ? mTo[1] : undefined;

  // 6. note (optional) — after "for", "because", or "note"
  const mNote = lower.match(/\b(?:for|because|note)\s+(.+)$/i);
  const note = mNote ? mNote[1] : undefined;

  // Fallback: if token present but amount missing (e.g., "send .5 eth")
  if (!amount) {
    const m = text.match(/\b(eth|sol)\b/i);
    if (m && /\b(\d*[.,]?\d+)\b/.test(text)) {
      const n = text.match(/\b(\d*[.,]?\d+)\b/);
      if (n) {
        const num = n[1]!.replace(",", ".");
        return { action, chain, token, to, amount: num, note };
      }
    }
  }

  return { action, chain, token, to, amount, note };
}

// --------------------------------------------
// Optional: Resolve named users via addressBook
// --------------------------------------------
export function resolveRecipient(
  to: string | undefined,
  addressBook?: AddressBook
): string | undefined {
  if (!to) return undefined;

  // If it's a valid ETH address (0x...)
  if (/^0x[a-fA-F0-9]{40}$/.test(to)) return to;

  // Solana (base58) heuristic
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(to)) return to;

  // Name resolution
  if (addressBook && addressBook[to]) return addressBook[to];

  return to; // fallback (let blockchain SDKs fail if needed)
}
