"use client";

import type { DissectionQuestion } from "@/types/dissection";
import type { SimilarEntry, ReviewStatus } from "@/types/review";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { ClickableTag } from "./ClickableTag";
import { SimilarQuestions } from "./SimilarQuestions";
import { ValidationPanel } from "./ValidationPanel";
import { formatLabel, SNOMED_ROLE_LABELS } from "@/lib/dissection-utils";
import { cn } from "@/lib/utils";

interface QuestionDetailProps {
  question: DissectionQuestion;
  similar: SimilarEntry[];
  currentStatus: ReviewStatus | null;
  currentNotes: string;
  onTagClick: (field: string, value: string) => void;
  onSimilarNavigate: (key: string) => void;
  onSetReview: (status: ReviewStatus, notes: string) => void;
  onClearReview: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function QuestionDetail({
  question: q,
  similar,
  currentStatus,
  currentNotes,
  onTagClick,
  onSimilarNavigate,
  onSetReview,
  onClearReview,
  onExport,
  onImport,
}: QuestionDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="text-xl font-mono text-primary bg-primary/10 px-4 py-2 rounded-xl font-bold tracking-tight">
          Q{q.number}
        </span>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-text-primary font-heading">MIR {q.year}</span>
          <span className="text-xs text-text-muted">
            {q.source === "mir_oficial" ? "Pregunta oficial" : q.source}
          </span>
        </div>
      </div>

      {/* Section 1: Question content */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <SafeHtml
          html={q.textHtml || q.text}
          className="text-text-primary leading-relaxed text-[15px] md:text-base"
        />

        {/* Images */}
        {q.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
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
        <div className="space-y-2.5 mt-6">
          {q.answers.map((a) => (
            <div
              key={a.order}
              className={cn(
                "rounded-xl p-4 border transition-colors",
                a.isCorrect
                  ? "bg-success-light/50 border-success/30"
                  : "bg-background border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "text-sm font-mono font-semibold mt-0.5 w-6 shrink-0",
                    a.isCorrect ? "text-success-dark" : "text-text-muted"
                  )}
                >
                  {a.order}.
                </span>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-[15px] leading-relaxed",
                      a.isCorrect
                        ? "text-success-dark font-medium"
                        : "text-text-primary"
                    )}
                  >
                    {a.text}
                  </p>
                  {a.distractorAnalysis && (
                    <p className="text-xs mt-2 text-warning-dark italic leading-relaxed">
                      {a.distractorAnalysis}
                    </p>
                  )}
                </div>
                {a.isCorrect && (
                  <span className="text-success-dark text-[11px] font-bold uppercase tracking-wider shrink-0 bg-success/10 px-2 py-1 rounded-md">
                    Correcta
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Classification (clickable tags) */}
      <div className="bg-surface rounded-2xl border border-border p-5">
        <h3 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wide mb-4">
          Clasificación
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          <ClickableTag title="Especialidad" value={q.specialty} type="spec" field="specialty" onTagClick={onTagClick} />
          <ClickableTag title="Subespecialidad" value={q.subspecialty} type="spec" field="subspecialty" onTagClick={onTagClick} />
          <ClickableTag title="Tema" value={q.topic} type="spec" field="topic" onTagClick={onTagClick} />
          <ClickableTag title="Tipo" value={formatLabel(q.questionType)} type="type" field="questionType" onTagClick={onTagClick} />
          <ClickableTag title="Formulación" value={formatLabel(q.stemStyle)} type="type" field="stemStyle" onTagClick={onTagClick} />
          <ClickableTag title="Nivel cognitivo" value={formatLabel(q.cognitiveLevel)} type="cog" field="cognitiveLevel" onTagClick={onTagClick} />
          <ClickableTag title="Razonamiento" value={formatLabel(q.reasoningType)} type="cog" field="reasoningType" onTagClick={onTagClick} />
          <ClickableTag title="Tipología MIR" value={formatLabel(q.mirTipologia)} type="task" field="mirTipologia" onTagClick={onTagClick} />
          <ClickableTag title="Tarea clínica" value={formatLabel(q.clinicalTask)} type="task" field="clinicalTask" onTagClick={onTagClick} />
          <ClickableTag title="Entorno" value={formatLabel(q.setting)} type="task" field="setting" onTagClick={onTagClick} />
          <ClickableTag title="Población" value={formatLabel(q.population)} type="task" field="population" onTagClick={onTagClick} />
          {q.imageType && (
            <ClickableTag title="Tipo imagen" value={formatLabel(q.imageType)} type="img" field="imageType" onTagClick={onTagClick} />
          )}
        </div>
      </div>

      {/* Section 3: Medical codes (clickable) */}
      {q.snomed && (
        <div className="bg-surface rounded-2xl border border-border p-5">
          <h3 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wide mb-4">
            Codificación SNOMED-CT
          </h3>
          {(Object.entries(q.snomed) as [string, { code: string; display: string; atc?: string }[]][]).map(
            ([role, items]) =>
              items.length > 0 && (
                <div key={role} className="mb-3">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    {SNOMED_ROLE_LABELS[role] || role}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onTagClick("snomed", item.display || item.code)}
                        className="text-xs bg-background border border-border px-2.5 py-1 rounded-lg text-text-secondary hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
                        title={`SNOMED: ${item.code}`}
                      >
                        {item.display}
                        {item.atc && (
                          <span className="text-primary ml-1">[{item.atc}]</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}

          {/* ICD-10 */}
          {q.icd10.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              <span className="text-xs font-semibold text-text-muted">ICD-10:</span>
              {q.icd10.map((c) => (
                <button
                  key={c}
                  onClick={() => onTagClick("icd10", c)}
                  className="text-xs bg-primary-dark/10 text-primary-dark px-2.5 py-1 rounded-lg hover:bg-primary-dark/20 transition-colors cursor-pointer font-medium"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* ATC */}
          {q.atc.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              <span className="text-xs font-semibold text-text-muted">ATC:</span>
              {q.atc.map((c) => (
                <button
                  key={c}
                  onClick={() => onTagClick("atc", c)}
                  className="text-xs bg-accent-green/10 text-accent-green-dark px-2.5 py-1 rounded-lg hover:bg-accent-green/20 transition-colors cursor-pointer font-medium"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 4: Similar questions */}
      <SimilarQuestions similar={similar} onNavigate={onSimilarNavigate} />

      {/* Section 5: Validation */}
      <ValidationPanel
        year={q.year}
        number={q.number}
        currentStatus={currentStatus}
        currentNotes={currentNotes}
        onSetReview={onSetReview}
        onClearReview={onClearReview}
        onExport={onExport}
        onImport={onImport}
      />
    </div>
  );
}
