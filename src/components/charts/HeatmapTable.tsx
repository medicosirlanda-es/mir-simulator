"use client";

import { formatLabel } from "@/lib/dissection-utils";
import type { DissectionQuestion } from "@/types/dissection";
import { crossTabulate } from "@/lib/dissection-utils";

interface HeatmapTableProps {
  questions: DissectionQuestion[];
  rowKey: keyof DissectionQuestion;
  colKey: keyof DissectionQuestion;
}

export function HeatmapTable({ questions, rowKey, colKey }: HeatmapTableProps) {
  const { rows, cols, matrix, max } = crossTabulate(questions, rowKey, colKey);

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left p-2 text-text-muted font-medium" />
            {cols.map((c) => (
              <th key={c} className="p-2 text-text-muted font-medium text-center">
                {formatLabel(c)}
              </th>
            ))}
            <th className="p-2 text-text-muted font-medium text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const total = cols.reduce((s, c) => s + (matrix[r][c] || 0), 0);
            return (
              <tr
                key={r}
                className="border-t border-border/50 hover:bg-primary/[0.03] transition-colors duration-150"
              >
                <td className="p-2 text-text-primary font-medium whitespace-nowrap">
                  {formatLabel(r)}
                </td>
                {cols.map((c) => {
                  const v = matrix[r][c] || 0;
                  const intensity = max > 0 ? v / max : 0;
                  return (
                    <td
                      key={c}
                      className="p-2 text-center font-mono rounded-sm"
                      style={{
                        backgroundColor:
                          v > 0
                            ? `rgba(49,89,167,${0.06 + intensity * 0.3})`
                            : "transparent",
                      }}
                    >
                      {v > 0 ? (
                        v
                      ) : (
                        <span className="text-border">·</span>
                      )}
                    </td>
                  );
                })}
                <td className="p-2 text-center text-text-muted font-semibold">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
