"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { AnswerOption } from "@/components/quiz/AnswerOption";
import { PRACTICE_QUESTION_COUNTS, EXAM_YEARS, EXAM_YEAR_START, EXAM_YEAR_END } from "@/lib/constants";
import type { Question, Exam, AnswerDisplayState } from "@/types/quiz";
import {
  Shuffle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Loader2,
  Target,
} from "lucide-react";

type PracticePhase = "setup" | "playing" | "finished";

interface PracticeAnswer {
  questionNumber: number;
  selectedOrder: number;
  isCorrect: boolean;
}

export function PracticeClient() {
  const [phase, setPhase] = useState<PracticePhase>("setup");
  const [questionCount, setQuestionCount] = useState(25);
  const [yearFrom, setYearFrom] = useState(EXAM_YEAR_START);
  const [yearTo, setYearTo] = useState(EXAM_YEAR_END);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const validYearRange = yearFrom <= yearTo;

  const startPractice = useCallback(async () => {
    if (!validYearRange) return;
    setLoading(true);

    const yearRange = EXAM_YEARS.filter((y) => y >= yearFrom && y <= yearTo);
    const results = await Promise.allSettled(
      yearRange.map((year) =>
        fetch(`/data/exam-${year}.json`).then((res) => {
          if (!res.ok) throw new Error();
          return res.json() as Promise<Exam>;
        })
      )
    );

    const allQuestions: Question[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allQuestions.push(...result.value.questions);
      }
    }

    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    setQuestions(allQuestions.slice(0, questionCount));
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOrder(null);
    setShowFeedback(false);
    setPhase("playing");
    setLoading(false);
  }, [yearFrom, yearTo, questionCount, validYearRange]);

  const handleSelect = useCallback(
    (order: number) => {
      if (showFeedback) return;
      setSelectedOrder(order);
    },
    [showFeedback]
  );

  const handleConfirm = useCallback(() => {
    if (selectedOrder == null || currentIndex >= questions.length) return;
    const q = questions[currentIndex];
    const correctOrder = q.answers[q.correctAnswerIndex].order;
    const isCorrect = selectedOrder === correctOrder;

    setAnswers((prev) => [
      ...prev,
      { questionNumber: q.number, selectedOrder, isCorrect },
    ]);
    setShowFeedback(true);
  }, [selectedOrder, currentIndex, questions]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOrder(null);
      setShowFeedback(false);
    }
  }, [currentIndex, questions.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "Enter") {
        if (!showFeedback && selectedOrder != null) {
          handleConfirm();
        } else if (showFeedback) {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, showFeedback, selectedOrder, handleConfirm, handleNext]);

  if (phase === "setup") {
    return (
      <>
        <Header />
        <main id="main-content">
          <Container className="py-12 max-w-xl mx-auto">
            <Card className="p-8 space-y-6 animate-scale-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <Shuffle className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold font-heading text-text-primary">Modo Practica</h1>
                <p className="text-text-secondary mt-2">
                  Preguntas aleatorias con respuesta inmediata
                </p>
              </div>

              <div className="flex gap-3 text-xs text-text-muted">
                <div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-2 flex-1">
                  <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
                  <span>Feedback instantaneo</span>
                </div>
                <div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-2 flex-1">
                  <Shuffle className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>Orden aleatorio</span>
                </div>
                <div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-2 flex-1">
                  <Target className="h-3.5 w-3.5 text-accent-orange shrink-0" aria-hidden="true" />
                  <span>Sin temporizador</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2.5" id="question-count-label">
                    Número de preguntas
                  </label>
                  <div className="flex gap-2" role="radiogroup" aria-labelledby="question-count-label">
                    {PRACTICE_QUESTION_COUNTS.map((n) => (
                      <button
                        key={n}
                        role="radio"
                        aria-checked={questionCount === n}
                        onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          questionCount === n
                            ? "bg-primary text-white shadow-sm"
                            : "bg-background text-text-secondary hover:bg-primary/10"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="year-from" className="block text-sm font-medium text-text-primary mb-2">
                      Desde año
                    </label>
                    <select
                      id="year-from"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-primary"
                    >
                      {EXAM_YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year-to" className="block text-sm font-medium text-text-primary mb-2">
                      Hasta año
                    </label>
                    <select
                      id="year-to"
                      value={yearTo}
                      onChange={(e) => setYearTo(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-primary"
                    >
                      {EXAM_YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!validYearRange && (
                  <p className="text-sm text-error-dark font-medium" role="alert">
                    El año de inicio debe ser menor o igual al año final.
                  </p>
                )}
              </div>

              <Button onClick={startPractice} disabled={loading || !validYearRange} className="w-full gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Shuffle className="h-4 w-4" aria-hidden="true" />
                )}
                {loading ? "Cargando preguntas..." : "Comenzar práctica"}
              </Button>
            </Card>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (phase === "finished") {
    const correct = answers.filter((a) => a.isCorrect).length;
    const total = answers.length || 1;
    const percent = Math.round((correct / total) * 100);
    const scoreColor =
      percent >= 70 ? "text-success-dark" : percent >= 40 ? "text-accent-orange-dark" : "text-error-dark";

    return (
      <>
        <Header />
        <main id="main-content">
          <Container className="py-12 max-w-xl mx-auto">
            <Card className="p-8 text-center space-y-6 animate-scale-in">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-6 w-6 text-primary" aria-hidden="true" />
                <h1 className="text-2xl font-bold text-text-primary">Práctica completada</h1>
              </div>

              <div className="relative inline-flex items-center justify-center w-32 h-32 mx-auto animate-count-up">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                  <circle
                    cx="64" cy="64" r="56" fill="none"
                    stroke={percent >= 70 ? "var(--color-success)" : percent >= 40 ? "var(--color-accent-orange)" : "var(--color-error)"}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(percent / 100) * 351.86} 351.86`}
                  />
                </svg>
                <div className="relative">
                  <div className={`text-3xl font-extrabold ${scoreColor}`}>{percent}%</div>
                  <div className="text-xs text-text-secondary">aciertos</div>
                </div>
              </div>

              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-success-dark font-bold text-lg">
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    {correct}
                  </div>
                  <div className="text-xs text-text-secondary">Correctas</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-error-dark font-bold text-lg">
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                    {answers.length - correct}
                  </div>
                  <div className="text-xs text-text-secondary">Incorrectas</div>
                </div>
              </div>

              <ProgressBar value={correct} max={answers.length} color="success" className="h-3" />

              <div className="flex gap-3">
                <Button onClick={() => setPhase("setup")} variant="secondary" className="flex-1 gap-2">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Nueva práctica
                </Button>
                <Button onClick={startPractice} className="flex-1 gap-2">
                  <Shuffle className="h-4 w-4" aria-hidden="true" />
                  Repetir
                </Button>
              </div>
            </Card>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // Playing phase
  const q = questions[currentIndex];
  if (!q) return null;

  const correctOrder = q.answers[q.correctAnswerIndex].order;

  return (
    <>
      <Header />
      <main id="main-content">
        <Container className="py-6 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="primary">
              Pregunta {currentIndex + 1} de {questions.length}
            </Badge>
            <span className="text-sm text-text-secondary">
              <span className="text-success-dark font-semibold">{answers.filter((a) => a.isCorrect).length}</span> / {answers.length} correctas
            </span>
          </div>

          <ProgressBar value={currentIndex + 1} max={questions.length} />

          <Card className="p-6 space-y-6 animate-fade-in">
            <QuestionDisplay question={q} />

            <fieldset className="space-y-2 pl-11 border-0 p-0 m-0">
              <legend className="sr-only">Opciones de respuesta</legend>
              {q.answers.map((answer, i) => {
                let state: AnswerDisplayState = "default";
                if (showFeedback) {
                  if (answer.isCorrect) state = "correct";
                  else if (selectedOrder === answer.order) state = "incorrect";
                } else if (selectedOrder === answer.order) {
                  state = "selected";
                }

                return (
                  <AnswerOption
                    key={answer.order}
                    answer={answer}
                    index={i}
                    answerState={state}
                    onClick={() => handleSelect(answer.order)}
                    disabled={showFeedback}
                  />
                );
              })}
            </fieldset>
          </Card>

          {!showFeedback ? (
            <Button
              onClick={handleConfirm}
              disabled={selectedOrder == null}
              className="w-full"
            >
              Comprobar respuesta
            </Button>
          ) : (
            <div className="space-y-3 animate-slide-up">
              <Card
                className={`p-4 border-2 ${
                  selectedOrder === correctOrder
                    ? "border-success bg-success-light"
                    : "border-error bg-error-light"
                }`}
              >
                <div className="flex items-start gap-2">
                  {selectedOrder === correctOrder ? (
                    <CheckCircle className="h-5 w-5 text-success-dark shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error-dark shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <p className="text-sm font-medium" role="alert">
                    {selectedOrder === correctOrder
                      ? "Correcto!"
                      : `Incorrecto. La respuesta correcta era: ${q.answers[q.correctAnswerIndex].text}`}
                  </p>
                </div>
              </Card>
              <Button onClick={handleNext} className="w-full gap-2">
                {currentIndex + 1 >= questions.length ? "Ver resultados" : "Siguiente pregunta"}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
