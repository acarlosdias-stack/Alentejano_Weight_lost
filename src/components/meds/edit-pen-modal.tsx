"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Pen } from "@/lib/supabase/types";

interface EditPenModalProps {
  pen: Pen;
  open: boolean;
  onClose: () => void;
  onSave: (penId: string, updates: { name?: string | null; total_mg?: number; remaining_mg?: number; status?: 'active' | 'depleted' }) => Promise<unknown>;
  totalDosesTaken: number;
}

export function EditPenModal({ pen, open, onClose, onSave, totalDosesTaken }: EditPenModalProps) {
  const [name, setName] = useState(pen.name ?? "");
  const [totalMg, setTotalMg] = useState(String(pen.total_mg));
  const [remainingMg, setRemainingMg] = useState(String(pen.remaining_mg));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(pen.name ?? "");
      setTotalMg(String(pen.total_mg));
      setRemainingMg(String(pen.remaining_mg));
    }
  }, [open, pen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(pen.id, {
      name: name || null,
      total_mg: Number(totalMg),
      remaining_mg: Number(remainingMg),
      status: Number(remainingMg) <= 0 ? 'depleted' : 'active',
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Pen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Pen Name"
          placeholder="e.g. Pen #1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Prescription Strength (mg)"
          type="number"
          step="0.5"
          min="0"
          suffix="mg"
          value={totalMg}
          onChange={(e) => {
            const newTotal = Number(e.target.value);
            setTotalMg(e.target.value);
            setRemainingMg(String(Math.max(0, newTotal - totalDosesTaken)));
          }}
          required
        />
        <Input
          label="Remaining (mg)"
          type="number"
          step="0.5"
          min="0"
          suffix="mg"
          value={remainingMg}
          onChange={(e) => setRemainingMg(e.target.value)}
          required
        />
        <Button type="submit" fullWidth disabled={saving || !totalMg || !remainingMg}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Modal>
  );
}
