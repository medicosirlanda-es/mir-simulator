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
}

export function ExploradorSection({
  data,
  initialFilters,
  onFiltersChange,
}: ExploradorSectionProps) {
  const [filters, setFilters] = useState<DissectionFilters>(initialFilters);
  const [selectedQuestion, setSelectedQuestion] = useState<DissectionQuestion | null>(null);

  // Sync with external filter changes (e.g., clicking specialty in chart)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const filtered = useMemo(() => filterQuestions(data, filters), [data, filters]);

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
    onFiltersChange({});
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (!selectedQuestion) return;
    const idx = filtered.findIndex((q) => q.number === selectedQuestion.number);
    const newIdx =
      direction === "prev"
        ? (idx - 1 + filtered.length) % filtered.length
        : (idx + 1) % filtered.length;
    setSelectedQuestion(filtered[newIdx]);
  };

  return (
    <div>
      <FilterBar
        data={data}
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
              key={q.number}
              question={q}
              onClick={() => setSelectedQuestion(q)}
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
