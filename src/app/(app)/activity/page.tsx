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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-sm">Activity</h1>
        <p className="text-body-md text-on-surface/60 mt-1">
          Exercise tracking coming in Phase 3.
        </p>
      </div>

      <WeightLogForm onLog={handleLogWeight} />

      <WeightProgress
        logs={logs}
        monthlyChange={getMonthlyChange()}
      />
    </div>
  );
}
