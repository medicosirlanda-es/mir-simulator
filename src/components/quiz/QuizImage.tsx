"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function QuizImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-muted">
        <ImageOff className="h-4 w-4" />
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="max-h-64 rounded-lg border border-border object-contain"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
