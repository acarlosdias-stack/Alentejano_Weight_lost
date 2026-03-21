import { type ReactNode } from "react";

type BadgeVariant = "success" | "info" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: "bg-tertiary-fixed text-on-surface",
    info: "bg-primary/10 text-primary",
    neutral: "bg-surface-container-low text-on-surface/70",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
