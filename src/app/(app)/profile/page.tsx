"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { UserHeader } from "@/components/profile/user-header";
import { StatsRow } from "@/components/profile/stats-row";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  if (loading || !profile) {
    return <p className="text-body-md text-on-surface/50">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <UserHeader profile={profile} />
      <StatsRow profile={profile} />

      {(profile.daily_calories_target || profile.daily_protein_target_g || profile.daily_carbs_target_g) && (
        <Card>
          <h3 className="font-display text-title-md font-semibold mb-3">
            Daily Nutrition
          </h3>
          <div className="space-y-3">
            {profile.daily_calories_target && (
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-on-surface/70">Calories</span>
                  <span>— / {profile.daily_calories_target} kcal</span>
                </div>
                <ProgressBar value={0} max={profile.daily_calories_target} />
              </div>
            )}
            {profile.daily_protein_target_g && (
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-on-surface/70">Proteins</span>
                  <span>— / {profile.daily_protein_target_g}g</span>
                </div>
                <ProgressBar value={0} max={profile.daily_protein_target_g} color="bg-blue-500" />
              </div>
            )}
            {profile.daily_carbs_target_g && (
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span className="text-on-surface/70">Carbs</span>
                  <span>— / {profile.daily_carbs_target_g}g</span>
                </div>
                <ProgressBar value={0} max={profile.daily_carbs_target_g} color="bg-amber-500" />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card variant="flat">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-display text-title-md font-semibold">
              Editorial Tip
            </p>
            <p className="text-body-md text-on-surface/70 mt-1">
              Intermittent fasting helps regulate insulin levels. Try to keep
              your first meal at 8:00 AM as scheduled for optimal metabolic
              performance.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setEditOpen(true)}
        >
          Edit Profile
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </div>
  );
}
