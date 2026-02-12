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
    <div className="bg-surface rounded-2xl border border-border p-5">
      <h3 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wide mb-4">
        Preguntas similares
      </h3>
      <div className="space-y-3">
        {similar.map((s) => {
          const pct = Math.round(s.score * 100);
          return (
            <button
              key={s.key}
              onClick={() => onNavigate(s.key)}
              className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-background/80 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-mono font-bold text-primary">
                    {s.key}
                  </span>
                  <Badge variant="primary">{s.specialty}</Badge>
                </div>
                <span className="text-xs font-bold text-text-muted tabular-nums">{pct}%</span>
              </div>
              {/* Score bar */}
              <div className="h-1.5 rounded-full bg-border/50 mb-2.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {s.textSummary}
              </p>
              {s.shared.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {s.shared.map((code) => (
                    <span
                      key={code}
                      className="text-[11px] bg-background px-2 py-0.5 rounded-md text-text-muted border border-border font-medium"
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
