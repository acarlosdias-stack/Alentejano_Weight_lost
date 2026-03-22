"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import type { ActivityLog, ActivityLogInsert, ActivityLogUpdate } from "@/lib/supabase/types";

function calcDistance(speedKmh: number, durationMin: number): number {
  return Math.round(speedKmh * (durationMin / 60) * 100) / 100;
}

function estimateCalories(speedKmh: number, durationMin: number, weightKg: number): number {
  const met = speedKmh < 7 ? speedKmh / 3.5 : speedKmh / 2.8;
  return Math.round(met * weightKg * (durationMin / 60));
}

interface LogTreadmillModalProps {
  open: boolean;
  onClose: () => void;
  session?: ActivityLog;
  onSave: (data: ActivityLogInsert | ActivityLogUpdate, id?: string) => Promise<void>;
}

export function LogTreadmillModal({ open, onClose, session, onSave }: LogTreadmillModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const { profile } = useProfile();

  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState("");
  const [speed, setSpeed] = useState("");
  const [incline, setIncline] = useState("");
  const [distance, setDistance] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [distanceTouched, setDistanceTouched] = useState(false);
  const [caloriesTouched, setCaloriesTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (session) {
      setDate(session.logged_at.split("T")[0]);
      setDuration(String(session.duration_min));
      setSpeed(session.speed_kmh != null ? String(session.speed_kmh) : "");
      setIncline(session.incline_pct != null ? String(session.incline_pct) : "");
      setDistance(session.distance_km != null ? String(session.distance_km) : "");
      setCalories(session.calories_kcal != null ? String(session.calories_kcal) : "");
      setNotes(session.notes ?? "");
      // treat pre-filled values as manually set when editing
      setDistanceTouched(true);
      setCaloriesTouched(true);
    } else {
      setDate(today);
      setDuration("");
      setSpeed("");
      setIncline("");
      setDistance("");
      setCalories("");
      setNotes("");
      setDistanceTouched(false);
      setCaloriesTouched(false);
    }
  }, [session, open, today]);

  // Auto-calc distance + calories when speed/duration change (if not manually touched)
  useEffect(() => {
    const d = Number(duration);
    const s = Number(speed);
    if (!d || !s) return;

    if (!distanceTouched) {
      setDistance(String(calcDistance(s, d)));
    }
    if (!caloriesTouched) {
      const weightKg = profile?.current_weight_kg ?? 80;
      setCalories(String(estimateCalories(s, d, weightKg)));
    }
  }, [duration, speed, distanceTouched, caloriesTouched, profile?.current_weight_kg]);

  const isValid = duration.trim() !== "" && speed.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);

    const logged_at = new Date(date + "T12:00:00").toISOString();

    const payload: ActivityLogInsert = {
      user_id: "", // will be set in hook
      type: "treadmill",
      duration_min: Number(duration),
      speed_kmh: Number(speed),
      incline_pct: incline !== "" ? Number(incline) : null,
      distance_km: distance !== "" ? Number(distance) : null,
      calories_kcal: calories !== "" ? Number(calories) : null,
      notes: notes.trim() || null,
      logged_at,
    };

    await onSave(payload, session?.id);
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={session ? "Edit Treadmill" : "Treadmill Session"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Date"
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
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
            label="Speed"
            type="number"
            step="0.1"
            min="0"
            suffix="km/h"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            required
          />
        </div>

        <Input
          label="Incline (optional)"
          type="number"
          step="0.5"
          min="0"
          suffix="%"
          value={incline}
          onChange={(e) => setIncline(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Distance"
            type="number"
            step="0.01"
            min="0"
            suffix="km"
            value={distance}
            onChange={(e) => { setDistance(e.target.value); setDistanceTouched(true); }}
          />
          <Input
            label="Calories"
            type="number"
            min="0"
            suffix="kcal"
            value={calories}
            onChange={(e) => { setCalories(e.target.value); setCaloriesTouched(true); }}
          />
        </div>

        <Input
          label="Notes (optional)"
          placeholder="e.g. Warm-up walk"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" fullWidth disabled={saving || !isValid}>
          {saving ? "Saving..." : session ? "Save Changes" : "Save Session"}
        </Button>
      </form>
    </Modal>
  );
}
