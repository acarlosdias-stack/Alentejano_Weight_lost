"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterPenFormProps {
  onRegister: (totalMg: number, name?: string) => Promise<unknown>;
  collapsed?: boolean;
}

export function RegisterPenForm({ onRegister, collapsed = false }: RegisterPenFormProps) {
  const [expanded, setExpanded] = useState(!collapsed);
  const [mg, setMg] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mg) return;
    setSaving(true);
    await onRegister(Number(mg), name || undefined);
    setMg("");
    setName("");
    setSaving(false);
    if (collapsed) setExpanded(false);
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-display text-title-md font-semibold text-on-surface/70">
          + Register New Pen
        </span>
        {expanded
          ? <ChevronUp size={16} strokeWidth={1.75} className="text-on-surface/40" />
          : <ChevronDown size={16} strokeWidth={1.75} className="text-on-surface/40" />
        }
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-3 border-t border-outline-variant/10">
          <div className="pt-3">
            <Input
              label="Prescription Strength (mg)"
              type="number"
              step="0.5"
              placeholder="e.g. 15"
              suffix="mg"
              value={mg}
              onChange={(e) => setMg(e.target.value)}
              required
            />
          </div>
          <Input
            label="Pen Name (optional)"
            placeholder="e.g. Pen #1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" fullWidth disabled={saving || !mg}>
            {saving ? "Registering..." : "Register New Pen"}
          </Button>
        </form>
      )}
    </div>
  );
}
