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
      <div className="vitality-gradient px-6 pt-6 pb-8">
        <p className="text-label-sm text-white/65 uppercase tracking-wider mb-3">
          Today&apos;s Momentum
        </p>
        <p className="font-display text-headline-sm text-white">
          Set your weight goal in Profile to track progress
        </p>
      </div>
    );
  }

  const startWeight = weightLogs.length > 0
    ? weightLogs[weightLogs.length - 1].weight_kg
    : current;
  const totalToLose = Math.max(startWeight - goal, 0.1);
  const lost = Math.max(startWeight - current, 0);
  const remaining = Math.max(current - goal, 0);
  const score = Math.max(Math.min(Math.round((lost / totalToLose) * 100), 100), 0);
  const isOnTrack = weightLogs.length >= 2 && lost > 0;

  return (
    <div className="vitality-gradient px-6 pt-6 pb-8">
      <p className="text-label-sm text-white/65 uppercase tracking-wider mb-4">
        Today&apos;s Momentum
      </p>

      {weightLogs.length < 2 ? (
        <p className="font-display text-headline-sm text-white">
          Log your weight to start tracking progress
        </p>
      ) : (
        <>
          <p className="font-display font-extrabold text-[4rem] text-white leading-none">
            {score}%
          </p>
          <p className="text-body-md text-white/70 mt-2">
            to goal &middot; {lost.toFixed(1)} kg lost
            {remaining > 0 ? ` · ${remaining.toFixed(1)} kg to go` : ""}
          </p>
          <ProgressBar
            value={score}
            max={100}
            color="bg-tertiary-fixed"
            className="h-[5px] mt-4"
          />
          {isOnTrack && (
            <span className="inline-block mt-3 bg-tertiary-fixed text-[#003d58] rounded-full text-[0.625rem] font-body font-bold px-3 py-1 uppercase tracking-wide">
              On Track
            </span>
          )}
        </>
      )}
    </div>
  );
}
