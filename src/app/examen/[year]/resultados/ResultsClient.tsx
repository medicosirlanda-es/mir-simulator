"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExamData } from "@/hooks/useExamData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuizImage } from "@/components/quiz/QuizImage";
import type { QuizResult } from "@/types/quiz";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  RotateCcw,
  Home,
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ReviewFilter = "all" | "incorrect" | "unanswered";

export function ResultsClient({ year }: { year: number }) {
  const router = useRouter();
  const { exam, isLoading } = useExamData(year);
  const [history] = useLocalStorage<QuizResult[]>(STORAGE_KEYS.QUIZ_RESULTS, []);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const result = useMemo(() => {
    return history.filter((r) => r.examYear === year).pop() ?? null;
  }, [history, year]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Container>
      </>
    );
  }

  if (!result || !exam) {
    return (
      <>
        <Header />
        <Container className="py-16 text-center">
          <p className="text-text-secondary">No se encontraron resultados para este examen.</p>
          <Link href={`/examen/${year}`}>
            <Button className="mt-4">Hacer el examen</Button>
          </Link>
        </Container>
      </>
    );
  }

  const percentCorrect = Math.round((result.correct / result.totalQuestions) * 100);

  const filteredQuestions = exam.questions.filter((q) => {
    if (filter === "all") return true;
    const selected = result.answers[q.number];
    if (filter === "unanswered") return selected == null;
    if (filter === "incorrect") {
      if (selected == null) return false;
      const correctOrder = q.answers[q.correctAnswerIndex].order;
      return selected !== correctOrder;
    }
    return true;
  });

  const toggleExpanded = (n: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  return (
    <>
      <Header />
      <Container className="py-8 space-y-8">
        {/* Score Summary */}
        <Card className="p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-text-primary">
            Resultados MIR {year}
          </h1>

          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">{percentCorrect}%</div>
              <div className="text-xs text-text-muted">aciertos</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-success font-bold text-xl">
                <CheckCircle className="h-5 w-5" />
                {result.correct}
              </div>
              <div className="text-xs text-text-muted mt-1">Correctas</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-error font-bold text-xl">
                <XCircle className="h-5 w-5" />
                {result.incorrect}
              </div>
              <div className="text-xs text-text-muted mt-1">Incorrectas</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-text-muted font-bold text-xl">
                <MinusCircle className="h-5 w-5" />
                {result.unanswered}
              </div>
              <div className="text-xs text-text-muted mt-1">Sin responder</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-primary">{result.netScore}</div>
              <div className="text-xs text-text-muted mt-1">Nota neta</div>
            </div>
          </div>

          <ProgressBar value={result.correct} max={result.totalQuestions} color="success" className="max-w-md mx-auto h-3" />

          <p className="text-sm text-text-muted max-w-md mx-auto">
            Fórmula MIR: Aciertos - (Errores / {result.numOptions - 1}) = {result.netScore} puntos netos
          </p>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/examen/${year}`}>
            <Button className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Volver a intentar
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Review section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-text-primary">Revisión de preguntas</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-muted" />
              {(["all", "incorrect", "unanswered"] as ReviewFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-background text-text-secondary hover:bg-primary/10"
                  }`}
                >
                  {f === "all" ? "Todas" : f === "incorrect" ? "Incorrectas" : "Sin responder"}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-text-muted">
            Mostrando {filteredQuestions.length} de {exam.totalQuestions} preguntas
          </p>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const selected = result.answers[q.number];
              const correctOrder = q.answers[q.correctAnswerIndex].order;
              const isCorrect = selected === correctOrder;
              const isExpanded = expandedQuestions.has(q.number);

              return (
                <Card key={q.number} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(q.number)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-background/50 transition-colors cursor-pointer"
                  >
                    <Badge
                      variant={
                        selected == null ? "default" : isCorrect ? "success" : "error"
                      }
                    >
                      {q.number}
                    </Badge>
                    <span className="flex-1 text-sm text-text-primary line-clamp-1">
                      {q.text}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-text-muted shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      <div
                        className="prose prose-sm max-w-none text-text-primary"
                        dangerouslySetInnerHTML={{ __html: q.textHtml }}
                      />
                      {q.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {q.images.map((src, i) => (
                            <QuizImage key={i} src={src} alt={`Imagen pregunta ${q.number}`} />
                          ))}
                        </div>
                      )}
                      <div className="space-y-1.5">
                        {q.answers.map((a) => {
                          const isThisCorrect = a.isCorrect;
                          const wasSelected = selected === a.order;
                          return (
                            <div
                              key={a.order}
                              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                                isThisCorrect
                                  ? "bg-success-light text-success-dark font-medium"
                                  : wasSelected
                                    ? "bg-error-light text-error-dark"
                                    : "text-text-secondary"
                              }`}
                            >
                              {isThisCorrect ? (
                                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                              ) : wasSelected ? (
                                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                              ) : (
                                <span className="w-4" />
                              )}
                              <span>{a.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </>
  );
}
