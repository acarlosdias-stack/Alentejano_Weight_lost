"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <>
      {/* Hero panel */}
      <div className="vitality-gradient px-8 pt-16 pb-12 flex-shrink-0">
        <p className="text-label-sm text-white/55 uppercase tracking-widest mb-4">Alentejano</p>
        <h1 className="font-display font-extrabold text-[2.5rem] leading-none text-white">
          Weight<br />Mission
        </h1>
        <p className="text-body-md text-white/65 mt-3">Your clinical wellness companion</p>
      </div>

      {/* Form panel */}
      <div className="bg-surface-container-lowest rounded-t-[2rem] -mt-8 flex-1 px-8 pt-8 pb-12">
        <h2 className="font-display text-headline-sm text-on-surface mb-6">Start your journey</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-label-sm text-red-500">{error}</p>}

          <Button type="submit" fullWidth disabled={loading} className="mt-2">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-body-md text-on-surface/55 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </>
  );
}
