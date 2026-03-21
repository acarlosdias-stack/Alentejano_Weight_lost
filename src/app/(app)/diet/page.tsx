"use client";

import {
  Bell,
  Sun,
  Utensils,
  Droplets,
  Zap,
  Leaf,
  Camera,
  Coffee,
  GlassWater,
  Apple,
  Cookie,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";

const meals = [
  {
    id: "breakfast",
    label: "Breakfast",
    time: "08:00 AM",
    status: "completed" as const,
    item: "Ovos mexidos com legumes",
    kcal: 380,
    tag: "High Protein",
    Icon: Sun,
  },
  {
    id: "lunch",
    label: "Lunch",
    time: "01:30 PM",
    status: "upcoming" as const,
    item: "Salada de quinoa com frango grelhado",
    kcal: null,
    tag: null,
    Icon: Utensils,
  },
];

const nutrients = [
  { label: "Hydration", value: "1.8", unit: "/ 3L", Icon: Droplets, color: "text-primary" },
  { label: "Protein", value: "64g", unit: "/ 120g", Icon: Zap, color: "text-tertiary" },
  { label: "Fibre", value: "18g", unit: "/ 25g", Icon: Leaf, color: "text-[#92400e]" },
  { label: "Calories", value: "940", unit: "/ 2100", Icon: TrendingDown, color: "text-primary-container" },
];

const quickLogs = [
  { label: "Coffee", Icon: Coffee },
  { label: "Water", Icon: GlassWater },
  { label: "Fruit", Icon: Apple },
  { label: "Snack", Icon: Cookie },
];

export default function DietPage() {
  return (
    <div>
      {/* Hero */}
      <div className="vitality-gradient px-5 pt-10 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1">
          Daily Fuel
        </p>
        <h1 className="font-display text-[2rem] font-extrabold text-white leading-tight">
          Diet Diary
        </h1>
        <p className="text-white/60 text-body-sm mt-1">
          Track every meal, every day.
        </p>
      </div>

      {/* Tonal section */}
      <div className="bg-surface-container-low px-5 pt-5 pb-24 space-y-3">

        {/* Snack alert */}
        <div className="bg-tertiary-fixed rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
            <Bell size={16} strokeWidth={1.75} className="text-on-tertiary-fixed" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-tertiary-fixed text-label-md">
              Mid-morning snack reminder
            </p>
            <p className="text-on-tertiary-fixed-variant text-label-sm mt-0.5">
              15g of almonds + green tea. Stay hydrated.
            </p>
          </div>
        </div>

        {/* Today's Timeline */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="font-display font-semibold text-title-md text-on-surface">
              Today&apos;s Timeline
            </p>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              82% On Track
            </span>
          </div>

          <div className="px-4 pb-4 space-y-0 relative">
            {/* vertical line */}
            <div className="absolute left-[2.1rem] top-4 bottom-4 w-[2px] bg-outline-variant/20" />

            {meals.map(({ id, label, time, status, item, kcal, tag, Icon }) => (
              <div key={id} className="relative pl-10 py-3">
                {/* dot */}
                <div
                  className={`absolute left-0 top-3 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    status === "completed"
                      ? "bg-secondary-container"
                      : "bg-surface-container-high"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.75}
                    className={
                      status === "completed"
                        ? "text-on-secondary-container"
                        : "text-on-surface/40"
                    }
                  />
                </div>

                <div className={`flex items-start justify-between gap-2 ${status === "upcoming" ? "opacity-50" : ""}`}>
                  <div>
                    <p className="font-semibold text-label-md text-on-surface">{label}</p>
                    <p className="text-label-sm text-on-surface/40 mb-1.5">
                      {time} &bull; {status === "completed" ? "Completed" : "Upcoming"}
                    </p>
                    <p className="text-body-sm text-on-surface/70 italic">{item}</p>
                    {kcal && tag && (
                      <p className="text-[10px] font-bold text-tertiary mt-1">
                        {kcal} kcal &bull; {tag}
                      </p>
                    )}
                  </div>
                  {status === "completed" ? (
                    <CheckCircle2
                      size={18}
                      strokeWidth={1.75}
                      className="text-tertiary flex-shrink-0 mt-0.5"
                    />
                  ) : (
                    <button className="text-primary text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Insights */}
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-4">
          <p className="font-display font-semibold text-title-md text-on-surface mb-3">
            Nutrition Insights
          </p>
          <div className="grid grid-cols-2 gap-2">
            {nutrients.map(({ label, value, unit, Icon, color }) => (
              <div
                key={label}
                className="bg-surface-container-low rounded-xl p-3 flex flex-col items-center text-center gap-1"
              >
                <Icon size={18} strokeWidth={1.75} className={color} />
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface/40">
                  {label}
                </p>
                <p className="font-display font-extrabold text-[1.1rem] text-on-surface leading-none">
                  {value}
                  <span className="text-[10px] font-normal text-on-surface/40 ml-1">{unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log */}
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-4">
          <p className="font-display font-semibold text-title-md text-on-surface mb-3">
            Quick Log
          </p>
          <div className="grid grid-cols-4 gap-2">
            {quickLogs.map(({ label, Icon }) => (
              <button
                key={label}
                className="bg-surface-container-low rounded-xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <Icon size={20} strokeWidth={1.75} className="text-primary" />
                <span className="text-[10px] font-semibold text-on-surface/70">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Meal Validator — coming soon */}
        <div className="vitality-gradient rounded-xl p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="font-display font-bold text-title-lg text-white mb-1">
              AI Meal Validator
            </p>
            <p className="text-white/70 text-body-sm mb-4">
              Snap a photo — identify ingredients and macros instantly.
            </p>
            <button
              disabled
              className="w-full bg-white text-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold opacity-60 cursor-not-allowed"
            >
              <Camera size={18} strokeWidth={1.75} />
              Take Photo — Coming Soon
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
