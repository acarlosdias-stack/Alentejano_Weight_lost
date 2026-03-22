"use client";

import { useRef, useState } from "react";
import { Upload, X, RefreshCw, ClipboardList } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface DietPlanCardProps {
  imageUrl: string | null;
  uploading: boolean;
  error: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function DietPlanCard({ imageUrl, uploading, error, onUpload }: DietPlanCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-title-sm font-semibold flex items-center gap-2">
          <ClipboardList size={16} className="text-primary" />
          Diet Plan
        </h3>
        {imageUrl && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-label-sm font-semibold text-primary hover:opacity-70 transition-opacity"
            aria-label="Change diet plan image"
          >
            <RefreshCw size={14} />
            Change
          </button>
        )}
      </div>

      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}

      {!imageUrl ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-outline-variant/50 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-surface-container-low transition-colors"
        >
          <Upload size={28} className="text-on-surface/30" strokeWidth={1.5} />
          <span className="text-body-md text-on-surface/60 font-medium">
            {uploading ? "Uploading…" : "Upload diet plan image"}
          </span>
          <span className="text-label-sm text-on-surface/30">
            Photo of your nutritionist&apos;s plan
          </span>
        </button>
      ) : (
        <div className="rounded-xl overflow-hidden border border-outline-variant/20">
          <div className="relative w-full h-40 bg-surface-container-low cursor-pointer" onClick={() => setLightboxOpen(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Diet plan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-end justify-end p-3">
              <span className="bg-primary text-white text-label-sm font-bold px-3 py-1.5 rounded-full shadow">
                View
              </span>
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-label-sm font-semibold text-on-surface">diet_plan</p>
              <p className="text-label-sm text-on-surface/50">Nutritionist&apos;s plan</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Lightbox */}
      {lightboxOpen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={6}
            centerOnInit
          >
            <TransformComponent
              wrapperStyle={{ width: "100vw", height: "100vh" }}
              contentStyle={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img
                src={imageUrl}
                alt="Diet plan"
                style={{ maxWidth: "100vw", maxHeight: "100vh", objectFit: "contain" }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </div>
  );
}
