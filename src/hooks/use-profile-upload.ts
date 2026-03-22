"use client";

import { useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function getExt(file: File) {
  return file.name.split(".").pop() ?? "jpg";
}

export function useProfileUpload(userId: string) {
  const supabase = useMemo(() => createClient(), []);

  const uploadAvatar = useCallback(
    async (file: File): Promise<{ url: string } | { error: string }> => {
      if (!userId) return { error: "Invalid session. Please sign in again." };
      if (file.size > MAX_FILE_SIZE) {
        return { error: "File too large (max. 10MB)" };
      }
      const path = `${userId}/avatar.${getExt(file)}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) return { error: "Failed to upload image. Please try again." };
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return { url: data.publicUrl };
    },
    [supabase, userId]
  );

  const uploadDietPlan = useCallback(
    async (file: File): Promise<{ url: string } | { error: string }> => {
      if (!userId) return { error: "Invalid session. Please sign in again." };
      if (file.size > MAX_FILE_SIZE) {
        return { error: "File too large (max. 10MB)" };
      }
      const path = `${userId}/diet-plan.${getExt(file)}`;
      const { error } = await supabase.storage
        .from("diet-plans")
        .upload(path, file, { upsert: true });
      if (error) return { error: "Failed to upload image. Please try again." };
      const { data } = supabase.storage.from("diet-plans").getPublicUrl(path);
      return { url: data.publicUrl };
    },
    [supabase, userId]
  );

  return { uploadAvatar, uploadDietPlan };
}
