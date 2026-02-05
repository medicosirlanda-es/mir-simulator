"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";

export function QuestionGrid({
  questions,
  currentQuestion,
  answers,
  isSubmitted,
  onNavigate,
}: {
  questions: Question[];
  currentQuestion: number;
  answers: Record<number, number | null>;
  isSubmitted: boolean;
  onNavigate: (questionNumber: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
      {questions.map((q) => {
        const isAnswered = answers[q.number] != null;
        const isCurrent = q.number === currentQuestion;

        let correctness: "correct" | "incorrect" | null = null;
        if (isSubmitted && isAnswered) {
          const selectedOrder = answers[q.number]!;
          const correctOrder = q.answers[q.correctAnswerIndex].order;
          correctness = selectedOrder === correctOrder ? "correct" : "incorrect";
        }

        return (
          <button
            key={q.number}
            type="button"
            onClick={() => onNavigate(q.number)}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
              isCurrent && "ring-2 ring-primary ring-offset-1",
              !isSubmitted && isAnswered && "bg-primary text-white",
              !isSubmitted && !isAnswered && "bg-background text-text-secondary hover:bg-primary/10",
              isSubmitted && correctness === "correct" && "bg-success text-white",
              isSubmitted && correctness === "incorrect" && "bg-error text-white",
              isSubmitted && !isAnswered && "bg-background text-text-muted"
            )}
          >
            {q.number}
          </button>
        );
      })}
    </div>
  );
}
