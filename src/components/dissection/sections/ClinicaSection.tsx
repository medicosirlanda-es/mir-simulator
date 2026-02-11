"use client";

import type { DissectionQuestion } from "@/types/dissection";
import { countBy, sortedEntries } from "@/lib/dissection-utils";
import { ChartCard } from "@/components/charts/ChartCard";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { HeatmapTable } from "@/components/charts/HeatmapTable";

interface ClinicaSectionProps {
  data: DissectionQuestion[];
  onSpecialtyClick?: (specialty: string) => void;
}

export function ClinicaSection({ data, onSpecialtyClick }: ClinicaSectionProps) {
  const total = data.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <ChartCard title="Tarea clínica">
          <HorizontalBarChart
            data={sortedEntries(countBy(data, "clinicalTask"))}
            total={total}
            height={320}
          />
        </ChartCard>
        <ChartCard title="Entorno clínico">
          <DoughnutChart
            data={sortedEntries(countBy(data, "setting"))}
            total={total}
          />
        </ChartCard>
        <ChartCard title="Población">
          <DoughnutChart
            data={sortedEntries(countBy(data, "population"))}
            total={total}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Especialidad × Tarea clínica">
          <HeatmapTable
            questions={data}
            rowKey="specialty"
            colKey="clinicalTask"
            onRowClick={onSpecialtyClick}
          />
        </ChartCard>
        <ChartCard title="Especialidad × Entorno">
          <HeatmapTable
            questions={data}
            rowKey="specialty"
            colKey="setting"
            onRowClick={onSpecialtyClick}
          />
        </ChartCard>
      </div>
    </div>
  );
}
