import type { DissectionQuestion } from "@/types/dissection";
import { formatLabel } from "@/lib/dissection-utils";

interface QuestionCardProps {
  question: DissectionQuestion;
  onClick: () => void;
}

export function QuestionCard({ question: q, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-border rounded-xl p-3 transition-all duration-150 hover:border-primary/30 hover:translate-x-1 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded mt-0.5 shrink-0">
          Q{q.number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary mb-2 line-clamp-2">
            {q.textSummary}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {q.specialty}
            </span>
            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange-dark font-medium">
              {formatLabel(q.questionType)}
            </span>
            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium">
              {formatLabel(q.cognitiveLevel)}
            </span>
            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green-dark font-medium">
              {formatLabel(q.clinicalTask)}
            </span>
            {q.images.length > 0 && (
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-error/10 text-error-dark font-medium">
                Imagen
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
