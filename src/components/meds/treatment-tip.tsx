"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";

const tips = [
  "Consistency is key to your Mounjaro therapy. Try to log your doses at the same time each week to maintain stable levels in your system.",
  "Store your Mounjaro pen in the refrigerator between 2-8°C. Do not freeze.",
  "Rotate injection sites between your abdomen, thigh, and upper arm to reduce irritation.",
  "Stay hydrated while on Mounjaro. Aim for at least 2.5L of water daily.",
];

export function TreatmentTip() {
  // Deterministic per day — avoids SSR/client hydration mismatch
  const tip = useMemo(() => {
    const dayIndex = new Date().getDay(); // 0-6
    return tips[dayIndex % tips.length];
  }, []);

  return (
    <Card variant="flat" className="flex items-start gap-3">
      <span className="text-xl text-tertiary-fixed">💚</span>
      <div>
        <p className="font-display text-title-md font-semibold">
          Treatment Tip
        </p>
        <p className="text-body-md text-on-surface/70 mt-1">{tip}</p>
      </div>
    </Card>
  );
}
