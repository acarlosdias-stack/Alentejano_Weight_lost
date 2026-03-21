import { Clock } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import type { Dose } from "@/lib/supabase/types";

interface DoseHistoryProps {
  doses: Dose[];
}

export function DoseHistory({ doses }: DoseHistoryProps) {
  if (doses.length === 0) {
    return (
      <p className="text-body-md text-on-surface/40 text-center py-6">
        No doses logged yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {doses.map((dose) => (
        <div key={dose.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient flex items-center gap-3">
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
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-headline-sm text-on-surface">{dose.dose_mg} mg</p>
            <span className={`inline-block mt-0.5 rounded text-[0.625rem] font-body font-bold px-2 py-0.5 uppercase tracking-wide ${
              dose.type === "initialization"
                ? "bg-primary/10 text-primary"
                : "bg-[#00843a]/10 text-[#00843a]"
            }`}>
              {dose.type === "initialization" ? "Registered" : "Completed"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
