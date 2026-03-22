import { describe, it, expect } from 'vitest'
import {
  filterLogsByRange,
  computeWeightStats,
  computeInsight,
  getDoseDateSet,
  toChartData,
} from '@/lib/weight-chart-utils'

// Helpers
const makeLog = (weight_kg: number, daysAgo: number) => ({
  id: String(daysAgo),
  user_id: 'u1',
  weight_kg,
  body_fat_pct: null,
  bmi: null,
  source: 'manual' as const,
  photo_url: null,
  logged_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  created_at: new Date().toISOString(),
})

const makeDose = (daysAgo: number) => ({
  id: String(daysAgo),
  pen_id: 'p1',
  user_id: 'u1',
  type: 'dose' as const,
  dose_mg: 5,
  taken_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  notes: null,
  created_at: new Date().toISOString(),
})

const logs = [
  makeLog(96.3, 0),   // today
  makeLog(98.0, 30),  // 1 month ago
  makeLog(100.0, 60), // 2 months ago
  makeLog(102.0, 90), // 3 months ago
]

describe('filterLogsByRange', () => {
  it('1M returns only logs from last 31 days', () => {
    const result = filterLogsByRange(logs, '1M')
    expect(result.length).toBe(2) // today + 30 days ago
  })

  it('3M returns only logs from last 93 days', () => {
    const result = filterLogsByRange(logs, '3M')
    expect(result.length).toBe(4)
  })

  it('all returns all logs', () => {
    const result = filterLogsByRange(logs, 'all')
    expect(result.length).toBe(4)
  })

  it('returns empty array for empty input', () => {
    expect(filterLogsByRange([], '1M')).toEqual([])
  })
})

describe('computeWeightStats', () => {
  it('computes kg lost, current, and to goal', () => {
    const stats = computeWeightStats(logs, 93)
    expect(stats.kgLost).toBeCloseTo(5.7, 1)
    expect(stats.current).toBe(96.3)
    expect(stats.toGoal).toBeCloseTo(3.3, 1)
  })

  it('returns null toGoal when goalWeight is null', () => {
    const stats = computeWeightStats(logs, null)
    expect(stats.toGoal).toBeNull()
  })

  it('returns null kgLost for empty logs', () => {
    const stats = computeWeightStats([], 93)
    expect(stats.kgLost).toBeNull()
    expect(stats.current).toBeNull()
  })
})

describe('computeInsight', () => {
  it('returns on-track when there is net weight loss', () => {
    const insight = computeInsight(logs)
    expect(insight.onTrack).toBe(true)
    expect(insight.avgMonthlyLoss).toBeGreaterThan(0)
  })

  it('returns not on-track when weight has increased (gain scenario)', () => {
    // makeLog(100, 0) = 100 kg today (newest, HIGHER), makeLog(98, 30) = 98 kg 30 days ago (oldest, LOWER)
    // totalLoss = oldest - newest = 98 - 100 = -2 (negative) → avgMonthlyLoss < 0 → onTrack = false
    const gainLogs = [makeLog(100, 0), makeLog(98, 30)]
    const insight = computeInsight(gainLogs)
    expect(insight.onTrack).toBe(false)
  })

  it('returns null for fewer than 2 logs', () => {
    expect(computeInsight([makeLog(96, 0)]).avgMonthlyLoss).toBeNull()
  })
})

describe('getDoseDateSet', () => {
  it('returns a Set of YYYY-MM-DD strings', () => {
    const doses = [makeDose(0), makeDose(7), makeDose(14)]
    const dateSet = getDoseDateSet(doses)
    expect(dateSet.size).toBe(3)
    // Each value is a YYYY-MM-DD string
    for (const d of Array.from(dateSet)) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('returns empty set for empty doses', () => {
    expect(getDoseDateSet([]).size).toBe(0)
  })
})

describe('toChartData', () => {
  it('converts logs to { date, weight } objects', () => {
    const data = toChartData(logs)
    expect(data.length).toBe(4)
    for (const d of data) {
      expect(d).toHaveProperty('date')
      expect(d).toHaveProperty('weight')
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof d.weight).toBe('number')
    }
  })

  it('sorts oldest-first regardless of input order', () => {
    const unordered = [makeLog(96.3, 0), makeLog(102.0, 90), makeLog(98.0, 30)]
    const data = toChartData(unordered)
    // First entry should be oldest (highest daysAgo → earliest date)
    expect(data[0].weight).toBe(102.0)
    expect(data[data.length - 1].weight).toBe(96.3)
  })

  it('returns empty array for empty input', () => {
    expect(toChartData([])).toEqual([])
  })
})
