"use client";

import { useRef, useEffect } from "react";
import type { DissectionQuestion } from "@/types/dissection";
import type { ReviewStatus, ReviewStats } from "@/types/review";
import { QuestionListItem } from "./QuestionListItem";
import { ProgressBar } from "@/components/ui/ProgressBar";

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

  return (
    <div className="flex flex-col h-full">
      {/* Progress header */}
      <div className="p-3 border-b border-border space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] text-text-muted flex-wrap">
          <span className="text-success font-medium">{stats.approved} aprobadas</span>
          <span>·</span>
          <span className="text-warning font-medium">{stats.flagged} flagged</span>
          <span>·</span>
          <span className="text-error font-medium">{stats.rejected} rechazadas</span>
        </div>
        <ProgressBar value={reviewed} max={stats.total} color="primary" />
        <div className="text-[10px] text-text-muted text-right">
          {reviewed}/{stats.total} ({stats.total > 0 ? ((reviewed / stats.total) * 100).toFixed(1) : 0}%)
        </div>
      </div>

      {/* Count */}
      <div className="px-3 py-1.5 text-[10px] text-text-muted border-b border-border/50">
        {questions.length} preguntas
      </div>

      {/* Scrollable list */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {questions.length === 0 ? (
          <div className="p-4 text-center text-sm text-text-muted">
            No se encontraron preguntas
          </div>
        ) : (
          questions.map((q, i) => (
            <div key={`${q.year}-${q.number}`} ref={i === selectedIndex ? selectedRef : undefined}>
              <QuestionListItem
                year={q.year}
                number={q.number}
                specialty={q.specialty}
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
