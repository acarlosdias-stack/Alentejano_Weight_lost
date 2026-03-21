"use client";

import { useState } from "react";
import { Coffee, Droplets, Apple, Cookie } from "lucide-react";
import { QUICK_LOG_PRESETS, type QuickLogPreset } from "@/lib/diet-presets";

const ICONS: Record<string, any> = {
  Coffee,
  Droplets,
  Apple,
  Cookie,
};

interface QuickLogBarProps {
  onLog: (preset: QuickLogPreset) => Promise<void>;
}

export function QuickLogBar({ onLog }: QuickLogBarProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleTap = async (preset: QuickLogPreset) => {
    if (loading) return;
    setLoading(preset.name);
    await onLog(preset);
    setLoading(null);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {QUICK_LOG_PRESETS.map((preset) => {
        const Icon = ICONS[preset.icon];
        const isLoading = loading === preset.name;
        return (
          <button
            key={preset.name}
            onClick={() => handleTap(preset)}
            disabled={!!loading}
            className="flex items-center gap-2 flex-shrink-0 px-4 py-2 bg-surface-container-lowest rounded-full text-label-sm font-semibold text-on-surface shadow-ambient active:scale-95 transition-transform disabled:opacity-60"
          >
            {Icon && (
              <Icon
                size={16}
                strokeWidth={1.75}
                className={isLoading ? "animate-pulse text-primary" : "text-on-surface/60"}
              />
            )}
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
