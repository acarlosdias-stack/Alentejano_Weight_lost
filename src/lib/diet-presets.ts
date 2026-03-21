export type MealSlotType =
  | "breakfast"
  | "morning_snack"
  | "lunch"
  | "afternoon_snack"
  | "dinner"
  | "extra";

export interface MealSlotConfig {
  key: MealSlotType;
  label: string;
  /** Display time range, e.g. "06:00–10:00" */
  time: string;
  /** Start hour (24h) for auto-expand logic */
  startHour: number;
  /** End hour (24h) for auto-expand logic */
  endHour: number;
}

export const MEAL_SLOTS: MealSlotConfig[] = [
  { key: "breakfast",       label: "Breakfast",        time: "06:00–10:00", startHour: 6,  endHour: 10 },
  { key: "morning_snack",   label: "Morning Snack",    time: "10:00–12:00", startHour: 10, endHour: 12 },
  { key: "lunch",           label: "Lunch",            time: "12:00–15:00", startHour: 12, endHour: 15 },
  { key: "afternoon_snack", label: "Afternoon Snack",  time: "15:00–18:00", startHour: 15, endHour: 18 },
  { key: "dinner",          label: "Dinner",           time: "18:00–22:00", startHour: 18, endHour: 22 },
  { key: "extra",           label: "Extras",           time: "Anytime",     startHour: 0,  endHour: 0  },
];

/** Map from slot key to display label — used by AddMealModal title */
export const SLOT_LABELS: Record<MealSlotType, string> = Object.fromEntries(
  MEAL_SLOTS.map((s) => [s.key, s.label])
) as Record<MealSlotType, string>;

export interface QuickLogPreset {
  name: string;
  meal_slot: MealSlotType;
  calories_kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  /** lucide-react icon name for display */
  icon: string;
}

export const QUICK_LOG_PRESETS: QuickLogPreset[] = [
  { name: "Coffee",  meal_slot: "extra", calories_kcal: 5,   protein_g: 0, carbs_g: 1,  fat_g: 0, icon: "Coffee" },
  { name: "Water",   meal_slot: "extra", calories_kcal: 0,   protein_g: 0, carbs_g: 0,  fat_g: 0, icon: "Droplets" },
  { name: "Fruit",   meal_slot: "extra", calories_kcal: 60,  protein_g: 1, carbs_g: 15, fat_g: 0, icon: "Apple" },
  { name: "Snack",   meal_slot: "extra", calories_kcal: 150, protein_g: 3, carbs_g: 20, fat_g: 6, icon: "Cookie" },
];
