export const APP_NAME = "Simulador MIR";

export const STORAGE_KEYS = {
  QUIZ_STATE: (year: number) => `mir-quiz-${year}`,
  QUIZ_RESULTS: "mir-results-history",
  PRACTICE_STATE: "mir-practice-state",
} as const;

/** Official MIR exam duration: 5 hours (300 minutes) */
export const MIR_TIME_LIMIT_SECONDS = 5 * 60 * 60;

export const PRACTICE_QUESTION_COUNTS = [10, 25, 50] as const;
