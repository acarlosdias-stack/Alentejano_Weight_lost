"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDoses } from "@/hooks/use-doses";
import { DoseRow } from "@/components/meds/dose-history";
import type { Pen } from "@/lib/supabase/types";

// PenDoseList owns the useDoses hook unconditionally.
// It is mounted lazily by PenHistoryItem (only after first expand).
function PenDoseList({ penId }: { penId: string }) {
  const { doses, loading } = useDoses(penId);

  if (loading) {
    return (
      <div className="px-4 py-3 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-surface-container animate-pulse" />
        ))}
      </div>
    );
  }

  if (doses.length === 0) {
    return (
      <p className="text-body-md text-on-surface/40 text-center py-4 px-4">
        No doses logged
      </p>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-2">
      {doses.map((dose) => (
        <DoseRow key={dose.id} dose={dose} readOnly />
      ))}
    </div>
  );
}

function PenHistoryItem({ pen }: { pen: Pen }) {
  const [expanded, setExpanded] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);

  function handleToggle() {
    if (!hasExpanded) setHasExpanded(true);
    setExpanded((v) => !v);
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-display text-title-md font-semibold text-on-surface">
            {pen.name ?? "Unnamed Pen"}
          </p>
          <p className="text-label-sm text-on-surface/45 mt-0.5">
            Started {formatDate(pen.registered_at)} &middot; {pen.total_mg} mg
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="rounded text-[0.625rem] font-body font-bold px-2 py-0.5 uppercase tracking-wide bg-on-surface/10 text-on-surface/50">
            {pen.status === 'active' ? 'In Use' : 'Depleted'}
          </span>
          {expanded
            ? <ChevronUp size={16} strokeWidth={1.75} className="text-on-surface/40" />
            : <ChevronDown size={16} strokeWidth={1.75} className="text-on-surface/40" />
          }
        </div>
      </button>

      {/* PenDoseList mounts after first expand, then stays mounted (hidden on collapse) */}
      {hasExpanded && (
        <div className={expanded ? undefined : "hidden"}>
          <div className="border-t border-outline-variant/10" />
          <PenDoseList penId={pen.id} />
        </div>
      )}
    </div>
  );
}

export function PenHistoryList({ pens }: { pens: Pen[] }) {
  if (pens.length === 0) return null;

  return (
    <div>
      <p className="text-label-sm text-on-surface/45 uppercase tracking-wider mb-3">
        Previous Pens
      </p>
      <div className="space-y-3">
        {pens.map((pen) => (
          <PenHistoryItem key={pen.id} pen={pen} />
        ))}
      </div>
    </div>
  );
}
