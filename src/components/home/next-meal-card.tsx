"use client";

import Link from "next/link";
import { UtensilsCrossed, Moon } from "lucide-react";
import { getMealState } from "@/lib/meal-state";

export function NextMealCard() {
  const state = getMealState(new Date());
  const isDone = state.kind === 'done';
  const isActive = state.kind === 'active';

  const Icon = isDone ? Moon : UtensilsCrossed;

  return (
    <Link href="/diet">
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient cursor-pointer flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={16} strokeWidth={1.75} className="text-primary" />
        </div>
        <div>
          <p
            className={`text-label-sm uppercase tracking-wider ${
              isActive ? "text-primary font-semibold" : "text-on-surface/45"
            }`}
          >
            {state.label}
          </p>
          <p className="font-display text-title-md text-on-surface mt-0.5">
            {state.title}
          </p>
          <p className="text-label-sm text-on-surface/45 mt-0.5">
            {state.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}
