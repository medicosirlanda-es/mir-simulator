"use client";

import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types/review";

interface QuestionListItemProps {
  year: number;
  number: number;
  specialty: string;
  status: ReviewStatus | null;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_DOTS: Record<string, string> = {
  approved: "bg-success",
  flagged: "bg-warning",
  rejected: "bg-error",
};

export function QuestionListItem({
  year,
  number,
  specialty,
  status,
  isSelected,
  onClick,
}: QuestionListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 border-b border-border/50 transition-colors",
        isSelected
          ? "bg-primary/10 border-l-2 border-l-primary"
          : "hover:bg-background border-l-2 border-l-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            status ? STATUS_DOTS[status] : "border border-border bg-transparent"
          )}
          aria-label={status ?? "sin revisar"}
        />
        <span className="text-xs font-mono text-text-muted">{year}</span>
        <span className="text-sm font-semibold text-text-primary">Q{number}</span>
      </div>
      <p className="text-xs text-text-muted mt-0.5 ml-4 truncate">{specialty}</p>
    </button>
  );
}
