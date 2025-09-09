"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.93 19.07l1.41-1.41" />
    <path d="M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

type NavbarProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onNavigate: (page: "home" | "dashboard") => void; // add type for navigation
};

// Main Navbar component
const Navbar = ({ theme, setTheme, onNavigate }: NavbarProps) => {
  const isDark = theme === "dark";
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`p-4 md:p-6 flex items-center justify-between z-50 relative ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Left section: Logo and Nav Links */}
      <div className="flex items-center space-x-8">
        <span className="text-xl font-bold">Walletron</span>
        <div className="hidden md:flex space-x-6 text-sm">
          <button
            onClick={() => onNavigate("home")}
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>
          <a
            href="/create-wallet"
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Create a Wallet
          </a>
        </div>
      </div>

      {/* Right section: Auth Buttons and Theme Toggle */}
      <div className="flex items-center space-x-4">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </motion.nav>
  );
};

export { Navbar, SunIcon, MoonIcon };
