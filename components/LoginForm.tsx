"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ from, error: initError }: { from?: string; error?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initError || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(from || "/");
      router.refresh();
    } else {
      setError("비밀번호가 틀렸습니다");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        autoFocus
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
      >
        {loading ? "확인중..." : "로그인"}
      </button>
    </form>
  );
}
