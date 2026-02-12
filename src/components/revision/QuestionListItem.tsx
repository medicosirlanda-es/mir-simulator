"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Circle } from "lucide-react";
import type { ReviewStatus } from "@/types/review";
import type { QuestionType, CognitiveLevel } from "@/types/dissection";

interface QuestionListItemProps {
  year: number;
  number: number;
  specialty: string;
  questionType: QuestionType;
  cognitiveLevel: CognitiveLevel;
  hasImage: boolean;
  status: ReviewStatus | null;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_ICON: Record<string, { icon: typeof CheckCircle; color: string }> = {
  approved: { icon: CheckCircle, color: "text-success" },
  flagged: { icon: AlertTriangle, color: "text-warning" },
  rejected: { icon: XCircle, color: "text-error" },
};

const TYPE_BADGE: Record<QuestionType, { label: string; style: string }> = {
  caso_clinico: { label: "Caso", style: "bg-primary/10 text-primary border-primary/20" },
  directa: { label: "Directa", style: "bg-accent-green/10 text-accent-green-dark border-accent-green/20" },
  imagen: { label: "Imagen", style: "bg-accent-orange/10 text-accent-orange-dark border-accent-orange/20" },
};

export const QuestionListItem = memo(function QuestionListItem({
  year,
  number,
  specialty,
  questionType,
  cognitiveLevel,
  hasImage,
  status,
  isSelected,
  onClick,
}: QuestionListItemProps) {
  const statusInfo = status ? STATUS_ICON[status] : null;
  const StatusIcon = statusInfo?.icon ?? Circle;
  const typeBadge = TYPE_BADGE[questionType];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 border-b border-border/40 transition-all cursor-pointer",
        isSelected
          ? "bg-primary/[0.08] border-l-[3px] border-l-primary"
          : "hover:bg-background/80 border-l-[3px] border-l-transparent"
      )}
    >
      <div className="flex items-center gap-3">
        <StatusIcon
          className={cn(
            "h-4 w-4 shrink-0",
            statusInfo ? statusInfo.color : "text-border"
          )}
          aria-label={status ?? "sin revisar"}
        />
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-base font-bold text-text-primary font-heading tabular-nums">Q{number}</span>
          <span className="text-xs font-medium text-text-muted tabular-nums">{year}</span>
        </div>
        {/* Badge */}
        <span className={cn("text-[10px] font-semibold border rounded-md px-1.5 py-0.5 leading-none ml-auto shrink-0", typeBadge.style)}>
          {typeBadge.label}
        </span>
      </div>
      <p className="text-sm text-text-secondary mt-1 ml-7 truncate">{specialty}</p>
    </button>
  );
});
