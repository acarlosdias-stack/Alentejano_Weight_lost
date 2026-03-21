"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RegisterPenFormProps {
  onRegister: (totalMg: number, name?: string) => Promise<unknown>;
}

export function RegisterPenForm({ onRegister }: RegisterPenFormProps) {
  const [mg, setMg] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mg) return;
    setSaving(true);
    await onRegister(Number(mg), name || undefined);
    setMg("");
    setName("");
    setSaving(false);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📝</span>
          <h3 className="font-display text-title-md font-semibold">
            Register New Pen
          </h3>
        </div>
        <Input
          label="Prescription Strength (mg)"
          type="number"
          step="0.5"
          placeholder="e.g. 15"
          suffix="mg"
          value={mg}
          onChange={(e) => setMg(e.target.value)}
          required
        />
        <Input
          label="Pen Name (optional)"
          placeholder="e.g. Pen #1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={saving || !mg}>
          {saving ? "Registering..." : "Register New Pen"}
        </Button>
      </form>
    </Card>
  );
}
