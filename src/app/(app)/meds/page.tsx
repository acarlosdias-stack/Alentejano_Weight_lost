"use client";

import { useState, useCallback } from "react";
import { Pill } from "lucide-react";
import { usePens } from "@/hooks/use-pens";
import { useDoses } from "@/hooks/use-doses";
import { ActivePenCard } from "@/components/meds/active-pen-card";
import { RegisterPenForm } from "@/components/meds/register-pen-form";
import { LogDoseModal } from "@/components/meds/log-dose-modal";
import { DoseHistory } from "@/components/meds/dose-history";
import { TreatmentTip } from "@/components/meds/treatment-tip";
import { EditPenModal } from "@/components/meds/edit-pen-modal";
import { PenHistoryList } from "@/components/meds/pen-history";

export default function MedsPage() {
  const { pens, activePen, registerPen, updatePenRemaining, updatePen, deletePen } = usePens();
  const { doses, logDose, updateDose, deleteDose, getNextDoseDate } = useDoses(activePen?.id);
  // Only valid when activePen is set — useDoses(activePen?.id) returns all-pens data when penId is undefined.
  // Safe: EditPenModal is gated by {activePen && ...} so totalDosesTaken is never consumed without an active pen.
  const totalDosesTaken = doses.filter(d => d.type === 'dose').reduce((s, d) => s + d.dose_mg, 0);
  const depletedPens = pens.filter(p => p.status !== 'active');
  const [doseModalOpen, setDoseModalOpen] = useState(false);
  const [editPenOpen, setEditPenOpen] = useState(false);

  const handleLogDose = useCallback(async (doseMg: number, takenAt: string, notes?: string) => {
    if (!activePen) return;
    const { error } = await logDose(activePen.id, doseMg, takenAt, "dose", notes);
    if (!error) {
      await updatePenRemaining(activePen.id, activePen.remaining_mg - doseMg);
    }
  }, [activePen, logDose, updatePenRemaining]);

  return (
    <div>
      {/* Hero section */}
      {activePen ? (
        <ActivePenCard
          pen={activePen}
          nextDoseDate={getNextDoseDate()}
          onLogDose={() => setDoseModalOpen(true)}
          onEdit={() => setEditPenOpen(true)}
          onDelete={deletePen}
        />
      ) : (
        <div className="vitality-gradient px-6 pt-8 pb-10 flex flex-col items-center text-center">
          <Pill size={48} strokeWidth={1.25} className="text-white/35 mb-4" />
          <p className="font-display text-headline-sm text-white">No Active Pen</p>
          <p className="text-body-md text-white/60 mt-1">Register your Mounjaro pen below</p>
        </div>
      )}

      {/* Tonal section */}
      <div className="bg-surface-container-low px-5 pt-4 pb-24 space-y-4">
        <RegisterPenForm onRegister={registerPen} collapsed={!!activePen} />

        {doses.length > 0 && (
          <div>
            <p className="text-label-sm text-on-surface/45 uppercase tracking-wider mb-3">Dose History</p>
            <DoseHistory
              doses={doses}
              onUpdateDose={updateDose}
              onDeleteDose={deleteDose}
            />
          </div>
        )}

        <PenHistoryList pens={depletedPens} />

        <TreatmentTip />
      </div>

      {activePen && (
        <LogDoseModal
          open={doseModalOpen}
          onClose={() => setDoseModalOpen(false)}
          onLog={handleLogDose}
          maxMg={activePen.remaining_mg}
        />
      )}

      {activePen && (
        <EditPenModal
          pen={activePen}
          open={editPenOpen}
          onClose={() => setEditPenOpen(false)}
          onSave={updatePen}
          totalDosesTaken={totalDosesTaken}
        />
      )}
    </div>
  );
}
