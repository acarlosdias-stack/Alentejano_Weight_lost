import type { WeightLog } from '@/lib/supabase/types'
import type { Dose } from '@/lib/supabase/types'

export type RangeOption = '1M' | '3M' | 'all'

/** Filter weight logs to the selected time range. Logs must be sorted newest-first. */
export function filterLogsByRange(logs: WeightLog[], range: RangeOption): WeightLog[] {
  if (range === 'all') return logs
  const days = range === '1M' ? 31 : 93
  const cutoff = Date.now() - days * 86400000
  return logs.filter(l => new Date(l.logged_at).getTime() >= cutoff)
}

export interface WeightStats {
  kgLost: number | null
  current: number | null
  toGoal: number | null
}

/**
 * Compute all-time stats: always uses the full logs array regardless of range.
 * Logs must be sorted newest-first.
 */
export function computeWeightStats(logs: WeightLog[], goalWeight: number | null): WeightStats {
  if (logs.length === 0) return { kgLost: null, current: null, toGoal: null }
  const current = logs[0].weight_kg
  const start = logs[logs.length - 1].weight_kg
  const kgLost = Math.round((start - current) * 10) / 10
  const toGoal = goalWeight != null ? Math.round((current - goalWeight) * 10) / 10 : null
  return { kgLost, current, toGoal }
}

export interface InsightResult {
  avgMonthlyLoss: number | null
  onTrack: boolean
}

/**
 * Compute average monthly loss and on-track status.
 * On-track = net loss over the tracked period (avgMonthlyLoss > 0).
 * Logs must be sorted newest-first.
 */
export function computeInsight(logs: WeightLog[]): InsightResult {
  if (logs.length < 2) return { avgMonthlyLoss: null, onTrack: false }
  const newest = logs[0]
  const oldest = logs[logs.length - 1]
  const msElapsed = new Date(newest.logged_at).getTime() - new Date(oldest.logged_at).getTime()
  const monthsElapsed = msElapsed / (1000 * 60 * 60 * 24 * 30.44)
  if (monthsElapsed <= 0) return { avgMonthlyLoss: null, onTrack: false }
  const totalLoss = oldest.weight_kg - newest.weight_kg
  const avgMonthlyLoss = Math.round((totalLoss / monthsElapsed) * 10) / 10
  return { avgMonthlyLoss, onTrack: avgMonthlyLoss > 0 }
}

/** Return a Set of 'YYYY-MM-DD' strings for all dose dates. */
export function getDoseDateSet(doses: Dose[]): Set<string> {
  return new Set(doses.map(d => d.taken_at.slice(0, 10)))
}

/** Convert weight logs to Recharts-compatible data points. */
export function toChartData(logs: WeightLog[]): { date: string; weight: number }[] {
  return [...logs]
    .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime())
    .map(l => ({
      date: l.logged_at.slice(0, 10),
      weight: l.weight_kg,
    }))
}
