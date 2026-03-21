"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { usePens } from "@/hooks/use-pens";
import { useDoses } from "@/hooks/use-doses";
import { useWeight } from "@/hooks/use-weight";
import { MomentumCard } from "@/components/home/momentum-card";
import { PenQuickStatus } from "@/components/home/pen-quick-status";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { activePen } = usePens();
  const { getNextDoseDate } = useDoses(activePen?.id);
  const { logs, latestWeight, getMonthlyChange } = useWeight();

  if (profileLoading || !profile) {
    return <p className="text-body-md text-on-surface/50">Loading...</p>;
  }

  const dosesRemaining = activePen
    ? Math.floor(activePen.remaining_mg / 2.5)
    : 0;
  const monthlyChange = getMonthlyChange();

  return (
    <div className="space-y-6">
      <MomentumCard profile={profile} weightLogs={logs} />

      <PenQuickStatus
        pen={activePen}
        nextDoseDate={getNextDoseDate()}
        dosesRemaining={dosesRemaining}
      />

      {/* Compact weight summary — tap to open Activity tab for full logging */}
      <Link href="/activity">
        <Card className="cursor-pointer">
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-on-surface/50 uppercase tracking-wider">
              Latest Weight
            </p>
            {monthlyChange !== null && (
              <span className={`text-label-sm font-semibold ${monthlyChange <= 0 ? "text-tertiary-fixed" : "text-red-400"}`}>
                {monthlyChange > 0 ? "+" : ""}{monthlyChange} kg this month
              </span>
            )}
          </div>
          {latestWeight ? (
            <p className="font-display text-display-lg text-primary leading-none mt-1">
              {latestWeight} <span className="text-body-md text-on-surface/50">kg</span>
            </p>
          ) : (
            <p className="text-body-md text-on-surface/50 mt-2">
              Tap to log your weight
            </p>
          )}
          {logs[0] && (
            <p className="text-label-sm text-on-surface/40 mt-1">
              Last logged: {formatDate(logs[0].logged_at)}
            </p>
          )}
        </Card>
      </Link>
    </div>
  );
}
