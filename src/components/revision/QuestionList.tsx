"use client";

import { useRef, useEffect } from "react";
import type { DissectionQuestion } from "@/types/dissection";
import type { ReviewStatus, ReviewStats } from "@/types/review";
import { QuestionListItem } from "./QuestionListItem";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react";

interface QuestionListProps {
  questions: DissectionQuestion[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getStatus: (year: number, number: number) => ReviewStatus | null;
  stats: ReviewStats;
}

export function QuestionList({
  questions,
  selectedIndex,
  onSelect,
  getStatus,
  stats,
}: QuestionListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const reviewed = stats.approved + stats.flagged + stats.rejected;
  const pct = stats.total > 0 ? ((reviewed / stats.total) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col h-full">
      {/* Progress header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary font-heading">Progreso</span>
          <span className="text-xs font-bold text-primary tabular-nums">{pct}%</span>
        </div>
        <ProgressBar value={reviewed} max={stats.total} color="primary" className="h-2.5" />
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-success-dark font-medium">
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {stats.approved}
          </span>
          <span className="flex items-center gap-1.5 text-warning-dark font-medium">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {stats.flagged}
          </span>
          <span className="flex items-center gap-1.5 text-error-dark font-medium">
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {stats.rejected}
          </span>
          <span className="ml-auto text-text-muted tabular-nums">
            {reviewed}/{stats.total}
          </span>
        </div>
      </div>

      {/* Count badge */}
      <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-medium text-text-muted border-b border-border/50 bg-background/50">
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        {questions.length} preguntas
      </div>

      {/* Scrollable list */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {questions.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-muted">
            No se encontraron preguntas
          </div>
        ) : (
          questions.map((q, i) => (
            <div key={`${q.year}-${q.number}`} ref={i === selectedIndex ? selectedRef : undefined}>
              <QuestionListItem
                year={q.year}
                number={q.number}
                specialty={q.specialty}
                questionType={q.questionType}
                cognitiveLevel={q.cognitiveLevel}
                hasImage={q.images.length > 0}
                status={getStatus(q.year, q.number)}
                isSelected={i === selectedIndex}
                onClick={() => onSelect(i)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
