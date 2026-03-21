"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dose } from "@/lib/supabase/types";

interface EditDoseModalProps {
  dose: Dose;
  open: boolean;
  onClose: () => void;
  onSave: (doseId: string, updates: { dose_mg?: number; taken_at?: string; notes?: string | null }) => Promise<unknown>;
}

function toLocalDatetimeValue(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditDoseModal({ dose, open, onClose, onSave }: EditDoseModalProps) {
  const [doseMg, setDoseMg] = useState(String(dose.dose_mg));
  const [takenAt, setTakenAt] = useState(toLocalDatetimeValue(dose.taken_at));
  const [notes, setNotes] = useState(dose.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDoseMg(String(dose.dose_mg));
      setTakenAt(toLocalDatetimeValue(dose.taken_at));
      setNotes(dose.notes ?? "");
    }
  }, [open, dose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(dose.id, {
      dose_mg: Number(doseMg),
      taken_at: new Date(takenAt).toISOString(),
      notes: notes || null,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Dose">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Dose Amount (mg)"
          type="number"
          step="0.5"
          min="0"
          suffix="mg"
          value={doseMg}
          onChange={(e) => setDoseMg(e.target.value)}
          required
        />
        <Input
          label="Date & Time"
          type="datetime-local"
          value={takenAt}
          onChange={(e) => setTakenAt(e.target.value)}
          required
        />
        <Input
          label="Notes (optional)"
          placeholder="e.g. No side effects"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={saving || !doseMg || !takenAt}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Modal>
  );
}
