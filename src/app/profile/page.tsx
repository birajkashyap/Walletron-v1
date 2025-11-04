"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  EyeOff,
  Key,
  Mail,
  User,
  Sun,
  Moon,
  Loader2,
  ArrowRight,
} from "lucide-react";

// --- Theme Definition (Walletron Design System) ---
interface ThemeColors {
  background: string;
  cardBg: string;
  subCardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
}

// Global Walletron Accent Color
const ACCENT_COLOR = "text-[#2962ff]";
const ACCENT_BG = "bg-[#2962ff]";

const darkTheme: ThemeColors = {
  background: "bg-[#0b0f19]",
  cardBg: "bg-[#121212]",
  subCardBg: "bg-[#1e1e1e]",
  textPrimary: "text-[#e5e7eb]",
  textSecondary: "text-[#9ca3af]",
  borderColor: "border-[#374151]",
};

const lightTheme: ThemeColors = {
  background: "bg-gray-50",
  cardBg: "bg-white",
  subCardBg: "bg-gray-100",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-500",
  borderColor: "border-gray-300",
};

// --- Mock Data & Types ---

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
}

const fallbackUser: UserData = {
  firstname: "Biraj",
  lastname: "Kashyap",
  email: "biraj@example.com",
};

const walletData = [
  {
    chain: "Ethereum",
    publicAddress: "0x3568A72Dd6F5cB218DdfBdE3c1Eef2296De2a42B",
    privateKey:
      "0xfc8f544696ef19ec926a238645f7acc4ca4298528d7db6a60c07aeb2b8c2a78c",
    accentColor: "text-violet-500",
    borderColor: "border-violet-500/50",
  },
  {
    chain: "Solana",
    publicAddress: "RJHZiuyRadB8ei6sVX7K34dMHwWCL1vxTg47NPaCY22",
    privateKey:
      "h2SEeuUUXTMJ3t1cZozyKkSPrIgArJgLz+JAqbF4nucgweKi4tXCwwkH97YafIHlPdyUoZiQ/Eu/1lTfTKPKwQ==",
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-500/50",
  },
];

// --- Utility Functions ---

const maskKey = (key: string): string => {
  if (key.length <= 10) return "••••••••••";
  const start = key.substring(0, 6);
  const end = key.substring(key.length - 4);
  // Calculate mask length
  const mask = "•".repeat(Math.max(0, key.length - 10));
  return `${start}${mask}${end}`;
};

// --- Toast Component (Replaces Alert) ---

interface CopyToastProps {
  message: string;
}

const CopyToast: React.FC<CopyToastProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.3 }}
    className="fixed top-4 right-4 p-3 rounded-lg shadow-xl z-50 text-sm font-semibold bg-green-600 text-white"
  >
    {message}
  </motion.div>
);

// --- Sub-Components ---

interface WalletCardProps {
  wallet: (typeof walletData)[0];
  delay: number;
  theme: ThemeColors;
  onCopySuccess: (chain: string) => void; // Function to trigger the success toast
}

const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  delay,
  theme,
  onCopySuccess,
}) => {
  const [showPrivate, setShowPrivate] = useState(false);
  const maskedKey = maskKey(wallet.privateKey);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const shadowClass =
    theme === darkTheme
      ? "shadow-xl shadow-black/30 hover:shadow-violet-500/10"
      : "shadow-lg shadow-gray-200 hover:shadow-violet-200";

  const handleCopy = () => {
    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = wallet.publicAddress;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        // Using document.execCommand('copy') for better compatibility in sandbox/iframe environments
        document.execCommand("copy");
        onCopySuccess(wallet.chain);
      } catch (err) {
        console.error("Copy failed:", err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: delay }}
      className={`p-6 rounded-2xl border ${wallet.borderColor} ${theme.cardBg} ${theme.textPrimary} transition-all duration-500 ${shadowClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${wallet.accentColor}`}>
          {wallet.chain} Wallet
        </h3>
        <Key size={20} className={wallet.accentColor} />
      </div>

      <div className="space-y-4 text-sm">
        {/* Public Address */}
        <div className={`flex flex-col p-3 rounded-xl ${theme.subCardBg}`}>
          <label className={`${theme.textSecondary} font-medium mb-1`}>
            Public Address
          </label>
          <div className="flex items-center space-x-2">
            <span
              className={`font-mono ${theme.textPrimary} text-xs sm:text-sm truncate w-full`}
            >
              {wallet.publicAddress}
            </span>
            <button
              onClick={handleCopy}
              className={`${
                theme.textSecondary
              } hover:${wallet.accentColor.replace(
                "text-",
                "text-"
              )} transition`}
              title={`Copy ${wallet.chain} Public Address`}
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Private Key (Masked/Unmasked) */}
        <div className={`flex flex-col p-3 rounded-xl ${theme.subCardBg}`}>
          <label className={`${theme.textSecondary} font-medium mb-1`}>
            Private Key (Demo)
          </label>
          <div className="flex items-center space-x-2">
            <span
              className={`font-mono ${theme.textPrimary} text-xs sm:text-sm truncate w-full`}
            >
              {showPrivate ? wallet.privateKey : maskedKey}
            </span>
            <button
              onClick={() => setShowPrivate(!showPrivate)}
              className={`${theme.textSecondary} hover:text-red-500 transition`}
              title={showPrivate ? "Hide Private Key" : "Show Private Key"}
            >
              <EyeOff
                size={16}
                className={
                  showPrivate
                    ? "text-red-500"
                    : theme.textSecondary.replace("text-", "text-")
                }
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

const ProfilePage: React.FC = () => {
  // Merging state management from the simpler component's structure
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // --- Data Fetching Logic (from simpler block, with fix) ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // FIX: Construct absolute URL to resolve 'Failed to parse URL' error
        const apiUrl = window.location.origin + "/api/user/me";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          // Throwing an error here triggers the catch block on API failure (e.g., 401)
          throw new Error(`API returned status ${response.status}`);
        }
        const data: UserData = await response.json();
        setUser(data);
      } catch (error) {
        // Fallback to mock data to ensure the rest of the complex UI renders on API failure
        console.error("Failed to fetch user data, using mock data:", error);
        setUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  // --- End Data Fetching Logic ---

  // Stable callback for handling copy success and triggering the toast
  const showCopyToast = useCallback((chain: string) => {
    setCopyMessage(`${chain} address copied!`);
    setTimeout(() => setCopyMessage(null), 2500);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Loading State UI
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkTheme.background} transition-colors duration-500`}
      >
        <div className="flex flex-col items-center p-8">
          <Loader2 size={32} className={`animate-spin ${ACCENT_COLOR}`} />
          <p className={`${darkTheme.textPrimary} mt-4 text-lg font-medium`}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Use the fetched or fallback user data
  const currentUser = user || fallbackUser;

  // Ready State UI
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme.background} p-4 sm:p-8 transition-colors duration-500`}
    >
      <AnimatePresence>
        {copyMessage && <CopyToast message={copyMessage} key="copy-toast" />}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full max-w-4xl py-8 ${theme.textPrimary}`}
      >
        {/* Theme Toggle Button (Top Right) */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${theme.cardBg} ${
              theme.textSecondary
            } ${
              theme.borderColor
            } border transition-all duration-300 hover:${ACCENT_COLOR.replace(
              "text-",
              "text-"
            )} shadow-lg`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Header and User Info Card */}
        <motion.div
          variants={itemVariants}
          className={`mb-10 p-6 rounded-2xl shadow-xl border ${theme.borderColor} ${theme.cardBg} transition-colors duration-500`}
        >
          <h1
            className={`text-3xl font-extrabold mb-5 flex items-center space-x-3 ${ACCENT_COLOR}`}
          >
            <span>My Profile</span>
          </h1>

          <div className="space-y-3 text-sm">
            {/* Full Name */}
            <div
              className={`flex items-center space-x-3 p-3 rounded-xl ${theme.subCardBg}`}
            >
              <User size={18} className={theme.textSecondary} />
              <span className={`font-medium ${theme.textSecondary}`}>
                Full Name:
              </span>
              <span className={`ml-auto font-semibold ${theme.textPrimary}`}>
                {currentUser.firstname} {currentUser.lastname}
              </span>
            </div>
            {/* Email */}
            <div
              className={`flex items-center space-x-3 p-3 rounded-xl ${theme.subCardBg}`}
            >
              <Mail size={18} className={theme.textSecondary} />
              <span className={`font-medium ${theme.textSecondary}`}>
                Email:
              </span>
              <span className={`ml-auto font-semibold ${theme.textPrimary}`}>
                {currentUser.email}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Wallets Section Title */}
        <motion.h2
          variants={itemVariants}
          className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}
        >
          Wallet Keys
        </motion.h2>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {walletData.map((wallet, index) => (
            <WalletCard
              key={wallet.chain}
              wallet={wallet}
              delay={0.4 + index * 0.2}
              theme={theme}
              onCopySuccess={showCopyToast} // Pass stable toast function
            />
          ))}
        </div>

        {/* Dashboard Button */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="/dashboard"
            className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-lg transition duration-300 ${ACCENT_BG} text-white hover:opacity-90 shadow-xl`}
          >
            Go to Dashboard
            <ArrowRight size={20} className="ml-2" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
