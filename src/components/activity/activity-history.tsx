"use client";

import { useState } from "react";
import {
  Dumbbell, Footprints, Zap, Leaf, Star, Activity,
  Pencil, Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ActivityLog } from "@/lib/supabase/types";

function getIcon(log: ActivityLog) {
  if (log.type === "treadmill") return Activity;
  switch (log.workout_type) {
    case "strength": return Dumbbell;
    case "cardio":   return Footprints;
    case "hiit":     return Zap;
    case "yoga":     return Leaf;
    default:         return Star;
  }
}

function getDisplayName(log: ActivityLog): string {
  if (log.type === "treadmill") return "Treadmill";
  if (log.workout_type === "other") return log.custom_type_name ?? "Custom";
  const labels: Record<string, string> = {
    strength: "Strength Training",
    cardio: "Cardio",
    hiit: "HIIT",
    yoga: "Yoga",
  };
  return labels[log.workout_type ?? ""] ?? "Workout";
}

interface ActivityHistoryProps {
  workoutLogs: ActivityLog[];
  treadmillLogs: ActivityLog[];
  onEdit: (session: ActivityLog) => void;
  onDelete: (id: string) => void;
}

export function ActivityHistory({
  workoutLogs,
  treadmillLogs,
  onEdit,
  onDelete,
}: ActivityHistoryProps) {
  const [activeTab, setActiveTab] = useState<"workout" | "treadmill">("workout");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const logs = activeTab === "workout" ? workoutLogs : treadmillLogs;

  return (
    <div className="bg-surface-container-low rounded-2xl p-5">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["workout", "treadmill"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setConfirmDeleteId(null); }}
            className={`px-4 py-1.5 rounded-full font-display font-bold text-sm transition-colors ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface/60 hover:bg-surface-container-high"
            }`}
          >
            {tab === "workout" ? "Workouts" : "Treadmill"}
          </button>
        ))}
      </div>

      {logs.length === 0 ? (
        <p className="text-label-sm text-on-surface-variant text-center py-6">
          No {activeTab === "workout" ? "workouts" : "treadmill sessions"} logged yet.
        </p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const Icon = getIcon(log);
            const isConfirming = confirmDeleteId === log.id;

            if (isConfirming) {
              return (
                <div
                  key={log.id}
                  className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between gap-2"
                >
                  <p className="text-label-sm text-on-surface-variant">
                    Delete &ldquo;{getDisplayName(log)}&rdquo;?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onDelete(log.id); setConfirmDeleteId(null); }}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white font-display font-bold text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1 rounded-lg bg-surface-container-high font-display font-bold text-xs text-on-surface-variant"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={log.id}
                className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
                    <Icon size={20} strokeWidth={1.75} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">{getDisplayName(log)}</p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">
                      {formatDate(log.logged_at)} · {log.duration_min} min
                      {log.type === "treadmill" && log.speed_kmh ? ` · ${log.speed_kmh} km/h` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {log.calories_kcal != null && (
                    <div className="text-right mr-1">
                      <p className="font-display font-bold text-sm text-primary">{log.calories_kcal}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">kcal</p>
                    </div>
                  )}
                  <button
                    onClick={() => onEdit(log)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  >
                    <Pencil size={12} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(log.id)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
