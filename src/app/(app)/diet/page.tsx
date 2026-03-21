"use client";

import { useState, useCallback } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useMeals } from "@/hooks/use-meals";
import { DietHeroCard } from "@/components/diet/diet-hero-card";
import { QuickLogBar } from "@/components/diet/quick-log-bar";
import { MealSlot } from "@/components/diet/meal-slot";
import { AddMealModal } from "@/components/diet/add-meal-modal";
import { MEAL_SLOTS, type MealSlotType, type QuickLogPreset } from "@/lib/diet-presets";

export default function DietPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { meals, addMeal, deleteMeal, totals } = useMeals();
  const [selectedSlot, setSelectedSlot] = useState<MealSlotType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback((slot: MealSlotType) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  }, []);

  const handleQuickLog = useCallback(
    async (preset: QuickLogPreset) => {
      await addMeal(preset.meal_slot, {
        name: preset.name,
        calories_kcal: preset.calories_kcal,
        protein_g: preset.protein_g,
        carbs_g: preset.carbs_g,
        fat_g: preset.fat_g,
      });
    },
    [addMeal]
  );

  if (profileLoading) {
    return <p className="p-5 text-body-md text-on-surface/50">Loading…</p>;
  }

  if (!profile) {
    return <p className="p-5 text-body-md text-on-surface/50">Setting up your profile…</p>;
  }

  return (
    <div>
      {/* Full-bleed hero */}
      <DietHeroCard profile={profile} totals={totals} />

      {/* Tonal section */}
      <div className="bg-surface-container-low px-5 pt-4 pb-24 space-y-4">
        <QuickLogBar onLog={handleQuickLog} />

        {MEAL_SLOTS.map((config) => (
          <MealSlot
            key={config.key}
            config={config}
            meals={meals.filter((m) => m.meal_slot === config.key)}
            onAdd={() => openModal(config.key)}
            onDelete={deleteMeal}
          />
        ))}
      </div>

      <AddMealModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={selectedSlot}
        onSave={async (entry) => {
          if (!selectedSlot) return;
          await addMeal(selectedSlot, entry);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
