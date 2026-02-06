export const APP_NAME = "Simulador MIR";

export const EXAM_YEAR_START = 2003;
export const EXAM_YEAR_END = 2024;
export const EXAM_YEARS = Array.from(
  { length: EXAM_YEAR_END - EXAM_YEAR_START + 1 },
  (_, i) => EXAM_YEAR_START + i
);

export const STORAGE_KEYS = {
  QUIZ_STATE: (year: number) => `mir-quiz-${year}`,
  QUIZ_RESULTS: "mir-results-history",
  PRACTICE_STATE: "mir-practice-state",
} as const;

export const PRACTICE_QUESTION_COUNTS = [10, 25, 50] as const;

export const DISSECTION_YEARS = [2024] as const;
