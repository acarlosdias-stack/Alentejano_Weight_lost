import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Profile, WeightLog } from "@/lib/supabase/types";

interface MomentumCardProps {
  profile: Profile;
  weightLogs: WeightLog[];
}

export function MomentumCard({ profile, weightLogs }: MomentumCardProps) {
  const current = profile.current_weight_kg;
  const goal = profile.goal_weight_kg;

  if (!current || !goal) {
    return (
      <Card variant="gradient">
        <p className="text-white/70 text-label-sm uppercase tracking-wider">
          Today&apos;s Momentum
        </p>
        <p className="font-display text-headline-sm text-white mt-2">
          Set your weight goal in Profile to track progress
        </p>
      </Card>
    );
  }

  // Start weight = first ever weight log entry (oldest)
  const startWeight =
    weightLogs.length > 0
      ? weightLogs[weightLogs.length - 1].weight_kg
      : current;

  const totalToLose = Math.max(startWeight - goal, 0.1);
  const lost = Math.max(startWeight - current, 0);
  const remaining = Math.max(current - goal, 0);
  const score = Math.max(
    Math.min(Math.round((lost / totalToLose) * 100), 100),
    0
  );

  return (
    <Card variant="gradient" className="space-y-3">
      <p className="text-white/70 text-label-sm uppercase tracking-wider">
        Today&apos;s Momentum
      </p>
      {weightLogs.length < 2 ? (
        <p className="font-display text-headline-sm text-white">
          Log your weight to start tracking progress
        </p>
      ) : (
        <>
          <p className="font-display text-display-lg text-white leading-none">
            {score}% to Goal
          </p>
          <p className="text-white/80 text-body-md">
            You&apos;ve lost {lost.toFixed(1)}kg.{" "}
            {remaining > 0
              ? `Only ${remaining.toFixed(1)}kg to go!`
              : "Goal reached!"}
          </p>
          <ProgressBar
            value={score}
            max={100}
            color="bg-tertiary-fixed"
            className="h-3"
          />
        </>
      )}
    </Card>
  );
}
