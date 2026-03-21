"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/supabase/types";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<unknown>;
}

export function EditProfileModal({
  open,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [heightCm, setHeightCm] = useState(String(profile.height_cm ?? ""));
  const [goalWeightKg, setGoalWeightKg] = useState(
    String(profile.goal_weight_kg ?? "")
  );
  const [caloriesTarget, setCaloriesTarget] = useState(
    String(profile.daily_calories_target ?? "")
  );
  const [proteinTarget, setProteinTarget] = useState(
    String(profile.daily_protein_target_g ?? "")
  );
  const [carbsTarget, setCarbsTarget] = useState(
    String(profile.daily_carbs_target_g ?? "")
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({
      name,
      height_cm: heightCm ? Number(heightCm) : null,
      goal_weight_kg: goalWeightKg ? Number(goalWeightKg) : null,
      daily_calories_target: caloriesTarget ? Number(caloriesTarget) : null,
      daily_protein_target_g: proteinTarget ? Number(proteinTarget) : null,
      daily_carbs_target_g: carbsTarget ? Number(carbsTarget) : null,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Height"
          type="number"
          suffix="cm"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
        />
        <Input
          label="Goal Weight"
          type="number"
          suffix="kg"
          value={goalWeightKg}
          onChange={(e) => setGoalWeightKg(e.target.value)}
        />
        <Input
          label="Daily Calories Target"
          type="number"
          suffix="kcal"
          value={caloriesTarget}
          onChange={(e) => setCaloriesTarget(e.target.value)}
        />
        <Input
          label="Daily Protein Target"
          type="number"
          suffix="g"
          value={proteinTarget}
          onChange={(e) => setProteinTarget(e.target.value)}
        />
        <Input
          label="Daily Carbs Target"
          type="number"
          suffix="g"
          value={carbsTarget}
          onChange={(e) => setCarbsTarget(e.target.value)}
        />
        <Button type="button" onClick={handleSave} fullWidth disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
}
