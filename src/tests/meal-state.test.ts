import { describe, it, expect } from 'vitest'
import { getMealState } from '@/lib/meal-state'

function makeDate(hour: number, minute = 0): Date {
  return new Date(2024, 0, 15, hour, minute, 0, 0) // Jan 15 — not a DST transition
}

describe('getMealState', () => {
  it('returns active state during breakfast window (08:00)', () => {
    const state = getMealState(makeDate(8))
    expect(state.kind).toBe('active')
    expect(state.label).toBe('Time to eat!')
    expect(state.title).toBe('Breakfast')
    expect(state.subtitle).toBe('until 10:00')
  })

  it('returns active state during lunch window (13:00)', () => {
    const state = getMealState(makeDate(13))
    expect(state.kind).toBe('active')
    expect(state.title).toBe('Lunch')
    expect(state.subtitle).toBe('until 15:00')
  })

  it('returns upcoming state before breakfast (05:00)', () => {
    const state = getMealState(makeDate(5))
    expect(state.kind).toBe('upcoming')
    expect(state.label).toBe('Next Meal')
    expect(state.title).toBe('Breakfast')
    // 5:00 → 60 min until 6:00 (rounds to 60)
    expect(state.subtitle).toContain('starts in 60 min')
  })

  it('returns upcoming state 30 min before breakfast (05:30)', () => {
    // Note: meal slots cover 06:00–22:00 with no gaps, so "upcoming" only
    // occurs in the 00:00–06:00 window before breakfast starts.
    const state = getMealState(makeDate(5, 30))
    expect(state.kind).toBe('upcoming')
    expect(state.title).toBe('Breakfast')
    // 30 min until 6:00 → rounds to 30
    expect(state.subtitle).toContain('starts in 30 min')
  })

  it('uses "< 5 min" when rounding produces 0 (05:58)', () => {
    // 5:58 → 2 min until 06:00 → rounds to 0 → "< 5 min"
    const state = getMealState(makeDate(5, 58))
    expect(state.kind).toBe('upcoming')
    expect(state.subtitle).toContain('< 5 min')
  })

  it('shows countdown minutes at boundary just before < 5 min kicks in (05:56)', () => {
    // 4 min to 06:00 → Math.round(4/5)*5 = 5 → "starts in 5 min"
    const state = getMealState(makeDate(5, 56))
    expect(state.kind).toBe('upcoming')
    expect(state.subtitle).toContain('starts in 5 min')
  })

  it('returns done state after dinner (22:30)', () => {
    const state = getMealState(makeDate(22, 30))
    expect(state.kind).toBe('done')
    expect(state.label).toBe('All done for today')
    expect(state.title).toBe('Breakfast tomorrow')
    expect(state.subtitle).toBe('06:00')
  })

  it('returns done state exactly at 22:00', () => {
    const state = getMealState(makeDate(22, 0))
    expect(state.kind).toBe('done')
  })

  it('excludes the extra slot from matching', () => {
    // The "extra" slot has startHour/endHour = 0 and must never be returned as active/upcoming
    // Verify by checking no state ever has title "Extras"
    const times = [0, 3, 5, 8, 11, 13, 16, 19, 23]
    for (const h of times) {
      const state = getMealState(makeDate(h))
      expect(state.title).not.toBe('Extras')
    }
  })
})
