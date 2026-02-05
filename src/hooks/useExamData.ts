"use client";

import { useState, useEffect } from "react";
import type { Exam } from "@/types/quiz";

export function useExamData(year: number) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/data/exam-${year}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Examen ${year} no encontrado`);
        return res.json();
      })
      .then((data: Exam) => {
        if (!cancelled) {
          setExam(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return { exam, isLoading, error };
}
