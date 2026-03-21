import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/supabase/types";

interface UserHeaderProps {
  profile: Profile;
}

export function UserHeader({ profile }: UserHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-surface-container-low overflow-hidden">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-on-surface/30">
              👤
            </div>
          )}
        </div>
        <Badge variant="success">Active</Badge>
      </div>
      <div>
        <p className="text-label-sm text-on-surface/50 uppercase tracking-wider">
          Health Enthusiast
        </p>
        <h2 className="font-display text-headline-sm">{profile.name}</h2>
      </div>
      {profile.goal_weight_kg && profile.current_weight_kg && (
        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
          <span className="text-label-sm">🎯</span>
          <span className="text-label-sm text-on-surface/70">
            Weight loss goal:{" "}
            {Math.round(
              (profile.current_weight_kg - profile.goal_weight_kg) * 10
            ) / 10}
            kg
          </span>
        </div>
      )}
    </div>
  );
}
