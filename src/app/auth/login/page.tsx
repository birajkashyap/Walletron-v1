"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.ok) router.push("/dashboard");
    else alert("Login failed");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-[#121212] p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Login to Walletron</h1>
        <p className="text-sm text-gray-400 mb-6">
          Welcome back! Log in to continue
        </p>

        <div className="mb-4">
          <label className="text-sm">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 bg-[#1f1f1f] border border-gray-700 rounded-md p-2 text-sm"
            placeholder="Email"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full mt-1 bg-[#1f1f1f] border border-gray-700 rounded-md p-2 text-sm"
            placeholder="Password"
          />
        </div>

        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full bg-gray-100 text-black font-semibold py-2 rounded-md"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>

        <div className="text-center text-sm mt-4 text-gray-400">
          New here?{" "}
          <a
            href="/auth/signup"
            className="text-white font-medium hover:underline"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
