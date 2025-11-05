"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);

    if (res.ok) {
      router.push("/auth/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-[#121212] p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Create a Walletron Account</h1>
        <p className="text-sm text-gray-400 mb-6">
          Welcome! Create an account to get started
        </p>

        <hr className="border-gray-700 mb-6" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Firstname</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full mt-1 mb-3 bg-[#1f1f1f] border border-gray-700 rounded-md p-2 text-sm"
              placeholder="Firstname"
            />
          </div>
          <div>
            <label className="text-sm">Lastname</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full mt-1 mb-3 bg-[#1f1f1f] border border-gray-700 rounded-md p-2 text-sm"
              placeholder="Lastname"
            />
          </div>
        </div>

        <div className="mb-3">
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
          onClick={handleSubmit}
          className="w-full bg-gray-100 text-black font-semibold py-2 rounded-md"
        >
          {loading ? "Signing up..." : "Continue"}
        </button>

        <div className="text-center text-sm mt-4 text-gray-400">
          Have an account?{" "}
          <a
            href="/auth/login"
            className="text-white font-medium hover:underline"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
