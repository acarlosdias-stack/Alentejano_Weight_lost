interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = "bg-primary",
  trackColor = "bg-surface-container-low",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`h-2 rounded-full overflow-hidden ${trackColor} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
