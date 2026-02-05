"use client";

import type { Question } from "@/types/quiz";
import { AnswerOption } from "./AnswerOption";

type AnswerState = "default" | "selected" | "correct" | "incorrect" | "missed";

function getAnswerState(
  answer: { order: number; isCorrect: boolean },
  selectedOrder: number | null,
  isSubmitted: boolean
): AnswerState {
  if (!isSubmitted) {
    return selectedOrder === answer.order ? "selected" : "default";
  }
  // Submitted / review mode
  if (answer.isCorrect) return "correct";
  if (selectedOrder === answer.order) return "incorrect";
  return "default";
}

export function AnswerList({
  question,
  selectedOrder,
  isSubmitted,
  onSelect,
}: {
  question: Question;
  selectedOrder: number | null;
  isSubmitted: boolean;
  onSelect: (order: number) => void;
}) {
  return (
    <div className="space-y-2 pl-11">
      {question.answers.map((answer, i) => (
        <AnswerOption
          key={answer.order}
          answer={answer}
          index={i}
          answerState={getAnswerState(answer, selectedOrder, isSubmitted)}
          onClick={() => onSelect(answer.order)}
          disabled={isSubmitted}
        />
      ))}
    </div>
  );
}
