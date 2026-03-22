"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ActivityLog, ActivityLogInsert, ActivityLogUpdate } from "@/lib/supabase/types";

export function useActivity() {
  const supabase = useMemo(() => createClient(), []);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
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
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false });

    setLogs((data as ActivityLog[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addActivity = useCallback(
    async (payload: ActivityLogInsert) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("activity_logs")
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        setLogs((prev) => [data as ActivityLog, ...prev]);
      }
    },
    [supabase]
  );

  const updateActivity = useCallback(
    async (id: string, payload: ActivityLogUpdate) => {
      const { data, error } = await supabase
        .from("activity_logs")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        setLogs((prev) => prev.map((l) => (l.id === id ? (data as ActivityLog) : l)));
      }
    },
    [supabase]
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("activity_logs").delete().eq("id", id);
      if (!error) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
      }
    },
    [supabase]
  );

  const workoutLogs = useMemo(() => logs.filter((l) => l.type === "workout"), [logs]);
  const treadmillLogs = useMemo(() => logs.filter((l) => l.type === "treadmill"), [logs]);

  return {
    logs,
    workoutLogs,
    treadmillLogs,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchLogs,
  };
}
