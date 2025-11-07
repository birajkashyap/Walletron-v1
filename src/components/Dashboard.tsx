"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// ===================================
// Address Book (Kept for name enrichment)
// ===================================

const ADDRESS_BOOK: Record<string, string> = {
  "0x3568A72Dd6F5cB218DdfBdE3c1Eef2296De2a42B": "Ananya",
  RJHZiuyRadB8ei6sVX7K34dMHwWCL1vxTg47NPaCY22: "Nishant",
  "0x89C6F777c59A0833F4A4287515F792945d817B6B": "Liquidity Pool",
  "3YmCjYF2p8yA17C3jH6u8eQ1qTzW0x9E7mZk5G4V9": "Exchange Hot Wallet",
};

// --- Type Definitions ---
type Theme = "light" | "dark";
type Chain = "solana" | "ethereum";

interface Balance {
  solana: number | null;
  ethereum: number | null;
}

interface Transaction {
  id: string;
  type: string;
  chain: "solana" | "ethereum";
  to: string;
  amount: number | string;
  hash?: string;
  status: "success" | "error";
  name: string | null;
  createdAt: string;
}

type ThemeToggleProps = { theme: Theme };

// --- Utility Functions ---

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

const trimAddress = (addr: string) => {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
};

const formatAmount = (amount: number | string) => {
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(val)) return amount;
  return val.toFixed(4);
};

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch (e) {
    console.warn("SafeJson failed to parse response:", e);
    return {};
  }
};

// --- Toast Component (Animated) ---

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  const style = type === "success" ? "bg-green-500" : "bg-red-500";

  React.useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-lg z-50 text-white ${style}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      onClick={onClose}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? "✅" : "❌"} {message}
      </div>
    </motion.div>
  );
};

// --- SendCryptoModal Component (Animated) ---

// --- SendCryptoModal Component (Animated) ---

const SendCryptoModal = ({
  isVisible,
  onClose,
  onSuccessfulSend,
  isDark,
  showToast,
}: any) => {
  const [chain, setChain] = useState<Chain>("solana");
  // Renamed from inputRecipient to recipientInput for clarity on raw value
  const [recipientInput, setRecipientInput] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const inputCls = `w-full p-3 border rounded-xl ${
    isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
  }`;
  const btn = `w-full py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors`;

  const sendTx = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    const amt = parseFloat(amount);
    // Use recipientInput directly for validation
    if (!recipientInput || amt <= 0 || isNaN(amt)) {
      return showToast("Enter valid recipient and amount", "error");
    }

    if (amt > 0.001) {
      return showToast("Amount must be less than or equal to 0.001", "error");
    }

    // CRITICAL CHANGE: The 'to' field now uses the raw user input,
    // letting the backend (POST /api/wallet/send) handle name resolution.
    const to = recipientInput;

    setLoading(true);
    try {
      const r = await fetch("/api/wallet/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass the raw user input as the 'to' field
        body: JSON.stringify({ chain, to, amount: amt }),
      });

      if (!r.ok) {
        // Try to parse error message from response if available
        const errorData = await safeJson(r);
        throw new Error(errorData.error || "Send failed");
      }

      showToast("Transaction sent ✅", "success");
      await new Promise((r) => setTimeout(r, 1200));
      onSuccessfulSend();
      onClose();

      setRecipientInput("");
      setAmount("");
      setChain("solana");
    } catch (err: any) {
      showToast(
        err.message || "An unknown error occurred during send.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`p-8 rounded-2xl w-full max-w-md ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Send Crypto</h2>
        <form onSubmit={sendTx} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Chain</label>
            <select
              className={inputCls}
              value={chain}
              onChange={(e) => setChain(e.target.value as Chain)}
              disabled={loading}
            >
              <option value="solana">Solana (SOL)</option>
              <option value="ethereum">Ethereum (ETH)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Send to (Name or Address)
            </label>
            <input
              className={inputCls}
              placeholder="Recipient Address or Name (e.g., Ananya)"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Amount</label>
            <input
              className={inputCls}
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className={`${btn} bg-blue-600 hover:bg-blue-700 text-white`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            className={`${btn} ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Main Dashboard Component ---

const Dashboard = ({ theme }: ThemeToggleProps) => {
  const isDark = theme === "dark";

  const [balances, setBalances] = useState<Balance>({
    solana: null,
    ethereum: null,
  });
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loadBal, setLoadBal] = useState(false);
  const [loadTx, setLoadTx] = useState(false);
  const [txErr, setTxErr] = useState("");
  const [balErr, setBalErr] = useState("");
  const [modal, setModal] = useState(false);

  const [toast, setToast] = useState<any>(null);
  const showToast = useCallback(
    (m: string, t: "success" | "error") => setToast({ message: m, type: t }),
    []
  );

  // API Call: Fetch Balances (FIXED: Uses GET with query params)
  const fetchBalances = useCallback(async () => {
    setLoadBal(true);
    setBalErr("");
    try {
      // FIX: Changed method from POST to GET and used query parameters
      const [solRes, ethRes] = await Promise.all([
        fetch(`/api/wallet/balance?chain=solana`),
        fetch(`/api/wallet/balance?chain=ethereum`),
      ]);

      const sd = await safeJson(solRes);
      const ed = await safeJson(ethRes);

      if (!solRes.ok || !ethRes.ok)
        throw new Error(
          "Backend responded with an error for one or more chains."
        );

      setBalances({
        // Ensure to handle null/undefined if safeJson returns empty object
        solana: Number(sd.balance ?? 0) || null,
        ethereum: Number(ed.balance ?? 0) || null,
      });

      showToast("Balances refreshed", "success");
    } catch (error: any) {
      setBalErr(error.message || "Failed to fetch balances");
      setBalances({ solana: null, ethereum: null });
      showToast("Failed to refresh balances", "error");
    } finally {
      setLoadBal(false);
    }
  }, [showToast]);

  // API Call: Fetch Transactions (Stable, already uses GET)
  const fetchTx = useCallback(async () => {
    setLoadTx(true);
    setTxErr("");
    try {
      const r = await fetch("/api/tx/list");
      if (!r.ok) throw new Error("Failed to fetch transactions (HTTP Error).");
      const d = await r.json();

      const enrichedTxs = d.txs.map((tx: any) => ({
        ...tx,
        name: ADDRESS_BOOK[tx.to] || null,
      })) as Transaction[];

      setTransactions(enrichedTxs);
    } catch (error: any) {
      setTxErr(error.message || "Failed to fetch transactions");
      setTransactions(null);
    } finally {
      setLoadTx(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchBalances();
    fetchTx();
  }, [fetchBalances, fetchTx]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const SOL = 71.69,
    ETH = 2667.09;
  const TOTAL = useMemo(
    () => (balances.solana || 0) * SOL + (balances.ethereum || 0) * ETH,
    [balances]
  );

  const StatusDisplay = ({ status }: { status: "success" | "error" }) => {
    const color =
      status === "success"
        ? isDark
          ? "text-green-400"
          : "text-green-600"
        : isDark
        ? "text-red-400"
        : "text-red-600";
    return (
      <span className={`text-xs ${color}`}>
        {status === "success" ? "Completed" : "Failed"}
      </span>
    );
  };

  // --- Tailwind Classes and Framer Motion Variants (Unchanged) ---
  const card = `rounded-2xl p-6 ${isDark ? "bg-gray-900" : "bg-white"}`;
  const total = `rounded-2xl p-6 ${
    isDark ? "bg-blue-600" : "bg-blue-500"
  } text-white flex flex-col`;
  const token = `rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-gray-200"}`;
  const btn1 = `px-4 py-2 rounded-xl font-semibold transition-colors ${
    isDark
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`;
  const btn2 = `px-4 py-2 rounded-xl font-semibold transition-colors ${
    isDark
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
  }`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title Section */}
      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-4xl font-bold">My Dashboard</h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          See your transactions
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex gap-4 flex-wrap" variants={itemVariants}>
        <button className={btn1} onClick={() => setModal(true)}>
          Send Crypto
        </button>
        <button className={btn2} onClick={fetchBalances} disabled={loadBal}>
          {loadBal ? "Refreshing..." : "Refresh Balance"}
        </button>
        <button className={btn2} onClick={fetchTx} disabled={loadTx}>
          {loadTx ? "Loading..." : "Refresh Transactions"}
        </button>
      </motion.div>

      {/* Balances Grid */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div className={total} variants={itemVariants}>
          <span>Total Balance</span>
          <strong className="text-3xl">
            {TOTAL.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
          {balErr && <p className="text-xs text-red-200 mt-2">{balErr}</p>}
        </motion.div>
        <motion.div className={token} variants={itemVariants}>
          <div className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Solana
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {balances.solana?.toFixed(2) ?? "---"} SOL
          </div>
        </motion.div>
        <motion.div className={token} variants={itemVariants}>
          <div className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Ethereum
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {balances.ethereum?.toFixed(4) ?? "---"} ETH
          </div>
        </motion.div>
      </motion.div>

      {/* TX List Card */}
      <motion.div className={card} variants={itemVariants}>
        <div className="flex justify-between mb-4">
          <strong
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Recent Transactions
          </strong>
        </div>

        {loadTx && <p className="text-center py-4">Loading...</p>}
        {txErr && <p className="text-red-500 text-center py-4">{txErr}</p>}

        {!loadTx && !txErr && transactions && transactions.length > 0 && (
          <motion.ul className="space-y-3" variants={containerVariants}>
            {transactions.map((tx) => (
              <motion.li
                key={tx.id}
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <div>
                  <div
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tx.type}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(tx.createdAt)} → {trimAddress(tx.to)}
                    {tx.name && (
                      <span className="ml-2 text-xs text-blue-400">
                        ({tx.name})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatAmount(tx.amount)}{" "}
                    {tx.chain === "solana" ? "SOL" : "ETH"}
                  </div>
                  <StatusDisplay status={tx.status} />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
        {!loadTx && !txErr && transactions?.length === 0 && (
          <p className="text-center py-4 text-gray-400">
            No recent transactions.
          </p>
        )}
      </motion.div>

      {/* modal */}
      {modal && (
        <SendCryptoModal
          isVisible={modal}
          onClose={() => setModal(false)}
          onSuccessfulSend={refreshAll}
          isDark={isDark}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </motion.div>
  );
};

export default Dashboard;
