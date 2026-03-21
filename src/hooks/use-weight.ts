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

    setLogs((data as WeightLog[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logWeight = useCallback(async (weightKg: number, heightCm?: number | null, dateStr?: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const bmi = heightCm ? calcBMI(weightKg, heightCm) : null;
    const logged_at = dateStr
      ? new Date(dateStr + "T12:00:00").toISOString()
      : new Date().toISOString();

    const { data, error } = await supabase
      .from("weight_logs")
      .insert({ user_id: user.id, weight_kg: weightKg, bmi, logged_at })
      .select()
      .single();

    if (!error && data) {
      setLogs(prev => [data as WeightLog, ...prev].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      ));
    }
    return { data, error };
  }, [supabase]);

  const updateWeight = useCallback(async (id: string, weightKg: number, dateStr: string, heightCm?: number | null) => {
    const bmi = heightCm ? calcBMI(weightKg, heightCm) : null;
    const logged_at = new Date(dateStr + "T12:00:00").toISOString();

    const { data, error } = await supabase
      .from("weight_logs")
      .update({ weight_kg: weightKg, bmi, logged_at })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setLogs(prev =>
        prev
          .map(l => (l.id === id ? (data as WeightLog) : l))
          .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
      );
    }
    return { data, error };
  }, [supabase]);

  const deleteWeight = useCallback(async (id: string) => {
    const { error } = await supabase.from("weight_logs").delete().eq("id", id);
    if (!error) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
    return { error };
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

  return { logs, loading, logWeight, updateWeight, deleteWeight, latestWeight, getMonthlyChange, refetch: fetchLogs };
}
