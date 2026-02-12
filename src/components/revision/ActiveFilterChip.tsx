"use client";

import { X } from "lucide-react";

interface ActiveFilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function ActiveFilterChip({ label, value, onRemove }: ActiveFilterChipProps) {
  return (
    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1.5 text-sm font-medium animate-scale-in">
      <span className="text-primary/60 text-xs">{label}:</span>
      <span className="font-semibold">{value}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-primary/20 rounded-full p-1 transition-colors cursor-pointer"
        aria-label={`Quitar filtro ${label}: ${value}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
