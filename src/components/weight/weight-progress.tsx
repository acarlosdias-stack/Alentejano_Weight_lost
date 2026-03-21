import { formatDate } from "@/lib/utils";
import type { WeightLog } from "@/lib/supabase/types";

interface WeightProgressProps {
  logs: WeightLog[];
  monthlyChange: number | null;
}

export function WeightProgress({ logs, monthlyChange }: WeightProgressProps) {
  if (logs.length === 0) return null;

  return (
    <div className="mx-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-label-sm text-on-surface/45 uppercase tracking-wider">Recent Entries</p>
        {monthlyChange !== null && (
          <span className={`text-label-sm font-semibold ${monthlyChange <= 0 ? "text-[#00843a]" : "text-red-400"}`}>
            {monthlyChange > 0 ? "+" : ""}{monthlyChange} kg this month
          </span>
        )}
      </div>
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        {logs.slice(0, 10).map((log, i) => {
          const prev = logs[i + 1];
          const delta = prev ? log.weight_kg - prev.weight_kg : null;
          return (
            <div
              key={log.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i < logs.length - 1 ? "border-b border-outline-variant/10" : ""
              }`}
            >
              <p className="text-body-md text-on-surface/60">{formatDate(log.logged_at)}</p>
              <div className="flex items-center gap-3">
                {delta !== null && (
                  <span className={`text-label-sm font-semibold ${delta < 0 ? "text-[#00843a]" : delta > 0 ? "text-red-400" : "text-on-surface/30"}`}>
                    {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                  </span>
                )}
                <p className="font-display text-title-md text-primary font-semibold w-16 text-right">
                  {log.weight_kg} kg
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
