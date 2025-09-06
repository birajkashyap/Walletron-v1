import { ethers } from "ethers";

const ETH_RPC_URL = process.env.ETH_RPC_URL;
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

if (!ETH_RPC_URL || !ETH_PRIVATE_KEY) {
  throw new Error("Missing ETH_RPC_URL or ETH_PRIVATE_KEY in environment");
}

const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const wallet = new ethers.Wallet(ETH_PRIVATE_KEY, provider);

export async function getEthBalance(address?: string) {
  const bal = await provider.getBalance(address ?? wallet.address);
  return ethers.formatEther(bal);
}

export async function sendEth(to: string, amount: string) {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  return tx.hash;
}
