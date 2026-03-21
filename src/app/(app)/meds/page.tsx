"use client";

import { useState } from "react";
import { usePens } from "@/hooks/use-pens";
import { useDoses } from "@/hooks/use-doses";
import { RegisterPenForm } from "@/components/meds/register-pen-form";
import { ActivePenCard } from "@/components/meds/active-pen-card";
import { LogDoseModal } from "@/components/meds/log-dose-modal";
import { DoseHistory } from "@/components/meds/dose-history";
import { TreatmentTip } from "@/components/meds/treatment-tip";

export default function MedsPage() {
  const { activePen, registerPen, updatePenRemaining } = usePens();
  const { doses, logDose, getNextDoseDate } = useDoses(activePen?.id);
  const [doseModalOpen, setDoseModalOpen] = useState(false);

  async function handleLogDose(doseMg: number, takenAt: string, notes?: string) {
    if (!activePen) return;
    const { error } = await logDose(activePen.id, doseMg, takenAt, "dose", notes);
    if (!error) {
      await updatePenRemaining(activePen.id, activePen.remaining_mg - doseMg);
    }
  }

  return (
    <div className="space-y-6">
      <RegisterPenForm onRegister={registerPen} />

      {activePen && (
        <ActivePenCard
          pen={activePen}
          nextDoseDate={getNextDoseDate()}
          onLogDose={() => setDoseModalOpen(true)}
        />
      )}

      <DoseHistory doses={doses} />

      <TreatmentTip />

      {activePen && (
        <LogDoseModal
          open={doseModalOpen}
          onClose={() => setDoseModalOpen(false)}
          onLog={handleLogDose}
          maxMg={activePen.remaining_mg}
        />
      )}
    </div>
  );
}
