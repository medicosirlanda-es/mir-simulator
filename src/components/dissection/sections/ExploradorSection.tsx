"use client";

import { useState, useMemo, useEffect } from "react";
import type { DissectionQuestion, DissectionFilters, DissectionFilterKey } from "@/types/dissection";
import { filterQuestions } from "@/lib/dissection-utils";
import { FilterBar } from "@/components/dissection/FilterBar";
import { QuestionCard } from "@/components/dissection/QuestionCard";
import { QuestionDetailModal } from "@/components/dissection/QuestionDetailModal";

interface ExploradorSectionProps {
  data: DissectionQuestion[];
  initialFilters: DissectionFilters;
  onFiltersChange: (filters: DissectionFilters) => void;
  isMultiYear?: boolean;
}

export function ExploradorSection({
  data,
  initialFilters,
  onFiltersChange,
  isMultiYear,
}: ExploradorSectionProps) {
  const [filters, setFilters] = useState<DissectionFilters>(initialFilters);
  const [selectedQuestion, setSelectedQuestion] = useState<DissectionQuestion | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("");

  // Sync with external filter changes (e.g., clicking specialty in chart)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const filtered = useMemo(() => {
    let result = filterQuestions(data, filters);
    if (yearFilter) {
      result = result.filter((q) => String(q.year) === yearFilter);
    }
    return result;
  }, [data, filters, yearFilter]);

  const years = useMemo(() => {
    if (!isMultiYear) return [];
    return [...new Set(data.map((q) => q.year))].sort();
  }, [data, isMultiYear]);

  const handleFilterChange = (key: DissectionFilterKey | "search", value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    setYearFilter("");
    onFiltersChange({});
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (!selectedQuestion) return;
    const idx = filtered.findIndex(
      (q) => q.year === selectedQuestion.year && q.number === selectedQuestion.number
    );
    const newIdx =
      direction === "prev"
        ? (idx - 1 + filtered.length) % filtered.length
        : (idx + 1) % filtered.length;
    setSelectedQuestion(filtered[newIdx]);
  };

  return (
    <div>
      {/* Year filter for multi-year */}
      {isMultiYear && years.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none min-h-[44px]"
            aria-label="Filtrar por convocatoria"
          >
            <option value="">Convocatoria (todas)</option>
            {years.map((y) => {
              const count = data.filter((q) => q.year === y).length;
              return (
                <option key={y} value={y}>
                  {y} ({count})
                </option>
              );
            })}
          </select>
        </div>
      )}

      <FilterBar
        data={yearFilter ? data.filter((q) => String(q.year) === yearFilter) : data}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
        filteredCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-8">Sin resultados</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QuestionCard
              key={`${q.year}-${q.number}`}
              question={q}
              onClick={() => setSelectedQuestion(q)}
              showYear={isMultiYear}
            />
          ))}
        </div>
      )}

      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onPrevious={() => navigateQuestion("prev")}
          onNext={() => navigateQuestion("next")}
        />
      )}
    </div>
  );
}
