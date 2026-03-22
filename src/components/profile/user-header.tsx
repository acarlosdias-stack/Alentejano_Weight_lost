"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LogOut, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/supabase/types";

interface UserHeaderProps {
  profile: Profile;
  onSignOut: () => void;
  onAvatarChange: (file: File) => Promise<string | null>; // returns error string or null
}

export function UserHeader({ profile, onSignOut, onAvatarChange }: UserHeaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalAvatarUrl(objectUrl);
    setUploading(true);
    const err = await onAvatarChange(file);
    setUploading(false);
    URL.revokeObjectURL(objectUrl);
    if (err) {
      setAvatarError(err);
      setLocalAvatarUrl(null);
    }
    e.target.value = "";
  }

  const displayAvatar = localAvatarUrl ?? profile.avatar_url;

  return (
    <div className="vitality-gradient px-5 pt-12 pb-8 relative">
      {/* Sair chip */}
      <button
        onClick={onSignOut}
        className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-white text-label-sm font-semibold hover:bg-white/25 transition-colors active:scale-95"
      >
        <LogOut size={13} strokeWidth={2.5} />
        Sair
      </button>

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar with camera badge */}
        <button
          type="button"
          className="relative focus:outline-none"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Alterar foto de perfil"
        >
          <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/50 overflow-hidden">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt={profile.name}
                width={96}
                height={96}
                className={`w-full h-full object-cover transition-opacity ${uploading ? "opacity-60" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="44" height="44" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-7 h-7 bg-tertiary-fixed rounded-full border-2 border-white flex items-center justify-center shadow-sm">
            <Camera size={13} strokeWidth={2} className="text-on-tertiary-fixed" />
          </span>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {avatarError && (
          <p className="text-label-sm text-red-200">{avatarError}</p>
        )}

        <div>
          <p className="text-label-sm text-white/70 uppercase tracking-wider">
            Health Enthusiast
          </p>
          <h2 className="font-display text-headline-sm text-white">{profile.name}</h2>
        </div>

        {profile.goal_weight_kg && profile.current_weight_kg && (
          <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
            <Badge variant="success">Active</Badge>
            <span className="text-label-sm text-white/80">
              Objetivo:{" "}
              {Math.round((profile.current_weight_kg - profile.goal_weight_kg) * 10) / 10}kg
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
