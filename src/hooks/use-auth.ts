"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp(email: string, password: string, name: string) {
    setLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name,
      });
    }
    setLoading(false);
    router.push("/home");
    router.refresh();
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/home");
    router.refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return { signUp, signIn, signOut, loading, error };
}
