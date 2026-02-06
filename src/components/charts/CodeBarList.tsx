"use client";

import { CHART_PALETTE } from "@/lib/dissection-utils";

interface CodeBarListProps {
  data: [string, number][];
}

export function CodeBarList({ data }: CodeBarListProps) {
  if (data.length === 0) {
    return <p className="text-text-muted text-sm">Sin datos</p>;
  }

  const maxValue = data[0][1];

  return (
    <div className="space-y-1.5">
      {data.map(([name, count], i) => (
        <div key={name} className="flex items-center gap-3 group">
          <div className="flex-1 bg-background rounded-full h-7 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${(count / maxValue) * 100}%`,
                backgroundColor: `${CHART_PALETTE[i % CHART_PALETTE.length]}20`,
              }}
            />
            <span className="relative px-3 text-xs text-text-primary leading-7 truncate block">
              {name}
            </span>
          </div>
          <span className="text-xs font-mono text-text-muted group-hover:text-text-primary w-8 text-right transition-colors">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
