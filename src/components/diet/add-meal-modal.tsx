"use client";

import { useState } from "react";
import { Camera, ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SLOT_LABELS, type MealSlotType } from "@/lib/diet-presets";

interface MealEntry {
  name: string;
  calories_kcal?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
}

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: MealEntry) => Promise<void>;
  slot: MealSlotType | null;
}

export function AddMealModal({ open, onClose, onSave, slot }: AddMealModalProps) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [macrosOpen, setMacrosOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const title = slot ? `Add to ${SLOT_LABELS[slot]}` : "Add Entry";

  const reset = () => {
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setMacrosOpen(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      calories_kcal: calories ? parseInt(calories, 10) : null,
      protein_g: protein ? parseFloat(protein) : null,
      carbs_g: carbs ? parseFloat(carbs) : null,
      fat_g: fat ? parseFloat(fat) : null,
    });
    setSaving(false);
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="space-y-4">
        {/* AI Scan placeholder */}
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container text-on-surface/30 cursor-not-allowed"
        >
          <Camera size={18} strokeWidth={1.75} />
          <span className="text-label-sm font-semibold">Scan with AI</span>
          <span className="bg-surface-container-high text-on-surface/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Phase 2
          </span>
        </button>

        {/* Name field */}
        <Input
          label="Meal name"
          placeholder="e.g. Bacalhau com grão"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        {/* Macros toggle */}
        <button
          type="button"
          onClick={() => setMacrosOpen((prev) => !prev)}
          className="flex items-center gap-1 text-label-sm text-primary font-semibold"
        >
          {macrosOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Macros (optional)
        </button>

        {macrosOpen && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Calories"
              type="number"
              suffix="kcal"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            <Input
              label="Protein"
              type="number"
              suffix="g"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
            <Input
              label="Carbs"
              type="number"
              suffix="g"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
            />
            <Input
              label="Fat"
              type="number"
              suffix="g"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
            />
          </div>
        )}

        <Button
          fullWidth
          disabled={!name.trim() || saving}
          onClick={handleSave}
        >
          {saving ? "Saving…" : "Add Meal"}
        </Button>
      </div>
    </Modal>
  );
}
