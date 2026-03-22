import type { Dose, Pen } from '@/lib/supabase/types'

export type SortOrder = 'newest' | 'oldest'

export interface MilestoneInfo {
  from: number
  to: number
}

/**
 * Detect dose upgrades. Returns a Map from dose.id → { from, to }
 * for any dose whose dose_mg is higher than the previous (chronologically earlier) dose.
 * Input `doses` can be in any order.
 */
export function detectMilestones(doses: Dose[]): Map<string, MilestoneInfo> {
  const milestones = new Map<string, MilestoneInfo>()
  // Sort oldest-first for comparison
  const sorted = [...doses].sort(
    (a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
  )
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].dose_mg > sorted[i - 1].dose_mg) {
      milestones.set(sorted[i].id, {
        from: sorted[i - 1].dose_mg,
        to: sorted[i].dose_mg,
      })
    }
  }
  return milestones
}

export interface AdherenceResult {
  percentage: number
  onTimeDoses: number
  expectedDoses: number
}

/**
 * Compute adherence: doses logged within ±2 days of the expected 7-day interval.
 * The first dose (initialization) is always on time.
 * Input `doses` can be in any order.
 */
export function computeAdherence(doses: Dose[]): AdherenceResult {
  if (doses.length === 0) return { percentage: 0, onTimeDoses: 0, expectedDoses: 0 }

  const sorted = [...doses].sort(
    (a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
  )

  const firstDate = new Date(sorted[0].taken_at).getTime()
  const now = Date.now()
  const weeksElapsed = Math.max(1, Math.floor((now - firstDate) / (7 * 86400000)))
  const expectedDoses = weeksElapsed

  let onTimeDoses = 1 // First dose always on time
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].taken_at).getTime()
    const curr = new Date(sorted[i].taken_at).getTime()
    const intervalDays = (curr - prev) / 86400000
    if (Math.abs(intervalDays - 7) <= 2) {
      onTimeDoses++
    }
  }

  const percentage = Math.round(Math.min(100, (onTimeDoses / expectedDoses) * 100))
  return { percentage, onTimeDoses, expectedDoses }
}

/** Build a CSV string from all doses. */
export function exportDosesAsCsv(doses: Dose[], pens: Pen[]): string {
  const penMap = new Map(pens.map(p => [p.id, p.name ?? `Pen #${p.id.slice(0, 4)}`]))
  const header = 'date,time,type,dose_mg,pen_name,notes'
  const rows = [...doses]
    .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
    .map(d => {
      const dt = new Date(d.taken_at)
      const date = dt.toISOString().slice(0, 10)
      const time = dt.toTimeString().slice(0, 5)
      const penName = penMap.get(d.pen_id) ?? ''
      const notes = d.notes ?? ''
      return `${date},${time},${d.type},${d.dose_mg},${penName},${notes}`
    })
  return [header, ...rows].join('\n')
}

export type EntryKind = 'upcoming' | 'dose' | 'initialization' | 'milestone' | 'pen-change'

export interface TimelineEntry {
  kind: EntryKind
  id: string
  dose?: Dose
  penName?: string
  milestone?: MilestoneInfo
  nextDoseDate?: string // for 'upcoming' kind
}

/**
 * Build the full list of timeline entries for rendering, including
 * upcoming dose, pen-change separators, and milestone entries.
 */
export function buildTimelineEntries(
  doses: Dose[],
  pens: Pen[],
  sort: SortOrder
): TimelineEntry[] {
  if (doses.length === 0) return []

  const penMap = new Map(pens.map(p => [p.id, p.name ?? `Pen #${p.id.slice(0, 4)}`]))
  const milestones = detectMilestones(doses)

  // Sort newest-first for processing
  const sorted = [...doses].sort(
    (a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
  )

  // Compute next dose date (last taken_at + 7 days)
  const lastDose = sorted[0]
  const nextDate = new Date(new Date(lastDose.taken_at).getTime() + 7 * 86400000)
  const nextDoseDate = nextDate.toISOString()
  const nextDoseIsInFuture = nextDate.getTime() > Date.now()

  // Build core entries (newest first)
  const entries: TimelineEntry[] = []

  // Upcoming entry
  if (nextDoseIsInFuture) {
    entries.push({
      kind: 'upcoming',
      id: 'upcoming',
      nextDoseDate,
      penName: penMap.get(lastDose.pen_id),
      dose: { ...lastDose, dose_mg: lastDose.dose_mg },
    })
  }

  // Dose entries with pen-change separators
  for (let i = 0; i < sorted.length; i++) {
    const dose = sorted[i]
    const prevDose = sorted[i - 1]

    // Insert pen-change banner when pen changes.
    // In newest-first order: sorted[i-1] is the MORE RECENT entry (prevDose).
    // The pen that "started" is prevDose's pen — the newer pen that replaced the older one.
    if (i > 0 && prevDose.pen_id !== dose.pen_id) {
      entries.push({
        kind: 'pen-change',
        id: `pen-change-${prevDose.pen_id}`,
        penName: penMap.get(prevDose.pen_id),
      })
    }

    // Insert milestone entry before the dose that triggered it
    if (milestones.has(dose.id)) {
      entries.push({
        kind: 'milestone',
        id: `milestone-${dose.id}`,
        milestone: milestones.get(dose.id),
        dose,
      })
    }

    entries.push({
      kind: dose.type === 'initialization' ? 'initialization' : 'dose',
      id: dose.id,
      dose,
      penName: penMap.get(dose.pen_id),
    })
  }

  // Apply sort
  if (sort === 'oldest') {
    // Reverse everything except the upcoming entry (which goes to the bottom)
    const upcoming = entries.filter(e => e.kind === 'upcoming')
    const rest = entries.filter(e => e.kind !== 'upcoming').reverse()
    return [...rest, ...upcoming]
  }

  return entries
}
