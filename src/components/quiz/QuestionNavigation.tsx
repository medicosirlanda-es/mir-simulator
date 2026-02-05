"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function QuestionNavigation({
  current,
  total,
  questionNumbers,
  onNavigate,
}: {
  current: number;
  total: number;
  questionNumbers: number[];
  onNavigate: (questionNumber: number) => void;
}) {
  const currentIndex = questionNumbers.indexOf(current);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < questionNumbers.length - 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="secondary"
        onClick={() => hasPrev && onNavigate(questionNumbers[currentIndex - 1])}
        disabled={!hasPrev}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <span className="text-sm font-medium text-text-secondary">
        Pregunta {currentIndex + 1} de {total}
      </span>

      <Button
        variant="secondary"
        onClick={() =>
          hasNext && onNavigate(questionNumbers[currentIndex + 1])
        }
        disabled={!hasNext}
        className="gap-1"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
