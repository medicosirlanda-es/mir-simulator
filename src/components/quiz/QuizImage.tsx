"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function QuizImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

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
    <div className="relative overflow-hidden rounded-xl border border-border bg-background" style={{ minHeight: 80 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-64 w-auto object-contain"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
