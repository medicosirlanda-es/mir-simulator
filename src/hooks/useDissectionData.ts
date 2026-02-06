"use client";

import { useState, useEffect } from "react";
import type { DissectionQuestion } from "@/types/dissection";

export function useDissectionData(year: number) {
  const [data, setData] = useState<DissectionQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/data/dissection-${year}.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Disección ${year} no encontrada`);
        return res.json();
      })
      .then((questions: DissectionQuestion[]) => {
        setData(questions);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [year]);

  return { data, isLoading, error };
}
