import { type ReactNode } from "react";

type CardVariant = "elevated" | "flat" | "gradient";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = "elevated",
  className = "",
  onClick,
}: CardProps) {
  const base = "rounded-xl p-5";
  const variants: Record<CardVariant, string> = {
    elevated: "bg-surface-container-lowest shadow-ambient",
    flat: "bg-surface-container-low",
    gradient: "vitality-gradient text-white",
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
