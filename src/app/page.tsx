"use client";

import React, { useState, useEffect } from "react";

import SignupPage from "./auth/signup/page";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [page, setPage] = useState<"home" | "dashboard">("home");

  useEffect(() => {
    // Apply current theme class to html
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div>
      <SignupPage />
    </div>
  );
}
