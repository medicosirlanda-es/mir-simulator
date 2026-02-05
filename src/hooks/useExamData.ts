"use client";

import { useState, useEffect } from "react";
import type { Exam } from "@/types/quiz";

export function useExamData(year: number) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/data/exam-${year}.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Examen ${year} no encontrado`);
        return res.json();
      })
      .then((data: Exam) => {
        setExam(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [year]);

  return { exam, isLoading, error };
}
