"use client";

import { useCallback, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useWeight } from "@/hooks/use-weight";
import {
  Plus,
  Watch,
  Dumbbell,
  TrendingDown,
  Camera,
  Footprints,
  Zap,
  Bike,
  ChevronRight,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const EXERCISE_HISTORY = [
  {
    id: 1,
    icon: Footprints,
    iconColor: "text-primary",
    name: "Morning Run",
    detail: "Today · 32 min · 4.2 km",
    kcal: 340,
  },
  {
    id: 2,
    icon: Zap,
    iconColor: "text-tertiary",
    name: "HIIT Training",
    detail: "Yesterday · 45 min · High Intensity",
    kcal: 485,
  },
  {
    id: 3,
    icon: Bike,
    iconColor: "text-primary-container",
    name: "Cycling Path",
    detail: "Oct 24 · 1h 12 min · 18.5 km",
    kcal: 612,
  },
];

export default function ActivityPage() {
  const { profile } = useProfile();
  const { logs, logWeight, getMonthlyChange } = useWeight();

  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const handleLogWeight = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!weight) return;
      setSaving(true);
      await logWeight(Number(weight), profile?.height_cm);
      setWeight("");
      setSaving(false);
    },
    [weight, logWeight, profile?.height_cm]
  );

  const monthlyChange = getMonthlyChange();
  const latestLog = logs[0];
  const bmi = latestLog?.bmi ?? null;
  const bodyFatPct = latestLog?.body_fat_pct ?? null;

  // BMI scale: healthy range 18.5–24.9 → map 15–35 to 0–100%
  const bmiBarPct = bmi ? Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100)) : null;
  // Body fat: map 5–45% to 0–100%
  const fatBarPct = bodyFatPct
    ? Math.min(100, Math.max(0, ((bodyFatPct - 5) / 40) * 100))
    : null;

  return (
    <div>
      {/* Full-bleed hero */}
      <div className="vitality-gradient px-5 pt-10 pb-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="font-body text-[10px] font-bold uppercase tracking-widest text-white/60 block mb-1">
            Daily Momentum
          </span>
          <h2 className="font-display font-extrabold text-[2rem] text-white leading-tight mb-4">
            Unleash Your Potential
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <button
              disabled
              className="bg-white text-primary px-5 py-2.5 rounded-full font-display font-bold text-sm flex items-center gap-2 opacity-60 cursor-not-allowed"
            >
              <Plus size={15} strokeWidth={2.5} />
              Log Workout
            </button>
            <button
              disabled
              className="bg-white/20 text-white px-5 py-2.5 rounded-full font-display font-bold text-sm flex items-center gap-2 opacity-60 cursor-not-allowed"
            >
              <Activity size={15} strokeWidth={2} />
              Treadmill
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-tertiary-fixed opacity-10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="bg-surface-container-low pb-24">
      <div className="max-w-7xl mx-auto px-5 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* ── Left column ──────────────────────────────── */}
          <section className="md:col-span-8 space-y-3">

            {/* Mini-cards row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Apple Watch Sync */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-surface-container-high p-2.5 rounded-xl">
                    <Watch size={20} strokeWidth={1.75} className="text-primary" />
                  </div>
                  <span className="bg-tertiary-fixed text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-on-surface">
                    Connected
                  </span>
                </div>
                <p className="font-display font-bold text-base">Apple Watch Sync</p>
                <p className="text-on-surface-variant text-label-sm mt-0.5">Real-time biometrics active</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse flex-shrink-0" />
                  <span className="text-label-sm font-semibold text-tertiary">Live HR: 72 BPM</span>
                </div>
              </div>

              {/* Gym Session */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-surface-container-high p-2.5 rounded-xl">
                    <Dumbbell size={20} strokeWidth={1.75} className="text-primary" />
                  </div>
                </div>
                <p className="font-display font-bold text-base">Gym Session</p>
                <p className="text-on-surface-variant text-label-sm mt-0.5">Last activity: 2 hours ago</p>
                <div className="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary rounded-full" />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>Reps 450</span>
                  <span>Goal 600</span>
                </div>
              </div>
            </div>

            {/* Recent Exercise History */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-title-md">Recent Exercise History</h3>
                <button className="text-primary font-display font-bold text-label-sm flex items-center gap-0.5 hover:underline">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2.5">
                {EXERCISE_HISTORY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0">
                          <Icon size={20} strokeWidth={1.75} className={item.iconColor} />
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm">{item.name}</p>
                          <p className="text-label-sm text-on-surface-variant mt-0.5">{item.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-title-md text-primary">{item.kcal}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kcal</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Right column ─────────────────────────────── */}
          <aside className="md:col-span-4 space-y-4">

            {/* Weight Log card */}
            <div className="bg-surface-container-high rounded-2xl p-5">
              <h3 className="font-display font-bold text-title-md mb-5">Weight Log</h3>

              {/* Camera scan area */}
              <div className="aspect-square w-full rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white transition-colors mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera size={28} strokeWidth={1.5} className="text-primary" />
                </div>
                <p className="font-display font-bold text-sm text-center px-4">
                  Scan scale for weight entry
                </p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Auto-detecting display
                </p>
              </div>

              {/* Manual entry */}
              <form onSubmit={handleLogWeight} className="space-y-3">
                <p className="text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Manual Entry (kg)
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="78.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-surface-container-lowest rounded-xl py-3.5 pl-5 pr-24 font-display font-bold text-xl text-on-surface outline-none focus:ring-2 focus:ring-primary/30 shadow-ambient"
                  />
                  <button
                    type="submit"
                    disabled={saving || !weight}
                    className="absolute right-2 top-2 bottom-2 bg-primary text-on-primary px-5 rounded-lg font-display font-bold text-sm disabled:opacity-40 hover:bg-primary-container transition-colors"
                  >
                    {saving ? "..." : "Log"}
                  </button>
                </div>
              </form>

              {/* Progress chip */}
              {monthlyChange !== null && (
                <div className={`mt-4 p-3.5 rounded-xl flex items-center gap-3 ${monthlyChange <= 0 ? "bg-tertiary-fixed" : "bg-red-100"}`}>
                  <TrendingDown size={24} strokeWidth={2} className={monthlyChange <= 0 ? "text-on-surface" : "text-red-500"} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/50">Progress</p>
                    <p className="font-display font-bold text-sm text-on-surface">
                      {monthlyChange > 0 ? "+" : ""}{monthlyChange} kg this month
                    </p>
                  </div>
                </div>
              )}

              {/* Recent entries */}
              {logs.length > 0 && (
                <div className="mt-4 space-y-1">
                  <p className="text-label-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Recent Entries
                  </p>
                  {logs.slice(0, 5).map((log, i) => {
                    const prev = logs[i + 1];
                    const delta = prev ? log.weight_kg - prev.weight_kg : null;
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0"
                      >
                        <p className="text-label-sm text-on-surface-variant">{formatDate(log.logged_at)}</p>
                        <div className="flex items-center gap-2">
                          {delta !== null && (
                            <span className={`text-label-sm font-bold ${delta < 0 ? "text-tertiary" : delta > 0 ? "text-red-400" : "text-on-surface/30"}`}>
                              {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                            </span>
                          )}
                          <span className="font-display font-bold text-sm text-primary">{log.weight_kg} kg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body Composition card */}
            {(bmi !== null || bodyFatPct !== null) && (
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient">
                <h4 className="font-display font-bold text-title-md mb-4">Body Composition</h4>
                <div className="space-y-4">
                  {bmi !== null && (
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-label-sm text-on-surface-variant">BMI Index</span>
                        <span className="font-display font-bold text-sm text-primary">{bmi.toFixed(1)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tertiary rounded-full transition-all duration-700"
                          style={{ width: `${bmiBarPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {bodyFatPct !== null && (
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-label-sm text-on-surface-variant">Body Fat %</span>
                        <span className="font-display font-bold text-sm text-primary">{bodyFatPct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${fatBarPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
      </div>
    </div>
  );
}
