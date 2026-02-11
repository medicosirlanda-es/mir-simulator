import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DissectionHeaderProps {
  yearLabel: string;
  totalQuestions: number;
  specialtyCount: number;
}

export function DissectionHeader({
  yearLabel,
  totalQuestions,
  specialtyCount,
}: DissectionHeaderProps) {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-text-primary font-medium">Disección {yearLabel}</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
        Disección MIR {yearLabel}
      </h1>
      <p className="text-sm text-text-secondary mt-1">
        {totalQuestions} preguntas · {specialtyCount} especialidades · Análisis completo
      </p>
    </div>
  );
}
