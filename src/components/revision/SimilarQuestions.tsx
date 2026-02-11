"use client";

import type { SimilarEntry } from "@/types/review";
import { Badge } from "@/components/ui/Badge";

interface SimilarQuestionsProps {
  similar: SimilarEntry[];
  onNavigate: (key: string) => void;
}

export function SimilarQuestions({ similar, onNavigate }: SimilarQuestionsProps) {
  if (similar.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        Preguntas similares
      </h3>
      <div className="space-y-3">
        {similar.map((s) => {
          const pct = Math.round(s.score * 100);
          return (
            <button
              key={s.key}
              onClick={() => onNavigate(s.key)}
              className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-background transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-primary">
                    {s.key}
                  </span>
                  <Badge variant="primary">{s.specialty}</Badge>
                </div>
                <span className="text-xs font-semibold text-text-muted">{pct}%</span>
              </div>
              {/* Score bar */}
              <div className="h-1 rounded-full bg-border/50 mb-2">
                <div
                  className="h-full rounded-full bg-primary/60 transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary line-clamp-1">
                {s.textSummary}
              </p>
              {s.shared.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {s.shared.map((code) => (
                    <span
                      key={code}
                      className="text-[10px] bg-background px-1.5 py-0.5 rounded text-text-muted border border-border"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
