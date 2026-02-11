"use client";

import { CHART_PALETTE } from "@/lib/dissection-utils";
import { cn } from "@/lib/utils";

interface CodeBarListProps {
  data: [string, number][];
  onItemClick?: (name: string) => void;
}

export function CodeBarList({ data, onItemClick }: CodeBarListProps) {
  if (data.length === 0) {
    return <p className="text-text-muted text-sm">Sin datos</p>;
  }

  const maxValue = data[0][1];
  const isClickable = !!onItemClick;

  return (
    <div className="space-y-1.5">
      {data.map(([name, count], i) => {
        const Tag = isClickable ? "button" : "div";
        return (
          <Tag
            key={name}
            className={cn(
              "flex items-center gap-3 group w-full",
              isClickable && "cursor-pointer hover:bg-primary/[0.03] rounded-lg transition-colors text-left"
            )}
            onClick={isClickable ? () => onItemClick(name) : undefined}
          >
            <div className="flex-1 bg-background rounded-full h-7 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${(count / maxValue) * 100}%`,
                  backgroundColor: `${CHART_PALETTE[i % CHART_PALETTE.length]}20`,
                }}
              />
              <span className={cn(
                "relative px-3 text-xs leading-7 truncate block",
                isClickable
                  ? "text-text-primary group-hover:text-primary transition-colors"
                  : "text-text-primary"
              )}>
                {name}
              </span>
            </div>
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary w-8 text-right transition-colors">
              {count}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}
