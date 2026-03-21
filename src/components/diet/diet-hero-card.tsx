import { ProgressBar } from "@/components/ui/progress-bar";
import type { Profile } from "@/lib/supabase/types";

interface MealTotals {
  calories: number;
  protein: number;
  waterGlasses: number;
}

interface DietHeroCardProps {
  profile: Profile;
  totals: MealTotals;
}

export function DietHeroCard({ profile, totals }: DietHeroCardProps) {
  const hasTargets =
    profile.daily_calories_target && profile.daily_calories_target > 0;

  return (
    <div className="vitality-gradient px-6 pt-6 pb-8">
      <p className="text-label-sm text-white/65 uppercase tracking-wider mb-4">
        Daily Fuel
      </p>
      <h1 className="font-display font-extrabold text-headline-sm text-white mb-6">
        Diet Diary
      </h1>

      {!hasTargets ? (
        <p className="text-body-md text-white/70">
          Set nutrition targets in Profile to track progress
        </p>
      ) : (
        <div className="space-y-4">
          {/* Calories */}
          {profile.daily_calories_target && profile.daily_calories_target > 0 && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-label-sm text-white/70 uppercase tracking-wider">Calories</span>
                <span className="text-label-sm text-white font-semibold">
                  {totals.calories} / {profile.daily_calories_target} kcal
                </span>
              </div>
              <ProgressBar
                value={totals.calories}
                max={profile.daily_calories_target}
                color="bg-tertiary-fixed"
                trackColor="bg-white/20"
                className="h-[5px]"
              />
            </div>
          )}

          {/* Protein */}
          {profile.daily_protein_target_g && profile.daily_protein_target_g > 0 && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-label-sm text-white/70 uppercase tracking-wider">Protein</span>
                <span className="text-label-sm text-white font-semibold">
                  {totals.protein.toFixed(0)}g / {profile.daily_protein_target_g}g
                </span>
              </div>
              <ProgressBar
                value={totals.protein}
                max={profile.daily_protein_target_g}
                color="bg-tertiary-fixed"
                trackColor="bg-white/20"
                className="h-[5px]"
              />
            </div>
          )}

          {/* Water */}
          {profile.daily_water_target_ml && profile.daily_water_target_ml > 0 && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-label-sm text-white/70 uppercase tracking-wider">Water</span>
                <span className="text-label-sm text-white font-semibold">
                  {totals.waterGlasses} / {Math.round(profile.daily_water_target_ml / 250)} glasses
                </span>
              </div>
              <ProgressBar
                value={totals.waterGlasses}
                max={Math.round(profile.daily_water_target_ml / 250)}
                color="bg-tertiary-fixed"
                trackColor="bg-white/20"
                className="h-[5px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
