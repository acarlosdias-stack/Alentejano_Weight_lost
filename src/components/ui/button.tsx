import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "py-3 px-6 rounded-full font-display font-semibold text-title-md transition-opacity disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary: "vitality-gradient text-white",
    secondary: "bg-surface-container-low text-on-surface",
    ghost: "ghost-border text-on-surface hover:bg-surface-container-low",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
