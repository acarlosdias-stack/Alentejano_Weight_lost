"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { usePens } from "@/hooks/use-pens";
import { useDoses } from "@/hooks/use-doses";
import { useWeight } from "@/hooks/use-weight";
import { MomentumCard } from "@/components/home/momentum-card";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

function getDaysAway(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

export default function HomePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { activePen } = usePens();
  const { getNextDoseDate } = useDoses(activePen?.id);
  const { logs, latestWeight, getMonthlyChange } = useWeight();

  if (profileLoading) {
    return <p className="p-5 text-body-md text-on-surface/50">Loading...</p>;
  }

  if (!profile) {
    return <p className="p-5 text-body-md text-on-surface/50">Setting up your profile...</p>;
  }

  const dosesRemaining = activePen ? Math.floor(activePen.remaining_mg / 2.5) : 0;
  const monthlyChange = getMonthlyChange();
  const nextDose = getNextDoseDate();

  return (
    <div>
      {/* Full-bleed hero — no horizontal padding */}
      <MomentumCard profile={profile} weightLogs={logs} />

      {/* Tonal section */}
      <div className="bg-surface-container-low px-5 pt-5 pb-24 space-y-3">

        {/* 2-col stat row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Weight stat */}
          <Link href="/activity">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient cursor-pointer">
              <p className="text-label-sm text-on-surface/45 uppercase tracking-wider mb-2">Weight</p>
              {latestWeight ? (
                <>
                  <p className="font-display font-extrabold text-[1.75rem] text-primary leading-none">
                    {latestWeight}
                    <span className="text-body-md font-body font-normal text-on-surface/40 ml-1">kg</span>
                  </p>
                  {monthlyChange !== null && (
                    <p className={`text-label-sm font-semibold mt-1 ${monthlyChange <= 0 ? "text-tertiary" : "text-red-400"}`}>
                      {monthlyChange > 0 ? "+" : ""}{monthlyChange} kg/mo
                    </p>
                  )}
                </>
              ) : (
                <p className="text-body-md text-on-surface/40 mt-1">Tap to log</p>
              )}
            </div>
          </Link>

          {/* Mounjaro stat */}
          <Link href="/meds">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient cursor-pointer">
              <p className="text-label-sm text-on-surface/45 uppercase tracking-wider mb-2">Mounjaro</p>
              {activePen ? (
                <>
                  <p className="font-display font-extrabold text-[1.75rem] text-primary leading-none">
                    {activePen.remaining_mg}
                    <span className="text-body-md font-body font-normal text-on-surface/40 ml-1">mg</span>
                  </p>
                  <p className="text-label-sm text-on-surface/45 mt-1">{dosesRemaining} doses left</p>
                </>
              ) : (
                <p className="text-body-md text-on-surface/40 mt-1">No active pen</p>
              )}
            </div>
          </Link>
        </div>

        {/* Next injection card */}
        {activePen && (
          <Link href="/meds">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient cursor-pointer flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} strokeWidth={1.75} className="text-primary" />
              </div>
              <div>
                <p className="text-label-sm text-on-surface/45 uppercase tracking-wider">Next Injection</p>
                <p className="font-display text-title-md text-on-surface mt-0.5">
                  {nextDose ? formatDate(nextDose) : "Not scheduled"}
                </p>
                {nextDose && (
                  <p className="text-label-sm text-on-surface/45 mt-0.5">{getDaysAway(nextDose)}</p>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Empty state — no pen registered */}
        {!activePen && (
          <Link href="/meds">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient cursor-pointer">
              <p className="text-body-md text-on-surface/40">
                No active Mounjaro pen. <span className="text-primary font-semibold">Register one →</span>
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
