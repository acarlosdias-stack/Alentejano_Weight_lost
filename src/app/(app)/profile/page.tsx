"use client";

import { useState, useCallback } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { useProfileUpload } from "@/hooks/use-profile-upload";
import { UserHeader } from "@/components/profile/user-header";
import { StatsRow } from "@/components/profile/stats-row";
import { DietPlanCard } from "@/components/profile/diet-plan-card";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [dietUploading, setDietUploading] = useState(false);
  const [dietError, setDietError] = useState<string | null>(null);

  const upload = useProfileUpload(profile?.id ?? "");

  const handleAvatarChange = useCallback(
    async (file: File): Promise<string | null> => {
      const result = await upload.uploadAvatar(file);
      if ("error" in result) return result.error;
      await updateProfile({ avatar_url: result.url });
      return null;
    },
    [upload, updateProfile]
  );

  const handleDietPlanUpload = useCallback(
    async (file: File) => {
      setDietError(null);
      setDietUploading(true);
      const result = await upload.uploadDietPlan(file);
      if ("error" in result) {
        setDietError(result.error);
      } else {
        await updateProfile({ diet_plan_image_url: result.url });
      }
      setDietUploading(false);
    },
    [upload, updateProfile]
  );

  if (loading) {
    return <p className="text-body-md text-on-surface/50">Loading...</p>;
  }

  if (!profile) {
    return <p className="text-body-md text-on-surface/50">A configurar perfil…</p>;
  }

  return (
    <div className="space-y-0 -mx-5 -mt-5">
      {/* Full-bleed gradient hero */}
      <UserHeader
        profile={profile}
        onSignOut={signOut}
        onAvatarChange={handleAvatarChange}
      />

      {/* Tonal body */}
      <div className="bg-surface-container-low px-5 pt-5 pb-24 space-y-4">
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

        <DietPlanCard
          imageUrl={profile.diet_plan_image_url ?? null}
          uploading={dietUploading}
          error={dietError}
          onUpload={handleDietPlanUpload}
        />

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => setEditOpen(true)}
        >
          Editar Perfil
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
