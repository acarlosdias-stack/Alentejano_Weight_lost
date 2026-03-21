import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Pen } from "@/lib/supabase/types";

interface PenQuickStatusProps {
  pen: Pen | null;
  nextDoseDate: string | null;
  dosesRemaining: number;
}

export function PenQuickStatus({
  pen,
  nextDoseDate,
  dosesRemaining,
}: PenQuickStatusProps) {
  if (!pen) {
    return (
      <Link href="/meds">
        <Card className="text-center py-6 cursor-pointer">
          <p className="text-body-md text-on-surface/50">
            No active pen. Tap to register one in Meds.
          </p>
        </Card>
      </Link>
    );
  }

  return (
    <Link href="/meds">
      <Card className="cursor-pointer">
        <div className="flex items-center justify-between">
          <p className="text-label-sm text-on-surface/50 uppercase tracking-wider">
            Mounjaro Pen
          </p>
          <span className="text-primary text-xl">➕</span>
        </div>
        <p className="font-display text-display-lg text-primary mt-1 leading-none">
          {pen.remaining_mg} mg
        </p>
        <div className="flex items-center gap-2 mt-3 text-label-sm text-on-surface/50">
          <span>📅</span>
          <span>
            Next: {nextDoseDate ? formatDate(nextDoseDate) : "Not scheduled"}
          </span>
        </div>
        <p className="text-label-sm text-on-surface/40 mt-1">
          {dosesRemaining} of {Math.ceil(pen.total_mg / 2.5)} doses remaining
        </p>
      </Card>
    </Link>
  );
}
