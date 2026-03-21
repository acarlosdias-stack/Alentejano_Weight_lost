"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Pen } from "@/lib/supabase/types";

interface ActivePenCardProps {
  pen: Pen;
  nextDoseDate: string | null;
  onLogDose: () => void;
  onEdit: () => void;
  onDelete: (penId: string) => Promise<unknown>;
}

export function ActivePenCard({ pen, nextDoseDate, onLogDose, onEdit, onDelete }: ActivePenCardProps) {
  const percentage = Math.round((pen.remaining_mg / pen.total_mg) * 100);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onDelete(pen.id);
    setDeleting(false);
    setConfirmDelete(false);
  }

  return (
    <div className="vitality-gradient px-6 pt-5 pb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-label-sm text-white/65 uppercase tracking-wider">Current Supply</p>
          <p className="text-body-md text-white/55 mt-0.5">{pen.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-tertiary-fixed text-[#003d58] rounded-full text-[0.625rem] font-body font-bold px-3 py-1 uppercase tracking-wide">
            In Use
          </span>
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit pen"
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Pencil size={13} strokeWidth={2} className="text-white" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete pen"
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-400/60 transition-colors"
          >
            <Trash2 size={13} strokeWidth={2} className="text-white" />
          </button>
        </div>
      </div>

      <p className="font-display font-extrabold text-[3rem] text-white leading-none">
        {pen.remaining_mg}
        <span className="text-body-md font-body font-normal text-white/65 ml-1">mg remaining</span>
      </p>

      <ProgressBar
        value={pen.remaining_mg}
        max={pen.total_mg}
        color="bg-tertiary-fixed"
        className="h-[4px] mt-4 mb-4"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/60 text-label-sm">
          <Calendar size={13} strokeWidth={1.75} />
          <span>Next: {nextDoseDate ? formatDate(nextDoseDate) : "Not set"}</span>
          <span className="mx-1 opacity-40">·</span>
          <span>{percentage}%</span>
        </div>
        <Button type="button" variant="ghost-white" onClick={onLogDose}>
          Log Dose
        </Button>
      </div>

      {/* Inline delete confirm */}
      {confirmDelete && (
        <div className="mt-4 bg-white/15 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-white text-label-sm font-semibold">Delete this pen?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-white/70 text-label-sm font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-white text-label-sm font-bold px-3 py-1.5 rounded-full bg-red-500/70 hover:bg-red-500/90 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
