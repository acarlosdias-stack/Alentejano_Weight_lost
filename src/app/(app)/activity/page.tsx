"use client";

import { useCallback } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useWeight } from "@/hooks/use-weight";
import { WeightLogForm } from "@/components/weight/weight-log-form";
import { WeightProgress } from "@/components/weight/weight-progress";

export default function ActivityPage() {
  const { profile } = useProfile();
  const { logs, logWeight, getMonthlyChange } = useWeight();

  const handleLogWeight = useCallback(
    (kg: number) => logWeight(kg, profile?.height_cm),
    [logWeight, profile?.height_cm]
  );

  return (
    <div className="pt-6 pb-24 space-y-5">
      <div className="px-5">
        <h1 className="font-display text-headline-sm text-on-surface">Weight Log</h1>
        <p className="text-body-md text-on-surface/55 mt-1">
          Track your progress over time.
        </p>
      </div>

      <WeightLogForm onLog={handleLogWeight} />
      <WeightProgress logs={logs} monthlyChange={getMonthlyChange()} />
    </div>
  );
}
