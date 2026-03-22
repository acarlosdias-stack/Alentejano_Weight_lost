"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  filterLogsByRange,
  computeWeightStats,
  computeInsight,
  getDoseDateSet,
  toChartData,
  type RangeOption,
} from "@/lib/weight-chart-utils";
import type { WeightLog } from "@/lib/supabase/types";
import type { Dose } from "@/lib/supabase/types";

interface WeightTrendChartProps {
  logs: WeightLog[];
  doses: Dose[];
  goalWeight: number | null;
}

interface TooltipEntry {
  payload?: { date: string; weight: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { date, weight } = payload[0].payload as { date: string; weight: number };
  return (
    <div className="bg-[#191c1e] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
      {weight} kg
      <span className="block font-normal opacity-60 text-[10px]">{date}</span>
    </div>
  );
}

export function WeightTrendChart({ logs, doses, goalWeight }: WeightTrendChartProps) {
  const [range, setRange] = useState<RangeOption>("3M");

  // Empty state
  if (logs.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-6 text-center">
        <svg viewBox="0 0 120 60" className="w-32 mx-auto mb-3 opacity-20">
          <polyline points="0,50 30,35 60,40 90,20 120,25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="font-semibold text-on-surface/60">No weight entries yet</p>
        <p className="text-xs text-on-surface/40 mt-1">
          Log your first weight below to start tracking your trend
        </p>
      </div>
    );
  }

  const filtered = filterLogsByRange(logs, range);
  const chartData = toChartData(filtered);
  const stats = computeWeightStats(logs, goalWeight); // always all-time
  const insight = computeInsight(logs); // always all-time

  // Dose markers: in ALL view show only initialization-type doses (pen changes).
  // In 1M/3M show all dose dates.
  const doseDateSet = getDoseDateSet(
    range === "all" ? doses.filter(d => d.type === "initialization") : doses
  );

  // Y-axis domain with padding
  const weights = chartData.map(d => d.weight);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-on-surface">Weight Trend</p>
          <p className="text-xs text-on-surface/40 mt-0.5">Your journey over time</p>
        </div>
        <div className="flex gap-1.5">
          {(["1M", "3M", "all"] as RangeOption[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                range === r
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface/50"
              }`}
            >
              {r === "all" ? "ALL" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00628d" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#00628d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "#c1c6d7" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return d.toLocaleDateString("en", { month: "short" });
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minW, maxW]}
            tick={{ fontSize: 9, fill: "#c1c6d7" }}
            tickLine={false}
            axisLine={false}
            tickCount={4}
          />
          <Tooltip content={<CustomTooltip />} />
          {goalWeight != null && (
            <ReferenceLine
              y={goalWeight}
              stroke="#69ff87"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: `GOAL ${goalWeight}kg`, position: "insideTopRight", fontSize: 8, fill: "#16a34a", fontWeight: 700 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#00628d"
            strokeWidth={2.5}
            fill="url(#weightFill)"
            dot={false}
            activeDot={{ r: 5, fill: "#00628d", strokeWidth: 0 }}
          />
          {/* Dose markers as reference lines */}
          {chartData
            .filter(d => doseDateSet.has(d.date))
            .map(d => (
              <ReferenceLine
                key={d.date}
                x={d.date}
                stroke="#267baa"
                strokeWidth={1.5}
                strokeOpacity={0.65}
              />
            ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Goal-null fallback link below chart */}
      {goalWeight == null && (
        <p className="text-[10px] text-on-surface/40 mt-1">
          <a href="/profile" className="text-primary font-semibold underline underline-offset-2">
            Set your goal weight in Profile
          </a>{" "}to see your goal line.
        </p>
      )}

      {/* Dose legend */}
      <div className="flex items-center gap-1.5 mt-1 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary/70" />
        <span className="text-[10px] text-on-surface/40">
          {range === "all" ? "Pen change" : "Mounjaro dose day"}
        </span>
        {range === "all" && (
          <span className="text-[10px] text-on-surface/30 ml-1">· Switch to 3M to see individual doses</span>
        )}
      </div>

      {/* Stats strip */}
      <div className="flex border-t border-outline-variant/20 pt-3 mt-1">
        <div className="flex-1 text-center">
          <p className={`font-extrabold text-base ${stats.kgLost != null && stats.kgLost > 0 ? "text-[#16a34a]" : "text-on-surface"}`}>
            {stats.kgLost != null ? `−${stats.kgLost}` : "—"}
          </p>
          <p className="text-[10px] text-on-surface/40 mt-0.5">kg lost</p>
        </div>
        <div className="flex-1 text-center border-x border-outline-variant/20">
          <p className="font-extrabold text-base text-on-surface">
            {stats.current ?? "—"}
          </p>
          <p className="text-[10px] text-on-surface/40 mt-0.5">current kg</p>
        </div>
        <div className="flex-1 text-center">
          {stats.toGoal != null ? (
            <>
              <p className="font-extrabold text-base text-primary">{stats.toGoal}</p>
              <p className="text-[10px] text-on-surface/40 mt-0.5">to goal</p>
            </>
          ) : (
            <>
              <a href="/profile" className="text-[10px] text-primary font-semibold underline-offset-2 underline">Set goal</a>
              <p className="text-[10px] text-on-surface/40 mt-0.5">no goal set</p>
            </>
          )}
        </div>
      </div>

      {/* Insight chip */}
      {insight.avgMonthlyLoss != null && (
        <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[10px] font-semibold ${
          insight.onTrack
            ? "bg-[rgba(105,255,135,0.14)] text-[#166534]"
            : "bg-amber-50 text-amber-700"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${insight.onTrack ? "bg-[#16a34a]" : "bg-amber-500"}`} />
          {insight.onTrack
            ? `Avg −${insight.avgMonthlyLoss} kg/month · on track`
            : `Avg +${Math.abs(insight.avgMonthlyLoss)} kg/month · no recent progress`}
        </div>
      )}
    </div>
  );
}
