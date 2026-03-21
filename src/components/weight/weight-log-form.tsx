"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WeightLogFormProps {
  onLog: (weightKg: number) => Promise<unknown>;
}

export function WeightLogForm({ onLog }: WeightLogFormProps) {
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    setSaving(true);
    await onLog(Number(weight));
    setWeight("");
    setSaving(false);
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient">
      <p className="text-label-sm text-on-surface/45 uppercase tracking-wider mb-4">Manual Entry (kg)</p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-2 mb-5">
          <input
            id="weight-input"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            className="font-display font-extrabold text-[2.5rem] text-on-surface text-center bg-transparent outline-none w-36 ghost-border rounded-xl py-2"
          />
          <span className="font-body text-body-md text-on-surface/40 mt-2">kg</span>
        </div>
        <Button type="submit" fullWidth disabled={saving || !weight}>
          {saving ? "Logging..." : "Log Weight"}
        </Button>
      </form>
    </div>
  );
}
