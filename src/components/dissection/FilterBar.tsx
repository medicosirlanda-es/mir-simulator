"use client";

import type { DissectionQuestion, DissectionFilters, DissectionFilterKey } from "@/types/dissection";
import { countBy, sortedEntries, formatLabel, FILTER_FIELDS } from "@/lib/dissection-utils";

interface FilterBarProps {
  data: DissectionQuestion[];
  filters: DissectionFilters;
  onFilterChange: (key: DissectionFilterKey | "search", value: string) => void;
  onClear: () => void;
  filteredCount: number;
}

export function FilterBar({
  data,
  filters,
  onFilterChange,
  onClear,
  filteredCount,
}: FilterBarProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-3 md:p-4 mb-4 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-3">
        {FILTER_FIELDS.map((field) => {
          const counts = countBy(data, field.key as keyof DissectionQuestion);
          const options = sortedEntries(counts);
          return (
            <select
              key={field.key}
              value={filters[field.key] || ""}
              onChange={(e) => onFilterChange(field.key, e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none min-h-[44px]"
              aria-label={field.label}
            >
              <option value="">{field.label} (todas)</option>
              {options.map(([key, count]) => (
                <option key={key} value={key}>
                  {formatLabel(key)} ({count})
                </option>
              ))}
            </select>
          );
        })}
        <input
          type="text"
          placeholder="Buscar texto..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary flex-1 min-w-[180px] transition-colors focus:border-primary focus:outline-none min-h-[44px]"
          aria-label="Buscar en texto de preguntas"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm text-text-muted">
          {filteredCount} de {data.length} preguntas
        </span>
        <button
          onClick={onClear}
          className="text-xs text-primary hover:text-primary-dark transition-colors min-h-[44px] flex items-center"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
