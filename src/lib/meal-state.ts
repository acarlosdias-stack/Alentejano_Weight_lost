import { MEAL_SLOTS } from '@/lib/diet-presets'

// Slots eligible for time-based matching (exclude "extra" which has no real window)
const TIMED_SLOTS = MEAL_SLOTS.filter((s) => s.key !== 'extra')

export type MealState =
  | { kind: 'active';   label: string; title: string; subtitle: string }
  | { kind: 'upcoming'; label: string; title: string; subtitle: string }
  | { kind: 'done';     label: string; title: string; subtitle: string }

export function getMealState(now: Date): MealState {
  const hour = now.getHours()
  const minute = now.getMinutes()

  // 1. Active — we are inside a meal window
  const active = TIMED_SLOTS.find((s) => hour >= s.startHour && hour < s.endHour)
  if (active) {
    return {
      kind: 'active',
      label: 'Time to eat!',
      title: active.label,
      subtitle: `until ${String(active.endHour).padStart(2, '0')}:00`,
    }
  }

  // 2. Done — after last window (dinner ends at 22)
  if (hour >= 22) {
    const breakfast = TIMED_SLOTS.find((s) => s.key === 'breakfast')
    const breakfastHour = breakfast?.startHour ?? 6
    return {
      kind: 'done',
      label: 'All done for today',
      title: 'Breakfast tomorrow',
      subtitle: `${String(breakfastHour).padStart(2, '0')}:00`,
    }
  }

  // 3. Upcoming — find next slot today
  const next = TIMED_SLOTS.find((s) => s.startHour > hour)
  if (next) {
    const totalMinutesNow = hour * 60 + minute
    const totalMinutesNext = next.startHour * 60
    const rawMinutes = totalMinutesNext - totalMinutesNow
    const rounded = Math.round(rawMinutes / 5) * 5
    const countdownStr = rounded <= 0 ? '< 5 min' : `${rounded} min`
    return {
      kind: 'upcoming',
      label: 'Next Meal',
      title: next.label,
      subtitle: `${next.time} · starts in ${countdownStr}`,
    }
  }

  // Fallback (shouldn't be reached given slot coverage)
  return {
    kind: 'done',
    label: 'All done for today',
    title: 'Breakfast tomorrow',
    subtitle: '06:00',
  }
}
