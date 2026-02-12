"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useReviewData } from "@/hooks/useReviewData";
import { useReviewState } from "@/hooks/useReviewState";
import {
  filterQuestions,
  sortQuestions,
  uniqueValues,
  questionKey,
  parseQuestionKey,
  INITIAL_FILTERS,
  TAG_FIELD_LABELS,
} from "@/lib/review-utils";
import type { ReviewFiltersState } from "@/lib/review-utils";
import type { ReviewStatus, TagFilter } from "@/types/review";
import { formatLabel } from "@/lib/dissection-utils";
import { ReviewFilters } from "@/components/revision/ReviewFilters";
import { QuestionList } from "@/components/revision/QuestionList";
import { QuestionDetail } from "@/components/revision/QuestionDetail";
import { ActiveFilterChip } from "@/components/revision/ActiveFilterChip";

export function RevisionClient() {
  const { questions: allQuestions, similar, loading, error } = useReviewData();
  const {
    getStatus,
    getNotes,
    setReview,
    clearReview,
    computeStats,
    exportState,
    importState,
  } = useReviewState(allQuestions.length);

  const [filters, setFilters] = useState<ReviewFiltersState>(INITIAL_FILTERS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  // Derived data
  const sorted = useMemo(() => sortQuestions(allQuestions), [allQuestions]);
  const filtered = useMemo(
    () => filterQuestions(sorted, filters, getStatus),
    [sorted, filters, getStatus]
  );
  const years = useMemo(
    () => [...new Set(allQuestions.map((q) => q.year))].sort(),
    [allQuestions]
  );
  const specialties = useMemo(
    () => uniqueValues(allQuestions, "specialty"),
    [allQuestions]
  );
  const questionTypes = useMemo(
    () => uniqueValues(allQuestions, "questionType"),
    [allQuestions]
  );
  const cognitiveLevels = useMemo(
    () => uniqueValues(allQuestions, "cognitiveLevel"),
    [allQuestions]
  );
  const clinicalTasks = useMemo(
    () => uniqueValues(allQuestions, "clinicalTask"),
    [allQuestions]
  );
  const populations = useMemo(
    () => uniqueValues(allQuestions, "population"),
    [allQuestions]
  );
  const settingValues = useMemo(
    () => uniqueValues(allQuestions, "setting"),
    [allQuestions]
  );
  const stats = useMemo(() => computeStats(), [computeStats]);

  const currentQuestion = filtered[selectedIndex] ?? null;
  const currentKey = currentQuestion ? questionKey(currentQuestion) : "";
  const currentSimilar = currentKey ? (similar[currentKey] ?? []) : [];

  // Clamp index when filters change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filters.year, filters.specialty, filters.status, filters.questionType, filters.cognitiveLevel, filters.clinicalTask, filters.population, filters.setting, filters.tag?.field, filters.tag?.value, filters.search]);

  // Handle tag click from detail panel
  const handleTagClick = useCallback(
    (field: string, displayValue: string) => {
      // For formatted labels, we need to find the raw value
      const labelFields = [
        "questionType", "stemStyle", "cognitiveLevel", "reasoningType",
        "mirTipologia", "clinicalTask", "setting", "population", "imageType",
      ];

      let rawValue = displayValue;
      if (labelFields.includes(field)) {
        // Find the raw value that matches this formatted label
        const allValues = uniqueValues(allQuestions, field as keyof typeof allQuestions[0]);
        const match = allValues.find((v) => formatLabel(v) === displayValue);
        if (match) rawValue = match;
      }

      setFilters((prev) => ({
        ...prev,
        tag: {
          field,
          value: rawValue,
          label: TAG_FIELD_LABELS[field] ?? field,
        },
      }));
    },
    [allQuestions]
  );

  // Navigate to a question by key (from similar questions)
  const handleSimilarNavigate = useCallback(
    (key: string) => {
      const parsed = parseQuestionKey(key);
      if (!parsed) return;

      // Clear tag filter to show all questions, then find index
      setFilters((prev) => ({ ...prev, tag: null }));

      // After filters update, find the question in filtered results
      const idx = sorted.findIndex(
        (q) => q.year === parsed.year && q.number === parsed.number
      );
      if (idx !== -1) {
        // Need to reset filters to find it
        setFilters(INITIAL_FILTERS);
        // Use setTimeout to let the filter state update
        setTimeout(() => {
          setSelectedIndex(idx);
          setMobileShowDetail(true);
        }, 0);
      }
    },
    [sorted]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      if (e.key === "Escape") {
        if (filters.tag) {
          setFilters((prev) => ({ ...prev, tag: null }));
        } else if (mobileShowDetail) {
          setMobileShowDetail(false);
        }
        return;
      }

      if (isInput) return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          setMobileShowDetail(true);
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          setMobileShowDetail(true);
          break;
        case "A":
          if (currentQuestion) {
            setReview(currentQuestion.year, currentQuestion.number, "approved", getNotes(currentQuestion.year, currentQuestion.number));
          }
          break;
        case "F":
          if (currentQuestion) {
            setReview(currentQuestion.year, currentQuestion.number, "flagged", getNotes(currentQuestion.year, currentQuestion.number));
          }
          break;
        case "R":
          if (currentQuestion) {
            setReview(currentQuestion.year, currentQuestion.number, "rejected", getNotes(currentQuestion.year, currentQuestion.number));
          }
          break;
        case "N":
          e.preventDefault();
          // Focus the notes textarea
          const textarea = document.querySelector("textarea") as HTMLTextAreaElement | null;
          textarea?.focus();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filters.tag, mobileShowDetail, filtered.length, currentQuestion, setReview, getNotes]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-text-muted">Cargando preguntas...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center space-y-2">
            <p className="text-error font-medium">Error al cargar datos</p>
            <p className="text-sm text-text-muted">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="flex h-[calc(100vh-4rem)]">
      {/* LEFT PANEL — Question list */}
      <div
        className={`w-[22rem] lg:w-[26rem] border-r border-border flex flex-col shrink-0 bg-surface ${
          mobileShowDetail ? "hidden md:flex" : "flex"
        }`}
      >
        <ReviewFilters
          filters={filters}
          years={years}
          specialties={specialties}
          questionTypes={questionTypes}
          cognitiveLevels={cognitiveLevels}
          clinicalTasks={clinicalTasks}
          populations={populations}
          settings={settingValues}
          onYearChange={(year) => setFilters((f) => ({ ...f, year }))}
          onSpecialtyChange={(specialty) => setFilters((f) => ({ ...f, specialty }))}
          onStatusChange={(status) => setFilters((f) => ({ ...f, status }))}
          onQuestionTypeChange={(questionType) => setFilters((f) => ({ ...f, questionType }))}
          onCognitiveLevelChange={(cognitiveLevel) => setFilters((f) => ({ ...f, cognitiveLevel }))}
          onClinicalTaskChange={(clinicalTask) => setFilters((f) => ({ ...f, clinicalTask }))}
          onPopulationChange={(population) => setFilters((f) => ({ ...f, population }))}
          onSettingChange={(setting) => setFilters((f) => ({ ...f, setting }))}
          onSearchChange={(search) => setFilters((f) => ({ ...f, search }))}
        />

        {/* Active tag filter */}
        {filters.tag && (
          <div className="px-4 py-2.5 border-b border-border/50 bg-primary/[0.03]">
            <ActiveFilterChip
              label={filters.tag.label}
              value={filters.tag.value}
              onRemove={() => setFilters((f) => ({ ...f, tag: null }))}
            />
          </div>
        )}

        <QuestionList
          questions={filtered}
          selectedIndex={selectedIndex}
          onSelect={(i) => {
            setSelectedIndex(i);
            setMobileShowDetail(true);
          }}
          getStatus={getStatus}
          stats={stats}
        />
      </div>

      {/* RIGHT PANEL — Detail */}
      <div
        className={`flex-1 overflow-y-auto bg-background ${
          mobileShowDetail ? "flex flex-col" : "hidden md:flex md:flex-col"
        }`}
      >
        {/* Mobile back button */}
        <button
          onClick={() => setMobileShowDetail(false)}
          className="md:hidden flex items-center gap-2 px-4 py-3 text-sm text-primary border-b border-border"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </button>

        {currentQuestion ? (
          <div className="p-5 md:p-8 max-w-4xl mx-auto w-full">
            <QuestionDetail
              question={currentQuestion}
              similar={currentSimilar}
              currentStatus={getStatus(currentQuestion.year, currentQuestion.number)}
              currentNotes={getNotes(currentQuestion.year, currentQuestion.number)}
              onTagClick={handleTagClick}
              onSimilarNavigate={handleSimilarNavigate}
              onSetReview={(status, notes) =>
                setReview(currentQuestion.year, currentQuestion.number, status, notes)
              }
              onClearReview={() =>
                clearReview(currentQuestion.year, currentQuestion.number)
              }
              onExport={exportState}
              onImport={importState}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">
              {filtered.length === 0
                ? "No hay preguntas con los filtros actuales"
                : "Selecciona una pregunta"}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
