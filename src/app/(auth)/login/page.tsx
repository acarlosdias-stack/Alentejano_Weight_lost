"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-sm text-on-surface">
          Welcome back
        </h1>
        <p className="text-body-md text-on-surface/60 mt-2">
          Sign in to AlentejanoWeightMission
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-label-sm text-on-surface/70 block mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest ghost-border text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="text-label-sm text-on-surface/70 block mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest ghost-border text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {error && (
          <p className="text-label-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full vitality-gradient text-white font-display font-semibold text-title-md disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-body-md text-on-surface/60 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}
