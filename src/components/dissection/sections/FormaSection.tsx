"use client";

import { useState } from "react";
import type { DissectionQuestion } from "@/types/dissection";
import { countBy, sortedEntries, formatLabel } from "@/lib/dissection-utils";
import { ChartCard } from "@/components/charts/ChartCard";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { HeatmapTable } from "@/components/charts/HeatmapTable";
import { Card } from "@/components/ui/Card";
import { QuestionDetailModal } from "@/components/dissection/QuestionDetailModal";

interface FormaSectionProps {
  data: DissectionQuestion[];
}

export function FormaSection({ data }: FormaSectionProps) {
  const total = data.length;
  const imageQs = data.filter((q) => q.images.length > 0);
  const [selectedQuestion, setSelectedQuestion] = useState<DissectionQuestion | null>(null);

  const navigateQuestion = (direction: "prev" | "next") => {
    if (!selectedQuestion) return;
    const idx = imageQs.findIndex((q) => q.number === selectedQuestion.number);
    const newIdx =
      direction === "prev"
        ? (idx - 1 + imageQs.length) % imageQs.length
        : (idx + 1) % imageQs.length;
    setSelectedQuestion(imageQs[newIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Type & stem charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Tipo de pregunta">
          <DoughnutChart
            data={sortedEntries(countBy(data, "questionType"))}
            total={total}
          />
        </ChartCard>
        <ChartCard title="Formulación del stem">
          <HorizontalBarChart
            data={sortedEntries(countBy(data, "stemStyle"))}
            total={total}
            height={260}
          />
        </ChartCard>
      </div>

      {/* Image type & heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title={`Tipo de imagen (n=${imageQs.length})`}>
          <HorizontalBarChart
            data={sortedEntries(countBy(imageQs, "imageType"))}
            total={imageQs.length}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Tipo × Formulación">
          <HeatmapTable
            questions={data}
            rowKey="questionType"
            colKey="stemStyle"
          />
        </ChartCard>
      </div>

      {/* Image questions gallery */}
      <Card className="p-5">
        <h3 className="text-xs md:text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Preguntas con imagen
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {imageQs.map((q) => (
            <button
              key={q.number}
              onClick={() => setSelectedQuestion(q)}
              className="text-left bg-background border border-border rounded-lg p-3 transition-all duration-150 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-primary">Q{q.number}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange-dark">
                  {formatLabel(q.imageType)}
                </span>
              </div>
              <p className="text-xs text-text-secondary line-clamp-2">{q.textSummary}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Modal */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onPrevious={() => navigateQuestion("prev")}
          onNext={() => navigateQuestion("next")}
        />
      )}
    </div>
  );
}
