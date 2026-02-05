"use client";

import { cn } from "@/lib/utils";
import type { Answer } from "@/types/quiz";
import { Check, X } from "lucide-react";

type AnswerState = "default" | "selected" | "correct" | "incorrect" | "missed";

const stateStyles: Record<AnswerState, string> = {
  default:
    "border-border bg-surface hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
  selected: "border-primary bg-primary/10 ring-1 ring-primary cursor-pointer",
  correct: "border-success bg-success-light",
  incorrect: "border-error bg-error-light",
  missed: "border-success/50 bg-success-light/50",
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
  answerState: AnswerState;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 w-full rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 min-h-[44px]",
        stateStyles[answerState],
        disabled && answerState === "default" && "opacity-60 cursor-default"
      )}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-0.5",
          answerState === "correct"
            ? "bg-success text-white"
            : answerState === "incorrect"
              ? "bg-error text-white"
              : answerState === "selected"
                ? "bg-primary text-white"
                : "bg-background text-text-secondary"
        )}
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
