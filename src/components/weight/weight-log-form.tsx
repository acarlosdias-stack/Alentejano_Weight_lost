"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <Card>
      <h3 className="font-display text-headline-sm mb-4">Weight Log</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-label-sm text-on-surface/50 uppercase tracking-wider">
          Manual Entry (KG)
        </p>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="number"
              step="0.1"
              placeholder="78.5"
              suffix="kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={saving || !weight}>
            Log
          </Button>
        </div>
      </form>
    </Card>
  );
}
