"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { DissectionQuestion } from "@/types/dissection";
import { formatLabel, SNOMED_ROLE_LABELS } from "@/lib/dissection-utils";
import { MetadataTag } from "./MetadataTag";
import { cn } from "@/lib/utils";

interface QuestionDetailModalProps {
  question: DissectionQuestion;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuestionDetailModal({
  question: q,
  onClose,
  onPrevious,
  onNext,
}: QuestionDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrevious, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Pregunta ${q.number}`}
    >
      <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-lg font-semibold">
              Q{q.number}
            </span>
            <span className="text-sm text-text-muted">MIR {q.year}</span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Question text */}
        <div className="mb-5">
          <p className="text-text-primary leading-relaxed text-sm md:text-base">
            {q.text}
          </p>
        </div>

        {/* Images */}
        {q.images.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-3">
            {q.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Imagen clínica ${i + 1}`}
                className="max-h-56 md:max-h-64 rounded-lg border border-border"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        {/* Answers */}
        <div className="space-y-2 mb-6">
          {q.answers.map((a) => (
            <div
              key={a.order}
              className={cn(
                "rounded-lg p-3 border",
                a.isCorrect
                  ? "bg-success-light/50 border-success/30"
                  : "bg-background border-border"
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "text-xs font-mono mt-0.5",
                    a.isCorrect ? "text-success-dark" : "text-text-muted"
                  )}
                >
                  {a.order}.
                </span>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm",
                      a.isCorrect
                        ? "text-success-dark font-medium"
                        : "text-text-primary"
                    )}
                  >
                    {a.text}
                  </p>
                  {a.distractorAnalysis && (
                    <p className="text-xs mt-1.5 text-warning-dark italic leading-relaxed">
                      {a.distractorAnalysis}
                    </p>
                  )}
                </div>
                {a.isCorrect && (
                  <span className="text-success-dark text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Correcta
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Metadata tags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6">
          <MetadataTag title="Especialidad" value={q.specialty} type="spec" />
          <MetadataTag title="Subespecialidad" value={q.subspecialty} type="spec" />
          <MetadataTag title="Tema" value={q.topic} type="spec" />
          <MetadataTag title="Tipo" value={formatLabel(q.questionType)} type="type" />
          <MetadataTag title="Formulación" value={formatLabel(q.stemStyle)} type="type" />
          <MetadataTag title="Nivel cognitivo" value={formatLabel(q.cognitiveLevel)} type="cog" />
          <MetadataTag title="Razonamiento" value={formatLabel(q.reasoningType)} type="cog" />
          <MetadataTag title="Tipología MIR" value={formatLabel(q.mirTipologia)} type="task" />
          <MetadataTag title="Tarea clínica" value={formatLabel(q.clinicalTask)} type="task" />
          <MetadataTag title="Entorno" value={formatLabel(q.setting)} type="task" />
          <MetadataTag title="Población" value={formatLabel(q.population)} type="task" />
          {q.imageType && (
            <MetadataTag title="Tipo imagen" value={formatLabel(q.imageType)} type="img" />
          )}
        </div>

        {/* SNOMED */}
        {q.snomed && (
          <div className="bg-background rounded-lg p-4 mb-4 border border-border">
            <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Codificación SNOMED-CT
            </h4>
            {(Object.entries(q.snomed) as [string, { code: string; display: string; atc?: string }[]][]).map(
              ([role, items]) =>
                items.length > 0 && (
                  <div key={role} className="mb-2">
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      {SNOMED_ROLE_LABELS[role] || role}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {items.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs bg-background border border-border px-2 py-0.5 rounded text-text-secondary"
                        >
                          {item.display}
                          {item.atc && (
                            <span className="text-primary ml-1">[{item.atc}]</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}

        {/* ICD-10 */}
        {q.icd10.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <span className="text-xs text-text-muted">ICD-10:</span>
            {q.icd10.map((c) => (
              <span
                key={c}
                className="text-xs bg-primary-dark/10 text-primary-dark px-2 py-0.5 rounded"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* ATC */}
        {q.atc.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <span className="text-xs text-text-muted">ATC:</span>
            {q.atc.map((c) => (
              <span
                key={c}
                className="text-xs bg-accent-green/10 text-accent-green-dark px-2 py-0.5 rounded"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <button
            onClick={onPrevious}
            className="text-sm text-text-muted hover:text-primary transition-colors min-h-[44px] flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            onClick={onNext}
            className="text-sm text-text-muted hover:text-primary transition-colors min-h-[44px] flex items-center gap-1"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
