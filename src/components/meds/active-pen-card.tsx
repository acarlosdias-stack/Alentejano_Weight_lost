import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Pen } from "@/lib/supabase/types";

interface ActivePenCardProps {
  pen: Pen;
  nextDoseDate: string | null;
  onLogDose: () => void;
}

export function ActivePenCard({ pen, nextDoseDate, onLogDose }: ActivePenCardProps) {
  const percentage = Math.round((pen.remaining_mg / pen.total_mg) * 100);

  return (
    <div className="vitality-gradient px-6 pt-5 pb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-label-sm text-white/65 uppercase tracking-wider">Current Supply</p>
          <p className="text-body-md text-white/55 mt-0.5">{pen.name}</p>
        </div>
        <span className="bg-tertiary-fixed text-[#003d58] rounded-full text-[0.625rem] font-body font-bold px-3 py-1 uppercase tracking-wide">
          In Use
        </span>
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
    </div>
  );
}
