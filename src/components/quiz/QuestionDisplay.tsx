"use client";

import type { Question } from "@/types/quiz";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { QuizImage } from "./QuizImage";

export function QuestionDisplay({ question }: { question: Question }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-text-inverted text-sm font-bold"
          aria-hidden="true"
        >
          {question.number}
        </span>
        <SafeHtml
          html={question.textHtml}
          className="prose prose-sm max-w-none text-text-primary leading-relaxed"
        />
      </div>
      {question.images.length > 0 && (
        <div className="flex flex-wrap gap-3 pl-11">
          {question.images.map((src, i) => (
            <QuizImage key={i} src={src} alt={`Imagen ${i + 1} de la pregunta ${question.number}`} />
          ))}
        </div>
      )}
    </div>
  );
}
