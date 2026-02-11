"use client";

import type { DissectionQuestion } from "@/types/dissection";
import { topSnomedByRole, sortedEntries } from "@/lib/dissection-utils";
import { ChartCard } from "@/components/charts/ChartCard";
import { CodeBarList } from "@/components/charts/CodeBarList";

interface CodigosSectionProps {
  data: DissectionQuestion[];
  onSnomedClick?: (display: string) => void;
  onIcd10Click?: (code: string) => void;
  onAtcClick?: (label: string) => void;
}

export function CodigosSection({ data, onSnomedClick, onIcd10Click, onAtcClick }: CodigosSectionProps) {
  // ICD-10 aggregation
  const icd10Counts: Record<string, number> = {};
  for (const q of data) {
    for (const c of q.icd10 || []) {
      icd10Counts[c] = (icd10Counts[c] || 0) + 1;
    }
  }
  const topIcd = sortedEntries(icd10Counts).slice(0, 15);

  // ATC aggregation (from both atc field and snomed pharmaceuticals)
  const atcCounts: Record<string, number> = {};
  for (const q of data) {
    for (const c of q.atc || []) {
      atcCounts[c] = (atcCounts[c] || 0) + 1;
    }
    if (q.snomed?.pharmaceuticals) {
      for (const p of q.snomed.pharmaceuticals) {
        if (p.atc) {
          const key = `${p.atc} — ${p.display}`;
          atcCounts[key] = (atcCounts[key] || 0) + 1;
        }
      }
    }
  }
  const topAtc = sortedEntries(atcCounts).slice(0, 15);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="SNOMED-CT — Foco clínico (top 15)">
          <CodeBarList data={topSnomedByRole(data, "clinicalFocus")} onItemClick={onSnomedClick} />
        </ChartCard>
        <ChartCard title="SNOMED-CT — Hallazgos (top 15)">
          <CodeBarList data={topSnomedByRole(data, "findings")} onItemClick={onSnomedClick} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="SNOMED-CT — Procedimientos (top 15)">
          <CodeBarList data={topSnomedByRole(data, "procedures")} onItemClick={onSnomedClick} />
        </ChartCard>
        <ChartCard title="SNOMED-CT — Fármacos (top 15)">
          <CodeBarList data={topSnomedByRole(data, "pharmaceuticals")} onItemClick={onSnomedClick} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="SNOMED-CT — Anatomía (top 15)">
          <CodeBarList data={topSnomedByRole(data, "anatomy")} onItemClick={onSnomedClick} />
        </ChartCard>
        <ChartCard title="ICD-10 (top 15)">
          <CodeBarList data={topIcd} onItemClick={onIcd10Click} />
        </ChartCard>
      </div>

      <ChartCard title="ATC — Fármacos (top 15)">
        <CodeBarList data={topAtc} onItemClick={onAtcClick} />
      </ChartCard>
    </div>
  );
}
