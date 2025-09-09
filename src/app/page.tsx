"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Apply class to html element
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div
      className={`min-h-screen font-sans overflow-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar theme={theme} setTheme={setTheme} />
      <HeroSection theme={theme} />
    </div>
  );
}
