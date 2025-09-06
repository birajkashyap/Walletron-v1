import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(process.env.SOLANA_RPC_URL!, "confirmed");
const secretKey = Uint8Array.from(
  Buffer.from(process.env.SOLANA_SECRET_KEY_B64!, "base64")
);
const keypair = Keypair.fromSecretKey(secretKey);

export async function getSolBalance(address?: string) {
  const pub = new PublicKey(address ?? keypair.publicKey);
  const bal = await connection.getBalance(pub);
  return (bal / LAMPORTS_PER_SOL).toString();
}

export async function sendSol(to: string, amount: string) {
  const toPub = new PublicKey(to);
  const ix = SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: toPub,
    lamports: Math.round(Number(amount) * LAMPORTS_PER_SOL),
  });
  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [keypair]);
  return sig;
}
