"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function SignupPage() {
  const { signUp, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signUp(email, password, name);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-headline-sm text-on-surface">
          Start your journey
        </h1>
        <p className="text-body-md text-on-surface/60 mt-2">
          Create your AlentejanoWeightMission account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-label-sm text-on-surface/70 block mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest ghost-border text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

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
            minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-body-md text-on-surface/60 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
