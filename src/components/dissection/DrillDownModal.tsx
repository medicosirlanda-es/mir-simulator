"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { X } from "lucide-react";
import type { DissectionQuestion } from "@/types/dissection";
import { QuestionDetailModal } from "./QuestionDetailModal";
import { formatLabel } from "@/lib/dissection-utils";
import { cn } from "@/lib/utils";

interface DrillDownModalProps {
  title: string;
  subtitle?: string;
  questions: DissectionQuestion[];
  onClose: () => void;
}

export function DrillDownModal({
  title,
  subtitle,
  questions,
  onClose,
}: DrillDownModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<DissectionQuestion | null>(null);

  // Group by year
  const grouped = useMemo(() => {
    const map = new Map<number, DissectionQuestion[]>();
    for (const q of questions) {
      const list = map.get(q.year) ?? [];
      list.push(q);
      map.set(q.year, list);
    }
    // Sort years descending, questions by number within each year
    return [...map.entries()]
      .sort(([a], [b]) => b - a)
      .map(([year, qs]) => ({
        year,
        questions: qs.sort((a, b) => a.number - b.number),
      }));
  }, [questions]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !selectedQuestion) onClose();
    },
    [onClose, selectedQuestion]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const navigateQuestion = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedQuestion) return;
      const flat = grouped.flatMap((g) => g.questions);
      const idx = flat.findIndex(
        (q) => q.year === selectedQuestion.year && q.number === selectedQuestion.number
      );
      const newIdx =
        direction === "prev"
          ? (idx - 1 + flat.length) % flat.length
          : (idx + 1) % flat.length;
      setSelectedQuestion(flat[newIdx]);
    },
    [selectedQuestion, grouped]
  );

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{title}</h2>
              <p className="text-sm text-text-muted mt-0.5">
                {subtitle ?? `${questions.length} preguntas`}
                {grouped.length > 1 && ` · ${grouped.length} convocatorias`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {grouped.map(({ year, questions: qs }) => (
              <div key={year}>
                {/* Year header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                    MIR {year}
                  </span>
                  <span className="text-xs text-text-muted">
                    {qs.length} {qs.length === 1 ? "pregunta" : "preguntas"}
                  </span>
                  <div className="flex-1 border-t border-border/50" />
                </div>

                {/* Question list */}
                <div className="space-y-2">
                  {qs.map((q) => (
                    <button
                      key={`${q.year}-${q.number}`}
                      onClick={() => setSelectedQuestion(q)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-background transition-all duration-150 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded shrink-0 mt-0.5">
                          Q{q.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                            {q.textSummary || q.text.slice(0, 150)}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {q.specialty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange-dark font-medium">
                              {formatLabel(q.questionType)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium">
                              {formatLabel(q.cognitiveLevel)}
                            </span>
                            {q.images.length > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error-dark font-medium">
                                Imagen
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full question detail when clicking a question */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onPrevious={() => navigateQuestion("prev")}
          onNext={() => navigateQuestion("next")}
        />
      )}
    </>
  );
}
