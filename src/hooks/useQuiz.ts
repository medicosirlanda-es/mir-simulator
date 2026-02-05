"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import type { Exam, QuizState, QuizAction } from "@/types/quiz";
import { STORAGE_KEYS } from "@/lib/constants";

function createInitialState(exam: Exam): QuizState {
  const initial: Record<number, number | null> = {};
  for (const q of exam.questions) {
    initial[q.number] = null;
  }
  return {
    examYear: exam.year,
    currentQuestion: exam.questions[0]?.number ?? 1,
    answers: initial,
    mode: "exam",
    isSubmitted: false,
    startedAt: new Date().toISOString(),
    timerSeconds: null,
  };
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_ANSWER":
      if (state.isSubmitted) return state;
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionNumber]:
            state.answers[action.questionNumber] === action.selectedOrder
              ? null
              : action.selectedOrder,
        },
      };
    case "NAVIGATE":
      return {
        ...state,
        currentQuestion: action.questionNumber,
      };
    case "SUBMIT":
      return {
        ...state,
        isSubmitted: true,
        mode: "review",
      };
    case "RESTORE":
      return action.state;
    case "TICK":
      if (state.timerSeconds == null) return state;
      return {
        ...state,
        timerSeconds: Math.max(0, state.timerSeconds - 1),
      };
    default:
      return state;
  }
}

export function useQuiz(exam: Exam | null) {
  const [state, dispatch] = useReducer(
    quizReducer,
    null,
    () => {
      if (!exam) {
        return {
          examYear: 0,
          currentQuestion: 1,
          answers: {},
          mode: "exam" as const,
          isSubmitted: false,
          startedAt: new Date().toISOString(),
          timerSeconds: null,
        };
      }
      return createInitialState(exam);
    }
  );

  const hasRestored = useRef(false);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!exam || hasRestored.current) return;
    hasRestored.current = true;

    try {
      const saved = window.localStorage.getItem(
        STORAGE_KEYS.QUIZ_STATE(exam.year)
      );
      if (saved) {
        const parsed = JSON.parse(saved) as QuizState;
        if (parsed.examYear === exam.year && !parsed.isSubmitted) {
          dispatch({ type: "RESTORE", state: parsed });
          return;
        }
      }
    } catch {
      // ignore
    }

    dispatch({ type: "RESTORE", state: createInitialState(exam) });
  }, [exam]);

  // Persist to localStorage on every answer change
  useEffect(() => {
    if (!exam || state.examYear === 0) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.QUIZ_STATE(exam.year),
        JSON.stringify(state)
      );
    } catch {
      // ignore
    }
  }, [exam, state]);

  const selectAnswer = useCallback(
    (questionNumber: number, selectedOrder: number) => {
      dispatch({ type: "SELECT_ANSWER", questionNumber, selectedOrder });
    },
    []
  );

  const navigate = useCallback((questionNumber: number) => {
    dispatch({ type: "NAVIGATE", questionNumber });
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: "SUBMIT" });
    if (exam) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE(exam.year));
      } catch {
        // ignore
      }
    }
  }, [exam]);

  const reset = useCallback(() => {
    if (!exam) return;
    const fresh = createInitialState(exam);
    dispatch({ type: "RESTORE", state: fresh });
    hasRestored.current = true;
  }, [exam]);

  const answeredCount = Object.values(state.answers).filter(
    (v) => v != null
  ).length;

  return {
    state,
    dispatch,
    selectAnswer,
    navigate,
    submit,
    reset,
    answeredCount,
  };
}
