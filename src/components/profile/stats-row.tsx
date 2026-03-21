import { Card } from "@/components/ui/card";
import type { Profile } from "@/lib/supabase/types";

interface StatsRowProps {
  profile: Profile;
}

export function StatsRow({ profile }: StatsRowProps) {
  return (
    <div className="flex gap-4">
      <Card className="flex-1 text-center">
        <p className="text-label-sm text-on-surface/50">Height</p>
        <p className="font-display text-headline-sm">
          {profile.height_cm ?? "—"}
          <span className="text-label-sm text-on-surface/50 ml-1">cm</span>
        </p>
      </Card>
      <Card className="flex-1 text-center">
        <p className="text-label-sm text-on-surface/50">Weight</p>
        <p className="font-display text-headline-sm">
          {profile.current_weight_kg ?? "—"}
          <span className="text-label-sm text-on-surface/50 ml-1">kg</span>
        </p>
      </Card>
    </div>
  );
}
