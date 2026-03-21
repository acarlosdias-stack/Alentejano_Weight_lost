"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dose } from "@/lib/supabase/types";

export function useDoses(penId?: string) {
  const supabase = useMemo(() => createClient(), []);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoses = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from("doses")
      .select("*")
      .eq("user_id", user.id)
      .order("taken_at", { ascending: false });

    if (penId) {
      query = query.eq("pen_id", penId);
    }

    const { data } = await query;
    setDoses((data as Dose[]) ?? []);
    setLoading(false);
  }, [supabase, penId]);

  useEffect(() => {
    fetchDoses();
  }, [fetchDoses]);

  const logDose = useCallback(async (
    penId: string,
    doseMg: number,
    takenAt: string,
    type: "initialization" | "dose" = "dose",
    notes?: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("doses")
      .insert({
        pen_id: penId,
        user_id: user.id,
        type,
        dose_mg: doseMg,
        taken_at: takenAt,
        notes,
      })
      .select()
      .single();

    if (!error && data) {
      setDoses(prev => [data as Dose, ...prev]);
    }
    return { data, error };
  }, [supabase]);

  function getNextDoseDate(): string | null {
    if (doses.length === 0) return null;
    const lastDose = doses[0];
    const next = new Date(lastDose.taken_at);
    next.setDate(next.getDate() + 7);
    return next.toISOString();
  }

  return { doses, loading, logDose, getNextDoseDate, refetch: fetchDoses };
}
