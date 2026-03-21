import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import type { Dose } from "@/lib/supabase/types";

interface DoseHistoryProps {
  doses: Dose[];
}

export function DoseHistory({ doses }: DoseHistoryProps) {
  if (doses.length === 0) {
    return (
      <Card variant="flat">
        <p className="text-body-md text-on-surface/50 text-center py-4">
          No doses logged yet
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-headline-sm">Dose History</h3>
          <p className="text-label-sm text-on-surface/50">
            Your recent treatment journey
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {doses.map((dose) => (
          <Card key={dose.id} className="flex items-center gap-4">
            <span className="text-2xl">
              {dose.type === "initialization" ? "📋" : "💉"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-title-md font-semibold">
                {dose.type === "initialization"
                  ? "Pen Initialization"
                  : "Weekly Dose Injection"}
              </p>
              <p className="text-label-sm text-on-surface/50">
                {formatDate(dose.taken_at)} &middot; {formatTime(dose.taken_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-headline-sm">{dose.dose_mg} mg</p>
              <Badge variant={dose.type === "initialization" ? "info" : "success"}>
                {dose.type === "initialization" ? "REGISTERED" : "COMPLETED"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
