"use client";

import { useState, useEffect } from "react";
import type { DissectionQuestion } from "@/types/dissection";

export function useDissectionData(yearParam: string) {
  const [data, setData] = useState<DissectionQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const file = `/data/dissection-${yearParam}.json`;

    fetch(file, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Disección ${yearParam} no encontrada`);
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
  }, [yearParam]);

  return { data, isLoading, error };
}
