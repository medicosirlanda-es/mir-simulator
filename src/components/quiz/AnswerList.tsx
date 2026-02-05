"use client";

import type { Question, AnswerDisplayState } from "@/types/quiz";
import { AnswerOption } from "./AnswerOption";

function getAnswerState(
  answer: { order: number; isCorrect: boolean },
  selectedOrder: number | null,
  isSubmitted: boolean
): AnswerDisplayState {
  if (!isSubmitted) {
    return selectedOrder === answer.order ? "selected" : "default";
  }
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
    <fieldset className="space-y-2 pl-11 border-0 p-0 m-0">
      <legend className="sr-only">Opciones de respuesta para la pregunta {question.number}</legend>
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
    </fieldset>
  );
}
