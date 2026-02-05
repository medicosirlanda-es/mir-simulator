export interface Answer {
  order: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  number: number;
  text: string;
  textHtml: string;
  images: string[];
  explanation: string | null;
  answers: Answer[];
  correctAnswerIndex: number;
}

export interface Exam {
  year: number;
  totalQuestions: number;
  numOptions: number;
  hasImages: boolean;
  questions: Question[];
}

export interface ExamManifestEntry {
  year: number;
  totalQuestions: number;
  numOptions: number;
  hasImages: boolean;
  imageCount: number;
}

export interface ExamManifest {
  totalExams: number;
  totalQuestions: number;
  yearRange: string;
  exams: ExamManifestEntry[];
}

export type AnswerStatus = "unanswered" | "answered";

export interface UserAnswer {
  questionNumber: number;
  selectedOrder: number | null;
}

export type QuizMode = "exam" | "review";

export interface QuizState {
  examYear: number;
  currentQuestion: number;
  answers: Record<number, number | null>;
  mode: QuizMode;
  isSubmitted: boolean;
  startedAt: string;
  timerSeconds: number | null;
}

export interface QuizResult {
  examYear: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  netScore: number;
  numOptions: number;
  completedAt: string;
  answers: Record<number, number | null>;
}

export type AnswerDisplayState = "default" | "selected" | "correct" | "incorrect" | "missed";

export type QuizAction =
  | { type: "SELECT_ANSWER"; questionNumber: number; selectedOrder: number }
  | { type: "NAVIGATE"; questionNumber: number }
  | { type: "SUBMIT" }
  | { type: "RESTORE"; state: QuizState }
  | { type: "TICK" };
