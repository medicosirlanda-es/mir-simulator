"use client";

import { cn } from "@/lib/utils";
import type { Answer, AnswerDisplayState } from "@/types/quiz";
import { Check, X } from "lucide-react";

const stateStyles: Record<AnswerDisplayState, string> = {
  default:
    "border-border bg-surface hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
  selected: "border-primary bg-primary/10 ring-1 ring-primary cursor-pointer",
  correct: "border-success bg-success-light cursor-default",
  incorrect: "border-error bg-error-light cursor-default",
  missed: "border-success/50 bg-success-light/50 cursor-default",
};

const letters = ["A", "B", "C", "D", "E"];

export function AnswerOption({
  answer,
  index,
  answerState,
  onClick,
  disabled,
}: {
  answer: Answer;
  index: number;
  answerState: AnswerDisplayState;
  onClick: () => void;
  disabled: boolean;
}) {
  const stateLabel =
    answerState === "correct"
      ? " - Correcta"
      : answerState === "incorrect"
        ? " - Incorrecta"
        : answerState === "selected"
          ? " - Seleccionada"
          : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={answerState === "selected" ? true : undefined}
      aria-label={`Opción ${letters[index]}: ${answer.text}${stateLabel}`}
      className={cn(
        "flex items-start gap-3 w-full rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 min-h-[44px]",
        stateStyles[answerState],
        disabled && answerState === "default" && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-0.5 transition-colors duration-200",
          answerState === "correct"
            ? "bg-success text-white"
            : answerState === "incorrect"
              ? "bg-error text-white"
              : answerState === "selected"
                ? "bg-primary text-white"
                : "bg-background text-text-secondary"
        )}
        aria-hidden="true"
      >
        {answerState === "correct" ? (
          <Check className="h-4 w-4" />
        ) : answerState === "incorrect" ? (
          <X className="h-4 w-4" />
        ) : (
          letters[index]
        )}
      </span>
      <span className="text-sm leading-relaxed">{answer.text}</span>
    </button>
  );
}
