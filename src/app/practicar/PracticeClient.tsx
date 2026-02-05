"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { QuizImage } from "@/components/quiz/QuizImage";
import { PRACTICE_QUESTION_COUNTS } from "@/lib/constants";
import type { Question, Exam } from "@/types/quiz";
import {
  Shuffle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Loader2,
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
  const [yearFrom, setYearFrom] = useState(2003);
  const [yearTo, setYearTo] = useState(2024);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PracticeAnswer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const startPractice = useCallback(async () => {
    setLoading(true);
    const allQuestions: Question[] = [];

    for (let year = yearFrom; year <= yearTo; year++) {
      try {
        const res = await fetch(`/data/exam-${year}.json`);
        if (res.ok) {
          const exam: Exam = await res.json();
          allQuestions.push(...exam.questions);
        }
      } catch {
        // skip years that fail
      }
    }

    // Shuffle using Fisher-Yates
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
  }, [yearFrom, yearTo, questionCount]);

  const handleSelect = (order: number) => {
    if (showFeedback) return;
    setSelectedOrder(order);
  };

  const handleConfirm = () => {
    if (selectedOrder == null) return;
    const q = questions[currentIndex];
    const correctOrder = q.answers[q.correctAnswerIndex].order;
    const isCorrect = selectedOrder === correctOrder;

    setAnswers((prev) => [
      ...prev,
      { questionNumber: q.number, selectedOrder, isCorrect },
    ]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOrder(null);
      setShowFeedback(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "Enter" && !showFeedback && selectedOrder != null) {
        handleConfirm();
      } else if (e.key === "Enter" && showFeedback) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (phase === "setup") {
    return (
      <>
        <Header />
        <Container className="py-12 max-w-xl mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center">
              <Shuffle className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-bold text-text-primary">Modo Práctica</h1>
              <p className="text-text-secondary mt-2">
                Preguntas aleatorias con respuesta inmediata
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Número de preguntas
                </label>
                <div className="flex gap-2">
                  {PRACTICE_QUESTION_COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        questionCount === n
                          ? "bg-primary text-white"
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
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Desde año
                  </label>
                  <select
                    value={yearFrom}
                    onChange={(e) => setYearFrom(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
                  >
                    {Array.from({ length: 22 }, (_, i) => 2003 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Hasta año
                  </label>
                  <select
                    value={yearTo}
                    onChange={(e) => setYearTo(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
                  >
                    {Array.from({ length: 22 }, (_, i) => 2003 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button onClick={startPractice} disabled={loading} className="w-full gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
              Comenzar práctica
            </Button>
          </Card>
        </Container>
      </>
    );
  }

  if (phase === "finished") {
    const correct = answers.filter((a) => a.isCorrect).length;
    const percent = Math.round((correct / answers.length) * 100);

    return (
      <>
        <Header />
        <Container className="py-12 max-w-xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Práctica completada</h1>

            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">{percent}%</div>
                <div className="text-xs text-text-muted">aciertos</div>
              </div>
            </div>

            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-1 text-success font-bold text-lg">
                  <CheckCircle className="h-5 w-5" />
                  {correct}
                </div>
                <div className="text-xs text-text-muted">Correctas</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-error font-bold text-lg">
                  <XCircle className="h-5 w-5" />
                  {answers.length - correct}
                </div>
                <div className="text-xs text-text-muted">Incorrectas</div>
              </div>
            </div>

            <ProgressBar value={correct} max={answers.length} color="success" className="h-3" />

            <div className="flex gap-3">
              <Button onClick={() => { setPhase("setup"); }} variant="secondary" className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" />
                Nueva práctica
              </Button>
              <Button onClick={startPractice} className="flex-1 gap-2">
                <Shuffle className="h-4 w-4" />
                Repetir
              </Button>
            </div>
          </Card>
        </Container>
      </>
    );
  }

  // Playing phase
  const q = questions[currentIndex];
  const correctOrder = q.answers[q.correctAnswerIndex].order;

  return (
    <>
      <Header />
      <Container className="py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="primary">
            Pregunta {currentIndex + 1} de {questions.length}
          </Badge>
          <span className="text-sm text-text-muted">
            {answers.filter((a) => a.isCorrect).length} / {answers.length} correctas
          </span>
        </div>

        <ProgressBar value={currentIndex + 1} max={questions.length} />

        <Card className="p-6 space-y-6">
          <QuestionDisplay question={q} />

          <div className="space-y-2 pl-11">
            {q.answers.map((answer) => {
              let state: "default" | "selected" | "correct" | "incorrect" = "default";
              if (showFeedback) {
                if (answer.isCorrect) state = "correct";
                else if (selectedOrder === answer.order) state = "incorrect";
              } else if (selectedOrder === answer.order) {
                state = "selected";
              }

              const stateStyles = {
                default: "border-border bg-surface hover:border-primary/40 cursor-pointer",
                selected: "border-primary bg-primary/10 ring-1 ring-primary cursor-pointer",
                correct: "border-success bg-success-light",
                incorrect: "border-error bg-error-light",
              };

              return (
                <button
                  key={answer.order}
                  type="button"
                  onClick={() => handleSelect(answer.order)}
                  disabled={showFeedback}
                  className={`flex items-start gap-3 w-full rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 min-h-[44px] ${stateStyles[state]} ${showFeedback && state === "default" ? "opacity-60" : ""}`}
                >
                  <span className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-0.5 ${
                    state === "correct" ? "bg-success text-white" :
                    state === "incorrect" ? "bg-error text-white" :
                    state === "selected" ? "bg-primary text-white" :
                    "bg-background text-text-secondary"
                  }`}>
                    {state === "correct" ? <CheckCircle className="h-4 w-4" /> :
                     state === "incorrect" ? <XCircle className="h-4 w-4" /> :
                     String.fromCharCode(65 + q.answers.indexOf(answer))}
                  </span>
                  <span className="text-sm leading-relaxed">{answer.text}</span>
                </button>
              );
            })}
          </div>
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
          <div className="space-y-3">
            <Card className={`p-4 border-2 ${selectedOrder === correctOrder ? "border-success bg-success-light" : "border-error bg-error-light"}`}>
              <p className="text-sm font-medium">
                {selectedOrder === correctOrder
                  ? "Correcto!"
                  : `Incorrecto. La respuesta correcta era: ${q.answers[q.correctAnswerIndex].text}`}
              </p>
            </Card>
            <Button onClick={handleNext} className="w-full gap-2">
              {currentIndex + 1 >= questions.length ? "Ver resultados" : "Siguiente pregunta"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}
