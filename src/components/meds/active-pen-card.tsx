import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/utils";
import type { Pen } from "@/lib/supabase/types";

interface ActivePenCardProps {
  pen: Pen;
  nextDoseDate: string | null;
  onLogDose: () => void;
}

export function ActivePenCard({
  pen,
  nextDoseDate,
  onLogDose,
}: ActivePenCardProps) {
  const percentage = Math.round((pen.remaining_mg / pen.total_mg) * 100);

  return (
    <Card variant="gradient" className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/70 text-label-sm uppercase tracking-wider">
          Current Supply
        </p>
        <Badge variant="success">In Use</Badge>
      </div>

      <div>
        <p className="text-white/70 text-label-sm">{pen.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-display-lg text-white">
            {pen.remaining_mg}
          </span>
          <span className="text-white/70 text-body-md">mg remaining</span>
          <span className="ml-auto text-white font-display text-headline-sm">
            {percentage}%
          </span>
        </div>
      </div>

      <ProgressBar
        value={pen.remaining_mg}
        max={pen.total_mg}
        color="bg-tertiary-fixed"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70 text-label-sm">
          <span>📅</span>
          <span>
            Next due: {nextDoseDate ? formatDate(nextDoseDate) : "Not set"}
          </span>
        </div>
        <Button type="button" variant="secondary" onClick={onLogDose}>
          Log Dose
        </Button>
      </div>
    </Card>
  );
}
