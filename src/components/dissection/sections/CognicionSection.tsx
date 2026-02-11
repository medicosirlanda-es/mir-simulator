"use client";

import type { DissectionQuestion } from "@/types/dissection";
import { countBy, sortedEntries } from "@/lib/dissection-utils";
import { ChartCard } from "@/components/charts/ChartCard";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { HeatmapTable } from "@/components/charts/HeatmapTable";

interface CognicionSectionProps {
  data: DissectionQuestion[];
  onSpecialtyClick?: (specialty: string) => void;
}

export function CognicionSection({ data, onSpecialtyClick }: CognicionSectionProps) {
  const total = data.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Nivel cognitivo (Bloom)">
          <DoughnutChart
            data={sortedEntries(countBy(data, "cognitiveLevel"))}
            total={total}
          />
        </ChartCard>
        <ChartCard title="Tipo de razonamiento">
          <HorizontalBarChart
            data={sortedEntries(countBy(data, "reasoningType"))}
            total={total}
            height={260}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Tipología MIR">
          <HorizontalBarChart
            data={sortedEntries(countBy(data, "mirTipologia"))}
            total={total}
            height={320}
          />
        </ChartCard>
        <ChartCard title="Nivel cognitivo × Tipo de pregunta">
          <HeatmapTable
            questions={data}
            rowKey="cognitiveLevel"
            colKey="questionType"
          />
        </ChartCard>
      </div>

      <ChartCard title="Especialidad × Razonamiento">
        <HeatmapTable
          questions={data}
          rowKey="specialty"
          colKey="reasoningType"
          onRowClick={onSpecialtyClick}
        />
      </ChartCard>
    </div>
  );
}
