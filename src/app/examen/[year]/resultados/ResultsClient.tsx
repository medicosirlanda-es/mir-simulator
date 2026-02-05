"use client";

import { useState, useMemo } from "react";
import { useExamData } from "@/hooks/useExamData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { QuizImage } from "@/components/quiz/QuizImage";
import type { QuizResult } from "@/types/quiz";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  RotateCcw,
  Home,
  Filter,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Award,
} from "lucide-react";

type ReviewFilter = "all" | "incorrect" | "unanswered";

export function ResultsClient({ year }: { year: number }) {
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
        <main id="main-content">
          <Container className="py-16">
            <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
              <div className="h-8 w-48 bg-border rounded mx-auto" />
              <div className="h-32 w-32 rounded-full bg-border mx-auto" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-border rounded-xl" />
                ))}
              </div>
            </div>
          </Container>
        </main>
      </>
    );
  }

  if (!result || !exam) {
    return (
      <>
        <Header />
        <main id="main-content">
          <Container className="py-16 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-text-muted mb-4" aria-hidden="true" />
            <p className="text-text-secondary text-lg">No se encontraron resultados para este examen.</p>
            <Link
              href={`/examen/${year}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-primary-light mt-6"
            >
              Hacer el examen
            </Link>
          </Container>
        </main>
        <Footer />
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

  const scoreColor =
    percentCorrect >= 70 ? "text-success-dark" : percentCorrect >= 40 ? "text-accent-orange-dark" : "text-error-dark";

  return (
    <>
      <Header />
      <main id="main-content">
        <Container className="py-8 space-y-8 max-w-4xl">
          {/* Score Summary */}
          <Card className="p-8 text-center space-y-6 animate-scale-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-6 w-6 text-primary" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Resultados MIR {year}
              </h1>
            </div>

            <div className="relative inline-flex items-center justify-center w-36 h-36 mx-auto animate-count-up">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144" aria-hidden="true">
                <circle cx="72" cy="72" r="64" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                <circle
                  cx="72" cy="72" r="64" fill="none"
                  stroke={percentCorrect >= 70 ? "var(--color-success)" : percentCorrect >= 40 ? "var(--color-accent-orange)" : "var(--color-error)"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(percentCorrect / 100) * 402.12} 402.12`}
                />
              </svg>
              <div className="relative">
                <div className={`text-4xl font-extrabold ${scoreColor}`}>{percentCorrect}%</div>
                <div className="text-xs text-text-secondary mt-0.5">aciertos</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-success-dark font-bold text-xl">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  {result.correct}
                </div>
                <div className="text-xs text-text-secondary mt-1">Correctas</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-error-dark font-bold text-xl">
                  <XCircle className="h-5 w-5" aria-hidden="true" />
                  {result.incorrect}
                </div>
                <div className="text-xs text-text-secondary mt-1">Incorrectas</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-text-secondary font-bold text-xl">
                  <MinusCircle className="h-5 w-5" aria-hidden="true" />
                  {result.unanswered}
                </div>
                <div className="text-xs text-text-secondary mt-1">Sin responder</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="font-bold text-xl text-primary">{result.netScore}</div>
                <div className="text-xs text-text-secondary mt-1">Nota neta</div>
              </Card>
            </div>

            <ProgressBar value={result.correct} max={result.totalQuestions} color="success" className="max-w-md mx-auto h-3" />

            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Fórmula MIR: Aciertos - (Errores / {result.numOptions - 1}) = <strong className="text-text-primary">{result.netScore}</strong> puntos netos
            </p>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up stagger-2">
            <Link
              href={`/examen/${year}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-primary-light hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Volver a intentar
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-border px-6 py-3 font-semibold text-primary transition-all duration-200 min-h-[44px] hover:bg-background"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Volver al inicio
            </Link>
          </div>

          {/* Review section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-text-primary">Revisión de preguntas</h2>
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Filtrar preguntas">
                <Filter className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                {(["all", "incorrect", "unanswered"] as ReviewFilter[]).map((f) => {
                  const labels: Record<ReviewFilter, string> = {
                    all: "Todas",
                    incorrect: "Incorrectas",
                    unanswered: "Sin responder",
                  };
                  return (
                    <button
                      key={f}
                      role="radio"
                      aria-checked={filter === f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        filter === f
                          ? "bg-primary text-white shadow-sm"
                          : "bg-background text-text-secondary hover:bg-primary/10"
                      }`}
                    >
                      {labels[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-sm text-text-secondary">
              Mostrando {filteredQuestions.length} de {exam.totalQuestions} preguntas
            </p>

            {filteredQuestions.length === 0 && (
              <Card className="p-8 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-success mb-3" aria-hidden="true" />
                <p className="text-text-secondary font-medium">
                  {filter === "incorrect"
                    ? "No hay preguntas incorrectas. Enhorabuena!"
                    : "No hay preguntas sin responder."}
                </p>
              </Card>
            )}

            <div className="space-y-2">
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
                      aria-expanded={isExpanded}
                      aria-controls={`question-detail-${q.number}`}
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
                        <ChevronUp className="h-4 w-4 text-text-secondary shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-secondary shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {isExpanded && (
                      <div
                        id={`question-detail-${q.number}`}
                        className="px-4 pb-4 space-y-3 border-t border-border pt-3 animate-slide-down"
                      >
                        <SafeHtml
                          html={q.textHtml}
                          className="prose prose-sm max-w-none text-text-primary"
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
                                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                                  isThisCorrect
                                    ? "bg-success-light text-success-dark font-medium"
                                    : wasSelected
                                      ? "bg-error-light text-error-dark"
                                      : "text-text-secondary"
                                }`}
                              >
                                {isThisCorrect ? (
                                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                                ) : wasSelected ? (
                                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                                ) : (
                                  <span className="w-4" aria-hidden="true" />
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
      </main>
      <Footer />
    </>
  );
}
