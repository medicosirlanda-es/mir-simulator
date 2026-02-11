"use client";

import { useState, useEffect } from "react";
import type { DissectionQuestion } from "@/types/dissection";
import type { SimilarMap } from "@/types/review";

interface ReviewData {
  questions: DissectionQuestion[];
  similar: SimilarMap;
  loading: boolean;
  error: string | null;
}

export function useReviewData(): ReviewData {
  const [questions, setQuestions] = useState<DissectionQuestion[]>([]);
  const [similar, setSimilar] = useState<SimilarMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [qRes, sRes] = await Promise.all([
          fetch("/data/review-all.json"),
          fetch("/data/review-similar.json"),
        ]);

        if (!qRes.ok) throw new Error(`Failed to load questions: ${qRes.status}`);
        if (!sRes.ok) throw new Error(`Failed to load similar: ${sRes.status}`);

        const [qData, sData] = await Promise.all([qRes.json(), sRes.json()]);

        if (!cancelled) {
          setQuestions(qData);
          setSimilar(sData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error loading data");
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { questions, similar, loading, error };
}
