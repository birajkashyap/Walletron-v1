"use client";
import { motion } from "framer-motion";

import Button from "./Button";
type ThemeToggleProps = {
  theme: "light" | "dark"; // your theme type
};

const HeroSection = ({ theme }: ThemeToggleProps) => {
  const isDark = theme === "dark";
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-16 space-y-8 ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`text-sm font-semibold px-4 py-2 rounded-full border backdrop-blur-sm ${
          isDark
            ? "text-white/50 bg-white/5 border-white/10"
            : "text-gray-500 bg-gray-200 border-gray-300"
        }`}
      >
        Introducing Walletron
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-4xl md:text-6xl font-bold leading-tight"
      >
        The AI-Powered Wallet Engine
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          for Developers
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className={`text-base md:text-xl max-w-2xl ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Build, integrate, and manage multi-chain wallets with simple APIs and
        natural language control. Simplify blockchain complexity for your users.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="flex space-x-4 pt-4"
      >
        <a href="/create-wallet">
          <Button
            className={`${
              isDark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-gray-900 text-white hover:bg-gray-800"
            } rounded-lg shadow-lg`}
          >
            Try Demo
          </Button>
        </a>

        <a href="https://github.com/birajkashyap/Walletron-v1">
          <Button
            variant="ghost"
            className={`border rounded-lg ${
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-900 hover:bg-gray-200"
            }`}
          >
            View Documentation
          </Button>
        </a>
      </motion.div>
    </div>
  );
};

export default HeroSection;
