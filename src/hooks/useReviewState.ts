"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { ReviewState, ReviewStatus, ReviewStats } from "@/types/review";
import { STORAGE_KEYS } from "@/lib/constants";

const INITIAL_STATE: ReviewState = { version: 1, reviews: {} };

function questionKey(year: number, number: number): string {
  return `${year}-Q${number}`;
}

export function useReviewState(totalQuestions: number) {
  const [state, setState] = useLocalStorage<ReviewState>(
    STORAGE_KEYS.REVIEW_STATE,
    INITIAL_STATE
  );

  const getStatus = useCallback(
    (year: number, number: number): ReviewStatus | null => {
      return state.reviews[questionKey(year, number)]?.status ?? null;
    },
    [state]
  );

  const getNotes = useCallback(
    (year: number, number: number): string => {
      return state.reviews[questionKey(year, number)]?.notes ?? "";
    },
    [state]
  );

  const setReview = useCallback(
    (year: number, number: number, status: ReviewStatus, notes: string) => {
      setState((prev) => ({
        ...prev,
        reviews: {
          ...prev.reviews,
          [questionKey(year, number)]: {
            status,
            notes,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [setState]
  );

  const clearReview = useCallback(
    (year: number, number: number) => {
      setState((prev) => {
        const { [questionKey(year, number)]: _, ...rest } = prev.reviews;
        return { ...prev, reviews: rest };
      });
    },
    [setState]
  );

  const computeStats = useCallback((): ReviewStats => {
    const reviews = Object.values(state.reviews);
    const approved = reviews.filter((r) => r.status === "approved").length;
    const flagged = reviews.filter((r) => r.status === "flagged").length;
    const rejected = reviews.filter((r) => r.status === "rejected").length;
    return {
      total: totalQuestions,
      approved,
      flagged,
      rejected,
      unreviewed: totalQuestions - approved - flagged - rejected,
    };
  }, [state, totalQuestions]);

  const exportState = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mir-review-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importState = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as ReviewState;
          if (imported.version !== 1) return;
          setState((prev) => ({
            ...prev,
            reviews: { ...prev.reviews, ...imported.reviews },
          }));
        } catch {
          // Invalid JSON
        }
      };
      reader.readAsText(file);
    },
    [setState]
  );

  return {
    getStatus,
    getNotes,
    setReview,
    clearReview,
    computeStats,
    exportState,
    importState,
  };
}
