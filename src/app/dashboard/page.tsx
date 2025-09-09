// src/app/dashboard/page.tsx
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions);
//   if (!session) redirect("/auth/login");
//   else redirect("/create-wallet");
// }

"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [page, setPage] = useState<"home" | "dashboard">("home");

  useEffect(() => {
    // Apply current theme class to html
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
      <Navbar theme={theme} setTheme={setTheme} onNavigate={setPage} />
      {page === "home" ? (
        <HeroSection theme={theme} />
      ) : (
        <Dashboard theme={theme} />
      )}
    </div>
  );
}
