"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { formatLabel } from "@/lib/dissection-utils";
import type { ReviewFiltersState } from "@/lib/review-utils";

interface ReviewFiltersProps {
  filters: ReviewFiltersState;
  years: number[];
  specialties: string[];
  questionTypes: string[];
  cognitiveLevels: string[];
  clinicalTasks: string[];
  populations: string[];
  settings: string[];
  onYearChange: (year: number | null) => void;
  onSpecialtyChange: (specialty: string) => void;
  onStatusChange: (status: string) => void;
  onQuestionTypeChange: (value: string) => void;
  onCognitiveLevelChange: (value: string) => void;
  onClinicalTaskChange: (value: string) => void;
  onPopulationChange: (value: string) => void;
  onSettingChange: (value: string) => void;
  onSearchChange: (search: string) => void;
}

/** Count how many advanced filters are active */
function countActiveAdvanced(filters: ReviewFiltersState): number {
  let count = 0;
  if (filters.questionType) count++;
  if (filters.cognitiveLevel) count++;
  if (filters.clinicalTask) count++;
  if (filters.population) count++;
  if (filters.setting) count++;
  return count;
}

export function ReviewFilters({
  filters,
  years,
  specialties,
  questionTypes,
  cognitiveLevels,
  clinicalTasks,
  populations,
  settings,
  onYearChange,
  onSpecialtyChange,
  onStatusChange,
  onQuestionTypeChange,
  onCognitiveLevelChange,
  onClinicalTaskChange,
  onPopulationChange,
  onSettingChange,
  onSearchChange,
}: ReviewFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeAdvanced = countActiveAdvanced(filters);

  return (
    <div className="p-4 border-b border-border space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
        <input
          type="text"
          placeholder="Buscar en preguntas..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          aria-label="Buscar en texto de preguntas"
        />
      </div>

      {/* Year pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onYearChange(null)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
            filters.year === null
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary bg-background hover:bg-primary/10 hover:text-primary"
          )}
        >
          Todos
        </button>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => onYearChange(y === filters.year ? null : y)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              filters.year === y
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary bg-background hover:bg-primary/10 hover:text-primary"
            )}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Primary dropdowns — stacked full width */}
      <div className="space-y-2">
        <select
          value={filters.specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
          aria-label="Especialidad"
        >
          <option value="">Todas las especialidades</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
            aria-label="Estado de revisión"
          >
            <option value="">Estado</option>
            <option value="unreviewed">Sin revisar</option>
            <option value="approved">Aprobada</option>
            <option value="flagged">Flagged</option>
            <option value="rejected">Rechazada</option>
          </select>

          <select
            value={filters.questionType}
            onChange={(e) => onQuestionTypeChange(e.target.value)}
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
            aria-label="Tipo de pregunta"
          >
            <option value="">Tipo</option>
            {questionTypes.map((t) => (
              <option key={t} value={t}>{formatLabel(t)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced filters toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
          showAdvanced || activeAdvanced > 0
            ? "bg-primary/10 text-primary"
            : "text-text-muted hover:bg-background hover:text-text-secondary"
        )}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Más filtros
          {activeAdvanced > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center px-1.5 py-0.5">
              {activeAdvanced}
            </span>
          )}
        </span>
        {showAdvanced ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Advanced filter dropdowns */}
      {showAdvanced && (
        <div className="space-y-2 pt-1">
          <select
            value={filters.cognitiveLevel}
            onChange={(e) => onCognitiveLevelChange(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
            aria-label="Nivel cognitivo"
          >
            <option value="">Nivel cognitivo</option>
            {cognitiveLevels.map((c) => (
              <option key={c} value={c}>{formatLabel(c)}</option>
            ))}
          </select>

          <select
            value={filters.clinicalTask}
            onChange={(e) => onClinicalTaskChange(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
            aria-label="Tarea clínica"
          >
            <option value="">Tarea clínica</option>
            {clinicalTasks.map((c) => (
              <option key={c} value={c}>{formatLabel(c)}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={filters.population}
              onChange={(e) => onPopulationChange(e.target.value)}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
              aria-label="Población"
            >
              <option value="">Población</option>
              {populations.map((p) => (
                <option key={p} value={p}>{formatLabel(p)}</option>
              ))}
            </select>

            <select
              value={filters.setting}
              onChange={(e) => onSettingChange(e.target.value)}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
              aria-label="Entorno clínico"
            >
              <option value="">Entorno</option>
              {settings.map((s) => (
                <option key={s} value={s}>{formatLabel(s)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
