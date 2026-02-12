"use client";

import type { DissectionQuestion, DissectionFilters } from "@/types/dissection";
import { countBy, sortedEntries, pct, formatLabel } from "@/lib/dissection-utils";
import { StatCard } from "@/components/charts/StatCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { Card } from "@/components/ui/Card";

interface PanoramaSectionProps {
  data: DissectionQuestion[];
  yearLabel: string;
  onNavigateToExplorer: (filters: DissectionFilters) => void;
  onSpecialtyClick?: (specialty: string) => void;
}

export function PanoramaSection({ data, yearLabel, onNavigateToExplorer, onSpecialtyClick }: PanoramaSectionProps) {
  const total = data.length;
  const specCount = new Set(data.map((q) => q.specialty)).size;
  const imgCount = data.filter((q) => q.images.length > 0).length;
  const specEntries = sortedEntries(countBy(data, "specialty"));
  const topSpec = specEntries[0];
  const cogEntries = sortedEntries(countBy(data, "cognitiveLevel"));
  const topCog = cogEntries[0];
  const taskEntries = sortedEntries(countBy(data, "clinicalTask"));
  const topTask = taskEntries[0];

  const casoCount = data.filter((q) => q.questionType === "caso_clinico").length;
  const directaCount = data.filter((q) => q.questionType === "directa").length;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        <StatCard value={total} title="Preguntas" subtitle="Examen completo" color="blue" />
        <StatCard value={specCount} title="Especialidades" subtitle="Áreas médicas" color="green" />
        <StatCard value={imgCount} title="Con imagen" subtitle={`${pct(imgCount, total)}% del examen`} color="orange" />
        <StatCard value={topSpec[0]} title="Top especialidad" subtitle={`${topSpec[1]} preguntas`} color="navy" />
        <StatCard value={formatLabel(topCog[0])} title="Nivel cognitivo" subtitle={`Más frecuente (${topCog[1]})`} color="steel" />
        <StatCard value={formatLabel(topTask[0])} title="Tarea clínica" subtitle={`Más frecuente (${topTask[1]})`} color="red" />
      </div>

      {/* Distribution charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Distribución por especialidad">
            <HorizontalBarChart
              data={specEntries}
              total={total}
              height={Math.max(420, specEntries.length * 22)}
              onBarClick={(key) => onSpecialtyClick ? onSpecialtyClick(key) : onNavigateToExplorer({ specialty: key })}
            />
          </ChartCard>
        </div>
        <div className="space-y-4 md:space-y-6">
          <ChartCard title="Tipo de pregunta">
            <DoughnutChart
              data={sortedEntries(countBy(data, "questionType"))}
              total={total}
            />
          </ChartCard>
          <ChartCard title="Nivel cognitivo">
            <DoughnutChart
              data={cogEntries}
              total={total}
            />
          </ChartCard>
        </div>
      </div>

      {/* Task & stem charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Tarea clínica">
          <HorizontalBarChart data={taskEntries} total={total} height={280} />
        </ChartCard>
        <ChartCard title="Formulación (stem style)">
          <HorizontalBarChart
            data={sortedEntries(countBy(data, "stemStyle"))}
            total={total}
            height={280}
          />
        </ChartCard>
      </div>

      {/* Executive summary */}
      <Card className="p-5">
        <h3 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Resumen ejecutivo
        </h3>
        <p className="text-text-secondary leading-relaxed text-sm">
          El MIR {yearLabel} contiene{" "}
          <strong className="text-text-primary">{total} preguntas</strong> distribuidas en{" "}
          <strong className="text-text-primary">{specCount} especialidades</strong>.{" "}
          <strong className="text-text-primary">{topSpec[0]}</strong> domina con {topSpec[1]} preguntas (
          {pct(topSpec[1], total)}%). El{" "}
          <strong className="text-text-primary">{pct(casoCount, total)}%</strong> son casos clínicos,{" "}
          <strong className="text-text-primary">{pct(directaCount, total)}%</strong> directas, y{" "}
          <strong className="text-text-primary">{pct(imgCount, total)}%</strong> con imagen. El nivel
          cognitivo más frecuente es{" "}
          <strong className="text-text-primary">{formatLabel(topCog[0])}</strong> (
          {pct(topCog[1], total)}%). La tarea clínica más demandada es{" "}
          <strong className="text-text-primary">{formatLabel(topTask[0])}</strong> (
          {pct(topTask[1], total)}%).
        </p>
      </Card>
    </div>
  );
}
