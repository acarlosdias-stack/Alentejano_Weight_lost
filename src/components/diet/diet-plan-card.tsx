"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ClipboardList } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface DietPagePlanCardProps {
  imageUrl: string | null;
}

export function DietPagePlanCard({ imageUrl }: DietPagePlanCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!imageUrl) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-on-surface/30" />
          <span className="text-label-sm text-on-surface/50">Plano alimentar não carregado</span>
        </div>
        <Link
          href="/profile"
          className="text-label-sm font-semibold text-primary hover:underline"
        >
          Carregar
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-surface-container-lowest rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <div className="relative w-full h-24">
          <Image src={imageUrl} alt="Plano alimentar" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center px-4">
            <div>
              <p className="text-white text-label-sm uppercase tracking-wider font-semibold opacity-80">Plano Alimentar</p>
              <p className="text-white font-display text-title-sm font-bold">Ver plano</p>
            </div>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="bg-primary text-white text-label-sm font-bold px-3 py-1.5 rounded-full shadow">
              Ver Plano
            </span>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          <TransformWrapper initialScale={1} minScale={0.5} maxScale={6} centerOnInit>
            <TransformComponent
              wrapperStyle={{ width: "100vw", height: "100vh" }}
              contentStyle={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img
                src={imageUrl}
                alt="Plano alimentar"
                style={{ maxWidth: "100vw", maxHeight: "100vh", objectFit: "contain" }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </>
  );
}
