"use client";

import { cn } from "@/lib/utils";
import type { ReviewFiltersState } from "@/lib/review-utils";

interface ReviewFiltersProps {
  filters: ReviewFiltersState;
  years: number[];
  specialties: string[];
  onYearChange: (year: number | null) => void;
  onSpecialtyChange: (specialty: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
}

export function ReviewFilters({
  filters,
  years,
  specialties,
  onYearChange,
  onSpecialtyChange,
  onStatusChange,
  onSearchChange,
}: ReviewFiltersProps) {
  return (
    <div className="p-3 border-b border-border space-y-2">
      {/* Year pills */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onYearChange(null)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            filters.year === null
              ? "bg-primary/15 text-primary border border-primary/30"
              : "text-text-muted hover:bg-background border border-transparent"
          )}
        >
          Todos
        </button>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => onYearChange(y === filters.year ? null : y)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              filters.year === y
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-text-muted hover:bg-background border border-transparent"
            )}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="flex gap-2">
        <select
          value={filters.specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          aria-label="Especialidad"
        >
          <option value="">Especialidad</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          aria-label="Estado"
        >
          <option value="">Estado</option>
          <option value="unreviewed">Sin revisar</option>
          <option value="approved">Aprobada</option>
          <option value="flagged">Flagged</option>
          <option value="rejected">Rechazada</option>
        </select>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar texto..."
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
        aria-label="Buscar en texto de preguntas"
      />
    </div>
  );
}
