"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActivityLog, ActivityLogInsert, ActivityLogUpdate } from "@/lib/supabase/types";

type WorkoutType = "strength" | "cardio" | "hiit" | "yoga" | "other";

const WORKOUT_TYPES: { value: WorkoutType; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "other", label: "Other" },
];

interface LogWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  session?: ActivityLog;
  onSave: (data: ActivityLogInsert | ActivityLogUpdate, id?: string) => Promise<void>;
}

export function LogWorkoutModal({ open, onClose, session, onSave }: LogWorkoutModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [workoutType, setWorkoutType] = useState<WorkoutType>("strength");
  const [customName, setCustomName] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (session) {
      setDate(session.logged_at.split("T")[0]);
      setWorkoutType((session.workout_type as WorkoutType) ?? "strength");
      setCustomName(session.custom_type_name ?? "");
      setDuration(String(session.duration_min));
      setCalories(session.calories_kcal != null ? String(session.calories_kcal) : "");
      setNotes(session.notes ?? "");
    } else {
      setDate(today);
      setWorkoutType("strength");
      setCustomName("");
      setDuration("");
      setCalories("");
      setNotes("");
    }
  }, [session, open, today]);

  const isValid =
    duration.trim() !== "" && (workoutType !== "other" || customName.trim() !== "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);

    const logged_at = new Date(date + "T12:00:00").toISOString();

    const payload: ActivityLogInsert = {
      user_id: "", // will be set in hook
      type: "workout",
      workout_type: workoutType,
      custom_type_name: workoutType === "other" ? customName.trim() : null,
      duration_min: Number(duration),
      calories_kcal: calories !== "" ? Number(calories) : null,
      notes: notes.trim() || null,
      logged_at,
    };

    await onSave(payload, session?.id);
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={session ? "Edit Workout" : "Log Workout"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Date"
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div>
          <p className="text-label-sm text-on-surface/70 block mb-1.5">Workout Type</p>
          <div className="flex flex-wrap gap-2">
            {WORKOUT_TYPES.map((wt) => (
              <button
                key={wt.value}
                type="button"
                onClick={() => setWorkoutType(wt.value)}
                className={`px-4 py-1.5 rounded-full font-display font-semibold text-sm transition-colors ${
                  workoutType === wt.value
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface/70 hover:bg-surface-container-high"
                }`}
              >
                {wt.label}
              </button>
            ))}
          </div>
        </div>

        {workoutType === "other" && (
          <Input
            label="Activity Name"
            placeholder="e.g. Padel, Swimming..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
          />
        )}

        <Input
          label="Duration"
          type="number"
          min="1"
          suffix="min"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <Input
          label="Calories (optional)"
          type="number"
          min="0"
          suffix="kcal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />

        <Input
          label="Notes (optional)"
          placeholder="e.g. Chest + triceps"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" fullWidth disabled={saving || !isValid}>
          {saving ? "Saving..." : session ? "Save Changes" : "Log Workout"}
        </Button>
      </form>
    </Modal>
  );
}
