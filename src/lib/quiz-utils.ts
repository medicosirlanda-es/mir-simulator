import type { Exam, QuizResult, QuizState } from "@/types/quiz";

/**
 * MIR net score formula:
 * Net = correct - (incorrect / (numOptions - 1))
 * Unanswered questions don't count.
 */
export function calculateNetScore(
  correct: number,
  incorrect: number,
  numOptions: number
): number {
  const penalty = incorrect / (numOptions - 1);
  return Math.round((correct - penalty) * 100) / 100;
}

export function calculateResult(
  exam: Exam,
  state: QuizState
): QuizResult {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  for (const question of exam.questions) {
    const selected = state.answers[question.number];
    if (selected == null) {
      unanswered++;
    } else {
      const correctOrder = question.answers[question.correctAnswerIndex].order;
      if (selected === correctOrder) {
        correct++;
      } else {
        incorrect++;
      }
    }
  }

  return {
    examYear: exam.year,
    totalQuestions: exam.totalQuestions,
    correct,
    incorrect,
    unanswered,
    netScore: calculateNetScore(correct, incorrect, exam.numOptions),
    numOptions: exam.numOptions,
    completedAt: new Date().toISOString(),
    answers: state.answers,
  };
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function getQuestionStatus(
  questionNumber: number,
  answers: Record<number, number | null>
): "unanswered" | "answered" {
  return answers[questionNumber] != null ? "answered" : "unanswered";
}
