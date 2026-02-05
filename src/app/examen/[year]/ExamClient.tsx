"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExamData } from "@/hooks/useExamData";
import { useQuiz } from "@/hooks/useQuiz";
import { calculateResult } from "@/lib/quiz-utils";
import { STORAGE_KEYS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { AnswerList } from "@/components/quiz/AnswerList";
import { QuestionNavigation } from "@/components/quiz/QuestionNavigation";
import { QuestionGrid } from "@/components/quiz/QuestionGrid";
import { Send, Grid3X3, AlertTriangle } from "lucide-react";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-6 w-32 bg-border rounded" />
          <div className="h-5 w-40 bg-border rounded" />
        </div>
        <div className="h-2 w-full bg-border rounded-full" />
      </div>
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-border rounded" />
            <div className="h-4 w-3/4 bg-border rounded" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ml-11 h-12 bg-border rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ExamClient({ year }: { year: number }) {
  const router = useRouter();
  const { exam, isLoading, error } = useExamData(year);
  const { state, selectAnswer, navigate, submit, answeredCount } = useQuiz(exam);
  const [showGrid, setShowGrid] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Warn before leaving with unsaved progress (M-11)
  useEffect(() => {
    if (!exam || state.isSubmitted || answeredCount === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [exam, state.isSubmitted, answeredCount]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main id="main-content">
          <Container className="py-6">
            <LoadingSkeleton />
          </Container>
        </main>
      </>
    );
  }

  if (error || !exam) {
    return (
      <>
        <Header />
        <main id="main-content">
          <Container className="py-16 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-error mb-4" aria-hidden="true" />
            <p className="text-error font-medium text-lg">{error ?? "Error cargando examen"}</p>
            <Button variant="secondary" onClick={() => router.push("/")} className="mt-6">
              Volver al inicio
            </Button>
          </Container>
        </main>
      </>
    );
  }

  const currentQ = exam.questions.find((q) => q.number === state.currentQuestion);
  const questionNumbers = exam.questions.map((q) => q.number);

  const handleSelectAnswer = (order: number) => {
    if (!currentQ) return;
    // Allow deselection by clicking the same answer (M-13)
    if (state.answers[currentQ.number] === order) {
      selectAnswer(currentQ.number, order); // useQuiz handles toggle
    } else {
      selectAnswer(currentQ.number, order);
    }
  };

  const handleSubmit = () => {
    submit();
    const result = calculateResult(exam, { ...state, isSubmitted: true });
    try {
      const history = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) ?? "[]"
      );
      history.push(result);
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(history));
    } catch {
      // ignore
    }
    router.push(`/examen/${year}/resultados`);
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <Container className="py-6">
          <QuizHeader
            examYear={year}
            answeredCount={answeredCount}
            totalQuestions={exam.totalQuestions}
          />

          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Main question area */}
            <div className="flex-1 min-w-0 space-y-6">
              {currentQ && (
                <Card className="p-6 space-y-6">
                  <QuestionDisplay question={currentQ} />
                  <AnswerList
                    question={currentQ}
                    selectedOrder={state.answers[currentQ.number]}
                    isSubmitted={state.isSubmitted}
                    onSelect={handleSelectAnswer}
                  />
                </Card>
              )}

              <QuestionNavigation
                current={state.currentQuestion}
                total={exam.totalQuestions}
                questionNumbers={questionNumbers}
                onNavigate={navigate}
              />

              {/* Mobile grid toggle */}
              <div className="lg:hidden">
                <Button
                  variant="secondary"
                  onClick={() => setShowGrid(!showGrid)}
                  aria-expanded={showGrid}
                  aria-controls="mobile-question-grid"
                  className="w-full gap-2"
                >
                  <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                  {showGrid ? "Ocultar mapa" : "Ver mapa de preguntas"}
                </Button>
                {showGrid && (
                  <Card id="mobile-question-grid" className="mt-3 p-4">
                    <QuestionGrid
                      questions={exam.questions}
                      currentQuestion={state.currentQuestion}
                      answers={state.answers}
                      isSubmitted={state.isSubmitted}
                      onNavigate={(n) => {
                        navigate(n);
                        setShowGrid(false);
                      }}
                    />
                  </Card>
                )}
              </div>

              {/* Submit button */}
              {!state.isSubmitted && (
                <div className="pt-4">
                  {!showConfirm ? (
                    <Button
                      onClick={() => setShowConfirm(true)}
                      className="w-full gap-2"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Finalizar examen
                    </Button>
                  ) : (
                    <Card className="p-6 border-warning space-y-4" role="alertdialog" aria-label="Confirmar entrega">
                      <p className="text-sm font-medium text-text-primary">
                        Has respondido {answeredCount} de {exam.totalQuestions} preguntas.
                        {answeredCount < exam.totalQuestions && (
                          <span className="text-warning-dark font-semibold">
                            {" "}Quedan {exam.totalQuestions - answeredCount} sin responder.
                          </span>
                        )}
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={handleSubmit} className="flex-1">
                          Confirmar y ver resultados
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setShowConfirm(false)}
                          className="flex-1"
                        >
                          Seguir respondiendo
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 shrink-0" aria-label="Panel lateral">
              <div className="sticky top-24 space-y-4">
                <Card className="p-4">
                  <h2 className="text-sm font-semibold text-text-secondary mb-3">
                    Mapa de preguntas
                  </h2>
                  <QuestionGrid
                    questions={exam.questions}
                    currentQuestion={state.currentQuestion}
                    answers={state.answers}
                    isSubmitted={state.isSubmitted}
                    onNavigate={navigate}
                  />
                </Card>
                <div className="text-xs text-text-secondary space-y-1.5 px-1" aria-hidden="true">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-primary" />
                    <span>Respondida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-background border border-border" />
                    <span>Sin responder</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
