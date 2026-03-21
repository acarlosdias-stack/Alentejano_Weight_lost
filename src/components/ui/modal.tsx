"use client";

import { type ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-on-surface/20"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg glass rounded-t-xl p-6 pb-10 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-headline-sm">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface/50 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
