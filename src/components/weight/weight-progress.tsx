import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { WeightLog } from "@/lib/supabase/types";

interface WeightProgressProps {
  logs: WeightLog[];
  monthlyChange: number | null;
}

export function WeightProgress({ logs, monthlyChange }: WeightProgressProps) {
  return (
    <div className="space-y-4">
      {monthlyChange !== null && (
        <div className="bg-tertiary-fixed/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-lg">📈</span>
          <div>
            <p className="text-label-sm text-on-surface/50 uppercase tracking-wider">
              Progress
            </p>
            <p className="font-display text-title-md font-bold text-on-surface">
              {monthlyChange > 0 ? "+" : ""}
              {monthlyChange} kg this month
            </p>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <Card>
          <h3 className="font-display text-title-md font-semibold mb-3">
            Recent Entries
          </h3>
          <div className="space-y-3">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-label-sm text-on-surface/50">
                  {formatDate(log.logged_at)}
                </span>
                <span className="font-display text-title-md font-semibold">
                  {log.weight_kg} kg
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
