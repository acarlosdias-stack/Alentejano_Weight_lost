"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pen } from "@/lib/supabase/types";

export function usePens() {
  const supabase = createClient();
  const [pens, setPens] = useState<Pen[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPens = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("pens")
      .select("*")
      .eq("user_id", user.id)
      .order("registered_at", { ascending: false });

    setPens(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPens();
  }, [fetchPens]);

  const activePen = pens.find((p) => p.status === "active") ?? null;

  async function registerPen(totalMg: number, name?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error("Not authenticated") };

    const penName = name || `Pen #${pens.length + 1}`;

    const { data, error } = await supabase
      .from("pens")
      .insert({
        user_id: user.id,
        name: penName,
        total_mg: totalMg,
        remaining_mg: totalMg,
      })
      .select()
      .single();

    if (!error && data) {
      setPens([data, ...pens]);
    }
    return { data, error };
  }

  async function updatePenRemaining(penId: string, newRemaining: number) {
    const status = newRemaining <= 0 ? "depleted" : "active";
    const { error } = await supabase
      .from("pens")
      .update({
        remaining_mg: Math.max(newRemaining, 0),
        status,
      })
      .eq("id", penId);

    if (!error) {
      setPens(
        pens.map((p) =>
          p.id === penId
            ? { ...p, remaining_mg: Math.max(newRemaining, 0), status }
            : p
        )
      );
    }
    return error;
  }

  return { pens, activePen, loading, registerPen, updatePenRemaining, refetch: fetchPens };
}
