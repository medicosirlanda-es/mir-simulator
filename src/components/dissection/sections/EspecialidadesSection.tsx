"use client";

import { useState, Fragment } from "react";
import type { DissectionQuestion, DissectionFilters } from "@/types/dissection";
import { countBy, sortedEntries, pct, formatLabel, CHART_PALETTE } from "@/lib/dissection-utils";
import { ChartCard } from "@/components/charts/ChartCard";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { HeatmapTable } from "@/components/charts/HeatmapTable";
import { Card } from "@/components/ui/Card";
import { ChevronDown, ChevronRight } from "lucide-react";

interface EspecialidadesSectionProps {
  data: DissectionQuestion[];
  onNavigateToExplorer: (filters: DissectionFilters) => void;
  onSpecialtyClick?: (specialty: string) => void;
}

export function EspecialidadesSection({ data, onNavigateToExplorer, onSpecialtyClick }: EspecialidadesSectionProps) {
  const total = data.length;
  const specEntries = sortedEntries(countBy(data, "specialty"));
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Chart + heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6">
        <div className="xl:col-span-3">
          <ChartCard title="Preguntas por especialidad">
            <HorizontalBarChart
              data={specEntries}
              total={total}
              height={Math.max(450, specEntries.length * 22)}
              onBarClick={(key) => onSpecialtyClick ? onSpecialtyClick(key) : onNavigateToExplorer({ specialty: key })}
            />
          </ChartCard>
        </div>
        <div className="xl:col-span-2">
          <ChartCard title="Especialidad × Nivel cognitivo">
            <HeatmapTable
              questions={data}
              rowKey="specialty"
              colKey="cognitiveLevel"
              onRowClick={onSpecialtyClick}
            />
          </ChartCard>
        </div>
      </div>

      {/* Detail table */}
      <Card className="p-5">
        <h3 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Detalle por especialidad
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase">
                <th className="text-left p-3">Especialidad</th>
                <th className="p-3 text-center">N</th>
                <th className="p-3 text-center">%</th>
                <th className="text-left p-3">Tipos</th>
                <th className="text-left p-3">Subespecialidades</th>
                <th className="p-3 text-center">Temas</th>
              </tr>
            </thead>
            <tbody>
              {specEntries.map(([spec, count], i) => {
                const qs = data.filter((q) => q.specialty === spec);
                const subs = [...new Set(qs.map((q) => q.subspecialty).filter(Boolean))];
                const topics = [...new Set(qs.map((q) => q.topic).filter(Boolean))];
                const typeDist = countBy(qs, "questionType");
                const isExpanded = expandedSpec === spec;

                return (
                  <Fragment key={spec}>
                    <tr
                      onClick={() => setExpandedSpec(isExpanded ? null : spec)}
                      className="border-t border-border/50 hover:bg-primary/[0.03] transition-colors duration-150 cursor-pointer"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }}
                          />
                          <span className="font-medium text-text-primary">{spec}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono text-text-primary">{count}</td>
                      <td className="p-3 text-center text-text-muted">{pct(count, total)}%</td>
                      <td className="p-3 text-xs text-text-muted">
                        {Object.entries(typeDist)
                          .map(([k, v]) => `${formatLabel(k)} (${v})`)
                          .join(", ")}
                      </td>
                      <td className="p-3 text-xs text-text-muted max-w-[200px] truncate">
                        {subs.slice(0, 3).join("; ")}
                        {subs.length > 3 ? " ..." : ""}
                      </td>
                      <td className="p-3 text-center text-text-muted">{topics.length}</td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <div className="px-6 pb-4 bg-background/50 border-t border-border/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                              <div>
                                <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                                  Subespecialidades
                                </h4>
                                <ul className="space-y-1">
                                  {subs.map((sub) => {
                                    const subCount = qs.filter(
                                      (q) => q.subspecialty === sub
                                    ).length;
                                    return (
                                      <li
                                        key={sub}
                                        className="text-xs text-text-secondary flex justify-between"
                                      >
                                        <span>{sub}</span>
                                        <span className="text-text-muted font-mono">
                                          {subCount}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                                  Temas
                                </h4>
                                <ul className="space-y-1">
                                  {topics.map((topic) => {
                                    const topicCount = qs.filter(
                                      (q) => q.topic === topic
                                    ).length;
                                    return (
                                      <li
                                        key={topic}
                                        className="text-xs text-text-secondary flex justify-between"
                                      >
                                        <span className="truncate mr-2">{topic}</span>
                                        <span className="text-text-muted font-mono shrink-0">
                                          {topicCount}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToExplorer({ specialty: spec });
                              }}
                              className="mt-3 text-xs text-primary hover:text-primary-dark transition-colors"
                            >
                              Ver preguntas de {spec} →
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
