import { describe, it, expect } from 'vitest'
import {
  detectMilestones,
  computeAdherence,
  exportDosesAsCsv,
  buildTimelineEntries,
} from '@/lib/dose-timeline-utils'
import type { Dose, Pen } from '@/lib/supabase/types'

const makeDate = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString()

const makeDose = (id: string, penId: string, doseMg: number, daysAgo: number, type: 'dose' | 'initialization' = 'dose'): Dose => ({
  id,
  pen_id: penId,
  user_id: 'u1',
  type,
  dose_mg: doseMg,
  taken_at: makeDate(daysAgo),
  notes: null,
  created_at: makeDate(daysAgo),
})

// NOTE: Pen type has no `created_at` field. Fields: id, user_id, name, total_mg, remaining_mg, status, registered_at
const makePen = (id: string, name: string): Pen => ({
  id,
  user_id: 'u1',
  name,
  total_mg: 60,
  remaining_mg: 30,
  status: 'active',
  registered_at: makeDate(60),
})

describe('detectMilestones', () => {
  it('detects an upgrade between consecutive doses', () => {
    const doses = [
      makeDose('d2', 'p1', 7.5, 0),
      makeDose('d1', 'p1', 5, 7),
    ]
    const milestones = detectMilestones(doses)
    expect(milestones.size).toBe(1)
    expect(milestones.get('d2')).toEqual({ from: 5, to: 7.5 })
  })

  it('does not flag a decrease or equal dose as milestone', () => {
    const doses = [
      makeDose('d2', 'p1', 5, 0),
      makeDose('d1', 'p1', 7.5, 7),
    ]
    expect(detectMilestones(doses).size).toBe(0)
  })

  it('returns empty map for fewer than 2 doses', () => {
    expect(detectMilestones([makeDose('d1', 'p1', 5, 0)]).size).toBe(0)
  })
})

describe('computeAdherence', () => {
  it('returns 100% when all doses are on time', () => {
    const doses = [
      makeDose('d3', 'p1', 5, 0),
      makeDose('d2', 'p1', 5, 7),
      makeDose('d1', 'p1', 5, 14, 'initialization'),
    ]
    // 2 weeks elapsed → 2 expected doses → 2 on time = 100%
    const { percentage } = computeAdherence(doses)
    expect(percentage).toBe(100)
  })

  it('returns lower percentage for missed doses', () => {
    // 4 weeks elapsed → 4 expected → only 2 logged
    const doses = [
      makeDose('d2', 'p1', 5, 0),
      makeDose('d1', 'p1', 5, 28, 'initialization'),
    ]
    const { percentage } = computeAdherence(doses)
    expect(percentage).toBeLessThan(100)
    expect(percentage).toBeGreaterThan(0)
  })

  it('returns 0 for empty doses', () => {
    expect(computeAdherence([]).percentage).toBe(0)
  })
})

describe('exportDosesAsCsv', () => {
  it('produces a CSV string with header and one row per dose', () => {
    const doses = [makeDose('d1', 'p1', 5, 7, 'initialization')]
    const pens = [makePen('p1', 'Pen #1')]
    const csv = exportDosesAsCsv(doses, pens)
    const lines = csv.trim().split('\n')
    expect(lines[0]).toBe('date,time,type,dose_mg,pen_name,notes')
    expect(lines.length).toBe(2)
    expect(lines[1]).toContain('5')
    expect(lines[1]).toContain('Pen #1')
  })

  it('uses empty string for null notes', () => {
    const doses = [makeDose('d1', 'p1', 5, 0)]
    const pens = [makePen('p1', 'Pen #1')]
    const csv = exportDosesAsCsv(doses, pens)
    expect(csv.split('\n')[1]).toMatch(/,$/)
  })
})

describe('buildTimelineEntries', () => {
  it('includes an upcoming entry as the first item when next dose is in the future', () => {
    const doses = [makeDose('d1', 'p1', 5, 3, 'initialization')]
    const pens = [makePen('p1', 'Pen #1')]
    const entries = buildTimelineEntries(doses, pens, 'newest')
    expect(entries[0].kind).toBe('upcoming')
  })

  it('includes one entry per dose', () => {
    const doses = [
      makeDose('d2', 'p1', 5, 0),
      makeDose('d1', 'p1', 5, 7, 'initialization'),
    ]
    const pens = [makePen('p1', 'Pen #1')]
    const entries = buildTimelineEntries(doses, pens, 'newest')
    const doseEntries = entries.filter(e => e.kind === 'dose' || e.kind === 'initialization')
    expect(doseEntries.length).toBe(2)
  })

  it('inserts a pen-change separator when pen_id changes', () => {
    const doses = [
      makeDose('d2', 'p2', 7.5, 0, 'initialization'),
      makeDose('d1', 'p1', 5, 7, 'initialization'),
    ]
    const pens = [makePen('p1', 'Pen #1'), makePen('p2', 'Pen #2')]
    const entries = buildTimelineEntries(doses, pens, 'newest')
    const separators = entries.filter(e => e.kind === 'pen-change')
    expect(separators.length).toBe(1)
  })

  it('reverses order when sort is oldest', () => {
    const doses = [
      makeDose('d2', 'p1', 5, 0),
      makeDose('d1', 'p1', 5, 7, 'initialization'),
    ]
    const pens = [makePen('p1', 'Pen #1')]
    const newestFirst = buildTimelineEntries(doses, pens, 'newest')
    const oldestFirst = buildTimelineEntries(doses, pens, 'oldest')
    const newestDoses = newestFirst.filter(e => e.kind === 'dose' || e.kind === 'initialization')
    const oldestDoses = oldestFirst.filter(e => e.kind === 'dose' || e.kind === 'initialization')
    expect(newestDoses[0].dose?.id).not.toBe(oldestDoses[0].dose?.id)
  })
})
