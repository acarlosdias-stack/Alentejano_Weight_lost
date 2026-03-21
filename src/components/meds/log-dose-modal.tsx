"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LogDoseModalProps {
  open: boolean;
  onClose: () => void;
  onLog: (doseMg: number, takenAt: string, notes?: string) => Promise<void>;
  maxMg: number;
}

export function LogDoseModal({
  open,
  onClose,
  onLog,
  maxMg,
}: LogDoseModalProps) {
  const [doseMg, setDoseMg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doseMg) return;
    setSaving(true);
    await onLog(Number(doseMg), new Date(date).toISOString(), notes || undefined);
    setDoseMg("");
    setNotes("");
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Dose">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Dose Amount"
          type="number"
          step="0.5"
          max={maxMg}
          suffix="mg"
          value={doseMg}
          onChange={(e) => setDoseMg(e.target.value)}
          required
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any observations..."
        />
        <Button type="submit" fullWidth disabled={saving || !doseMg}>
          {saving ? "Logging..." : "Log Dose"}
        </Button>
      </form>
    </Modal>
  );
}
