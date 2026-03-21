interface HealthChipProps {
  label: string;
}

export function HealthChip({ label }: HealthChipProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-fixed text-on-surface text-label-sm font-semibold">
      {label}
    </span>
  );
}
