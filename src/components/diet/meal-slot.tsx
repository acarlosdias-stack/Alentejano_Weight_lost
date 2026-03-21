"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { MealLog } from "@/lib/supabase/types";
import type { MealSlotConfig } from "@/lib/diet-presets";

interface MealSlotProps {
  config: MealSlotConfig;
  meals: MealLog[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

function isCurrentSlot(config: MealSlotConfig): boolean {
  if (config.key === "extra") return false;
  const hour = new Date().getHours();
  return hour >= config.startHour && hour < config.endHour;
}

export function MealSlot({ config, meals, onAdd, onDelete }: MealSlotProps) {
  const [expanded, setExpanded] = useState<boolean>(
    () => meals.length > 0 || isCurrentSlot(config)
  );

  const slotCalories = meals.reduce((sum, m) => sum + (m.calories_kcal ?? 0), 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronUp size={16} strokeWidth={1.75} className="text-on-surface/40" />
          ) : (
            <ChevronDown size={16} strokeWidth={1.75} className="text-on-surface/40" />
          )}
          <div>
            <p className="font-display font-semibold text-title-md text-on-surface">
              {config.label}
            </p>
            <p className="text-label-sm text-on-surface/45">{config.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {slotCalories > 0 && (
            <span className="text-label-sm text-on-surface/45">{slotCalories} kcal</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center active:scale-95 transition-transform"
            aria-label={`Add to ${config.label}`}
          >
            <Plus size={16} strokeWidth={2} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Meal list */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          {meals.length === 0 ? (
            <p className="text-label-sm text-on-surface/30 py-2">Nothing logged yet</p>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between py-2 border-t border-surface-container-high first:border-0"
              >
                <div>
                  <p className="text-body-md font-medium text-on-surface">{meal.name}</p>
                  {meal.calories_kcal != null && (
                    <p className="text-label-sm text-on-surface/45">{meal.calories_kcal} kcal</p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(meal.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-transform"
                  aria-label="Delete meal"
                >
                  <Trash2 size={14} strokeWidth={1.75} className="text-on-surface/40" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
