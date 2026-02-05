"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatTime } from "@/lib/quiz-utils";
import { Clock } from "lucide-react";

export function QuizHeader({
  examYear,
  answeredCount,
  totalQuestions,
  timerSeconds,
}: {
  examYear: number;
  answeredCount: number;
  totalQuestions: number;
  timerSeconds?: number | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-primary">
          MIR {examYear}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            {answeredCount}/{totalQuestions} respondidas
          </span>
          {timerSeconds != null && (
            <span className="flex items-center gap-1.5 text-sm font-mono text-text-secondary">
              <Clock className="h-4 w-4" />
              {formatTime(timerSeconds)}
            </span>
          )}
        </div>
      </div>
      <ProgressBar value={answeredCount} max={totalQuestions} />
    </div>
  );
}
