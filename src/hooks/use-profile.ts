"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export function useProfile() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data as Profile);
    } else {
      // Profile missing (e.g. signup email confirmation delayed the insert) — create it now
      const { data: created } = await supabase
        .from("profiles")
        .insert({ id: user.id, name: user.email?.split("@")[0] ?? "User" })
        .select()
        .single();
      setProfile((created as Profile) ?? null);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function updateProfile(updates: Partial<Profile>) {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);
    if (!error) {
      setProfile({ ...profile, ...updates });
    }
    return error;
  }

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
