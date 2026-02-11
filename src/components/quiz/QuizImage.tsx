"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageOff, X, ZoomIn } from "lucide-react";

export function QuizImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [expanded, close]);

  if (error) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-secondary"
        role="img"
        aria-label="Imagen no disponible"
      >
        <ImageOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="relative overflow-hidden rounded-xl border border-border bg-background group cursor-pointer"
        style={{ minHeight: 80 }}
        aria-label={`Ampliar ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-96 w-auto object-contain"
          onError={() => setError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-2">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-surface/90 backdrop-blur-sm text-text-secondary text-xs px-2 py-1 rounded-lg flex items-center gap-1">
            <ZoomIn className="h-3 w-3" aria-hidden="true" />
            Ampliar
          </span>
        </div>
      </button>

      {/* Lightbox */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Cerrar imagen"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
