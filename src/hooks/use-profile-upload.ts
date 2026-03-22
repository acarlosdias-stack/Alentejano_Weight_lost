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
      if (!userId) return { error: "Sessão inválida. Volta a iniciar sessão." };
      if (file.size > MAX_FILE_SIZE) {
        return { error: "Ficheiro demasiado grande (máx. 10MB)" };
      }
      const path = `${userId}/avatar.${getExt(file)}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) return { error: "Erro ao carregar imagem. Tenta novamente." };
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Bust cache with a timestamp query param
      return { url: `${data.publicUrl}?t=${Date.now()}` };
    },
    [supabase, userId]
  );

  const uploadDietPlan = useCallback(
    async (file: File): Promise<{ url: string } | { error: string }> => {
      if (!userId) return { error: "Sessão inválida. Volta a iniciar sessão." };
      if (file.size > MAX_FILE_SIZE) {
        return { error: "Ficheiro demasiado grande (máx. 10MB)" };
      }
      const path = `${userId}/diet-plan.${getExt(file)}`;
      const { error } = await supabase.storage
        .from("diet-plans")
        .upload(path, file, { upsert: true });
      if (error) return { error: "Erro ao carregar imagem. Tenta novamente." };
      const { data } = supabase.storage.from("diet-plans").getPublicUrl(path);
      return { url: `${data.publicUrl}?t=${Date.now()}` };
    },
    [supabase, userId]
  );

  return { uploadAvatar, uploadDietPlan };
}
