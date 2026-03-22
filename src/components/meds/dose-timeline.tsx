"use client";

import { useState } from "react";
import { ArrowDownUp, Download } from "lucide-react";
import {
  buildTimelineEntries,
  computeAdherence,
  exportDosesAsCsv,
  type SortOrder,
} from "@/lib/dose-timeline-utils";
import type { Dose, Pen } from "@/lib/supabase/types";

// EditDoseModal does not exist in src/components/meds/ — omitted

interface DoseTimelineProps {
  doses: Dose[];
  pens: Pen[];
  onUpdateDose: (doseId: string, updates: { dose_mg?: number; taken_at?: string; notes?: string | null }) => Promise<unknown>;
  onDeleteDose: (doseId: string) => Promise<unknown>;
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

function getMonthLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en", { month: "long", year: "numeric" }).toUpperCase();
}

export function DoseTimeline({ doses, pens, onUpdateDose: _onUpdateDose, onDeleteDose: _onDeleteDose }: DoseTimelineProps) {
  const [sort, setSort] = useState<SortOrder>("newest");

  if (doses.length === 0) {
    return (
      <p className="text-sm text-on-surface/40 text-center py-6">No doses logged yet</p>
    );
  }

  const adherence = computeAdherence(doses);
  const entries = buildTimelineEntries(doses, pens, sort);

  function handleExport() {
    const csv = exportDosesAsCsv(doses, pens);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mounjaro-doses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Track last rendered month for separators
  let lastMonth = "";

  return (
    <>
      {/* Summary card */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">
            Total doses logged
          </p>
          <p className="font-bold text-3xl text-white leading-none">
            {doses.length}
          </p>
          <p className="text-[10px] text-white/60 mt-1">
            {doses.length > 0
              ? `Since ${formatShortDate(
                  [...doses].sort(
                    (a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
                  )[0].taken_at
                )} · ${pens.length} pen${pens.length !== 1 ? "s" : ""} used`
              : ""}
          </p>
        </div>
        {/* Adherence ring */}
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" />
          <circle
            cx="30" cy="30" r="24"
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeDasharray={`${(adherence.percentage / 100) * 150.8} 150.8`}
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
          />
          <text x="30" y="35" fontFamily="Manrope" fontSize="11" fontWeight="800" fill="white" textAnchor="middle">
            {adherence.percentage}%
          </text>
        </svg>
      </div>

      {/* Timeline header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-bold text-on-surface">Dose Timeline</p>
          <p className="text-xs text-on-surface/40 mt-0.5">
            All injections · {sort === "newest" ? "newest first" : "oldest first"}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setSort(s => (s === "newest" ? "oldest" : "newest"))}
            className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center"
            aria-label="Toggle sort order"
          >
            <ArrowDownUp size={14} strokeWidth={2} className="text-on-surface/50" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center"
            aria-label="Export CSV"
          >
            <Download size={14} strokeWidth={2} className="text-on-surface/50" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical connecting line */}
        <div className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary-container to-outline-variant/30 rounded-full" />

        {entries.map(entry => {
          // Month separator logic (only for dose/initialization entries)
          let monthLabel: string | null = null;
          if (entry.dose && (entry.kind === "dose" || entry.kind === "initialization")) {
            const m = getMonthLabel(entry.dose.taken_at);
            if (m !== lastMonth) {
              lastMonth = m;
              monthLabel = m;
            }
          }

          return (
            <div key={entry.id}>
              {/* Month separator */}
              {monthLabel && (
                <p className="text-[9px] font-bold tracking-widest text-on-surface/30 uppercase py-2">
                  {monthLabel}
                </p>
              )}

              {/* Pen-change banner */}
              {entry.kind === "pen-change" && (
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-surface-container-high" />
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white">
                    {entry.penName ?? "New Pen"} started
                  </span>
                  <div className="flex-1 h-px bg-surface-container-high" />
                </div>
              )}

              {/* Milestone entry */}
              {entry.kind === "milestone" && entry.milestone && (
                <div className="relative mb-3">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-tertiary-fixed border-2 border-white" />
                  <div className="bg-[rgba(105,255,135,0.10)] border border-[rgba(105,255,135,0.3)] rounded-xl p-3">
                    <p className="text-[9px] font-bold text-[#166534] uppercase tracking-wide">Milestone</p>
                    <p className="text-xs font-bold text-[#166534] mt-0.5">
                      Dose Upgrade: {entry.milestone.from} mg → {entry.milestone.to} mg
                    </p>
                  </div>
                </div>
              )}

              {/* Upcoming entry */}
              {entry.kind === "upcoming" && entry.dose && (
                <div className="relative mb-3">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-outline-variant border-2 border-white" />
                  <div className="border-[1.5px] border-dashed border-outline-variant/50 rounded-xl p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-semibold text-on-surface/40 uppercase tracking-wide">
                          Upcoming
                        </p>
                        <p className="text-xs font-bold text-on-surface/50 mt-0.5">
                          Next Injection
                        </p>
                        <p className="text-[9px] text-on-surface/35 mt-0.5">
                          {entry.nextDoseDate ? formatShortDate(entry.nextDoseDate) : "—"}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface/40">
                        SCHEDULED
                      </span>
                    </div>
                    <p className="font-bold text-base text-on-surface/40 mt-1">
                      {entry.dose.dose_mg} mg
                    </p>
                  </div>
                </div>
              )}

              {/* Regular dose or initialization */}
              {(entry.kind === "dose" || entry.kind === "initialization") && entry.dose && (
                <div className="relative mb-3">
                  <div className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    entry.kind === "initialization"
                      ? "bg-primary-container"
                      : "bg-primary"
                  }`} />
                  {entry.kind === "initialization" ? (
                    <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                            Pen Initialization
                          </p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {entry.penName ?? "Pen"} Registered
                          </p>
                          <p className="text-[9px] text-white/60 mt-0.5">
                            {formatShortDate(entry.dose.taken_at)} · {formatTime(entry.dose.taken_at)}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                          REGISTERED
                        </span>
                      </div>
                      <p className="font-bold text-lg text-white mt-1">
                        {entry.dose.dose_mg} mg
                      </p>
                    </div>
                  ) : (
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-semibold text-on-surface/40 uppercase tracking-wide">
                            Weekly Dose Injection
                          </p>
                          <p className="text-[9px] text-on-surface/40 mt-0.5">
                            {formatShortDate(entry.dose.taken_at)} · {formatTime(entry.dose.taken_at)}
                          </p>
                          {entry.dose.notes && (
                            <p className="text-[9px] text-on-surface/50 italic mt-0.5">{entry.dose.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[rgba(105,255,135,0.15)] text-[#166534]">
                            COMPLETED
                          </span>
                          <div className="flex gap-1 mt-1.5 justify-end">
                            <button
                              type="button"
                              className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center"
                              aria-label="Edit dose"
                            >
                              <span className="text-[10px]">✏️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="font-bold text-base text-primary mt-1">
                        {entry.dose.dose_mg} mg
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
