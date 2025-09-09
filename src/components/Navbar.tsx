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

type ThemeToggleProps = {
  theme: "light" | "dark"; // your theme type
  setTheme: (theme: "light" | "dark") => void; // setter function
};

// Main Navbar component
const Navbar = ({ theme, setTheme }: ThemeToggleProps) => {
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
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home
          </a>
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Integrate
          </a>
        </div>
      </div>

      {/* Right section: Auth Buttons and Theme Toggle */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          href="/auth/login"
          className={`${
            isDark
              ? "text-white hover:text-white hover:bg-white/10"
              : "text-gray-900 hover:bg-gray-200"
          }`}
        >
          Sign In
        </Button>

        <Button
          href="/auth/signup"
          className={`${
            isDark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gray-900 text-white hover:bg-gray-800"
          } rounded-lg`}
        >
          Sign Up
        </Button>

        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </motion.nav>
  );
};

export { Navbar, SunIcon, MoonIcon };
