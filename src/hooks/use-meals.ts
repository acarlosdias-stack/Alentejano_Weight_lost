"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MealLog, MealLogInsert } from "@/lib/supabase/types";
import type { MealSlotType } from "@/lib/diet-presets";

type MealEntry = Omit<MealLogInsert, "meal_slot" | "user_id" | "logged_at">;

interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Count of "Water" entries today */
  waterGlasses: number;
}

export function useMeals() {
  const supabase = useMemo(() => createClient(), []);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Use local midnight so meals log to the correct local day (not UTC midnight)
    const localMidnight = new Date();
    localMidnight.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", localMidnight.toISOString())
      .order("logged_at", { ascending: true });

    setMeals((data as MealLog[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const addMeal = useCallback(
    async (slot: MealSlotType, entry: MealEntry) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { error: new Error("Not authenticated") };

      // Optimistic insert with a temporary id
      const tempId = `temp-${Date.now()}`;
      const optimistic: MealLog = {
        id: tempId,
        user_id: user.id,
        meal_slot: slot,
        name: entry.name ?? "",
        calories_kcal: entry.calories_kcal ?? null,
        protein_g: entry.protein_g ?? null,
        carbs_g: entry.carbs_g ?? null,
        fat_g: entry.fat_g ?? null,
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setMeals((prev) => [...prev, optimistic]);

      const { data, error } = await supabase
        .from("meal_logs")
        .insert({
          user_id: user.id,
          meal_slot: slot,
          name: entry.name ?? "",
          calories_kcal: entry.calories_kcal ?? null,
          protein_g: entry.protein_g ?? null,
          carbs_g: entry.carbs_g ?? null,
          fat_g: entry.fat_g ?? null,
        })
        .select()
        .single();

      if (error) {
        // Roll back optimistic entry on failure
        setMeals((prev) => prev.filter((m) => m.id !== tempId));
        return { error };
      }

      // Replace temp entry with real DB row (has correct id)
      setMeals((prev) =>
        prev.map((m) => (m.id === tempId ? (data as MealLog) : m))
      );
      return { error: null };
    },
    [supabase]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      // Optimistic remove
      let removed: MealLog | undefined;
      setMeals((prev) => {
        removed = prev.find((m) => m.id === id);
        return prev.filter((m) => m.id !== id);
      });

      const { error } = await supabase
        .from("meal_logs")
        .delete()
        .eq("id", id);

      if (error && removed) {
        // Restore on failure
        setMeals((prev) => [...prev, removed!].sort(
          (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
        ));
      }
      return { error };
    },
    [supabase]
  );

  const totals: MealTotals = useMemo(() => ({
    calories: meals.reduce((sum, m) => sum + (m.calories_kcal ?? 0), 0),
    protein:  meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0),
    carbs:    meals.reduce((sum, m) => sum + (m.carbs_g ?? 0), 0),
    fat:      meals.reduce((sum, m) => sum + (m.fat_g ?? 0), 0),
    waterGlasses: meals.filter((m) => m.name === "Water").length,
  }), [meals]);

  return { meals, loading, addMeal, deleteMeal, totals };
}
