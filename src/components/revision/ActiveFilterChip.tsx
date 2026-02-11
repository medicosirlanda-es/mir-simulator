"use client";

import { X } from "lucide-react";

interface ActiveFilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function ActiveFilterChip({ label, value, onRemove }: ActiveFilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium animate-scale-in">
      <span className="text-primary/60">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
        aria-label={`Quitar filtro ${label}: ${value}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
