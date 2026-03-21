"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeightLog } from "@/lib/supabase/types";
import { calcBMI } from "@/lib/utils";

export function useWeight() {
  const supabase = useMemo(() => createClient(), []);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false });

    setLogs(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logWeight = useCallback(async (weightKg: number, heightCm?: number | null) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const bmi = heightCm ? calcBMI(weightKg, heightCm) : null;

    const { data, error } = await supabase
      .from("weight_logs")
      .insert({
        user_id: user.id,
        weight_kg: weightKg,
        bmi,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      setLogs(prev => [data, ...prev]);
    }
    return { data, error };
  }, [supabase]);

  const latestWeight = logs[0]?.weight_kg ?? null;

  function getMonthlyChange(): number | null {
    if (logs.length < 2) return null;
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const oldEntry = logs.find((l) => new Date(l.logged_at) <= monthAgo);
    if (!oldEntry) return null;
    return Math.round((latestWeight! - oldEntry.weight_kg) * 10) / 10;
  }

  return { logs, loading, logWeight, latestWeight, getMonthlyChange, refetch: fetchLogs };
}
