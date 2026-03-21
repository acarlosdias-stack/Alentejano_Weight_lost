"use client";

import { useState } from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { EditDoseModal } from "@/components/meds/edit-dose-modal";
import type { Dose } from "@/lib/supabase/types";

interface DoseHistoryProps {
  doses: Dose[];
  onUpdateDose: (doseId: string, updates: { dose_mg?: number; taken_at?: string; notes?: string | null }) => Promise<unknown>;
  onDeleteDose: (doseId: string) => Promise<unknown>;
}

function DoseRow({
  dose,
  onEdit,
  onDelete,
}: {
  dose: Dose;
  onEdit: (dose: Dose) => void;
  onDelete: (doseId: string) => Promise<unknown>;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onDelete(dose.id);
    setDeleting(false);
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Clock size={16} strokeWidth={1.75} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-title-md font-semibold text-on-surface">
            {dose.type === "initialization" ? "Pen Registered" : "Weekly Dose"}
          </p>
          <p className="text-label-sm text-on-surface/45 mt-0.5">
            {formatDate(dose.taken_at)} &middot; {formatTime(dose.taken_at)}
          </p>
          {dose.notes && (
            <p className="text-label-sm text-on-surface/55 mt-0.5 italic">{dose.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="text-right mr-1">
            <p className="font-display text-headline-sm text-on-surface">{dose.dose_mg} mg</p>
            <span className={`inline-block mt-0.5 rounded text-[0.625rem] font-body font-bold px-2 py-0.5 uppercase tracking-wide ${
              dose.type === "initialization"
                ? "bg-primary/10 text-primary"
                : "bg-[#00843a]/10 text-[#00843a]"
            }`}>
              {dose.type === "initialization" ? "Registered" : "Completed"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEdit(dose)}
            aria-label="Edit dose"
            className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <Pencil size={13} strokeWidth={2} className="text-on-surface/50" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete dose"
            className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <Trash2 size={13} strokeWidth={2} className="text-on-surface/40 hover:text-red-500" />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="border-t border-outline-variant/10 px-4 py-3 bg-surface-container-low flex items-center justify-between gap-3">
          <p className="text-label-sm text-on-surface/70 font-semibold">Delete this entry?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-on-surface/60 text-label-sm font-semibold px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-white text-label-sm font-bold px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DoseHistory({ doses, onUpdateDose, onDeleteDose }: DoseHistoryProps) {
  const [editingDose, setEditingDose] = useState<Dose | null>(null);

  if (doses.length === 0) {
    return (
      <p className="text-body-md text-on-surface/40 text-center py-6">
        No doses logged yet
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {doses.map((dose) => (
          <DoseRow
            key={dose.id}
            dose={dose}
            onEdit={setEditingDose}
            onDelete={onDeleteDose}
          />
        ))}
      </div>

      {editingDose && (
        <EditDoseModal
          dose={editingDose}
          open={!!editingDose}
          onClose={() => setEditingDose(null)}
          onSave={onUpdateDose}
        />
      )}
    </>
  );
}
