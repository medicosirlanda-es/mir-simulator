import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ExamManifestEntry } from "@/types/quiz";
import { FileText, ImageIcon, ChevronRight, Microscope } from "lucide-react";
import { DISSECTION_YEARS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ExamCard({ exam, featured }: { exam: ExamManifestEntry; featured?: boolean }) {
  const hasDissection = (DISSECTION_YEARS as readonly number[]).includes(exam.year);

  return (
    <Link href={`/examen/${exam.year}`}>
      <Card hover className={cn("p-5 group relative overflow-hidden", featured && "border-primary/20 ring-1 ring-primary/10")}>
        <div
          className={cn(
            "absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] transition-colors",
            featured ? "bg-primary/[0.06] group-hover:bg-primary/[0.10]" : "bg-primary/[0.03] group-hover:bg-primary/[0.06]"
          )}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Convocatoria</div>
              <h3 className="text-2xl font-bold font-heading text-text-primary group-hover:text-primary transition-colors mt-0.5">
                {exam.year}
              </h3>
            </div>
            <ChevronRight className="h-5 w-5 text-border group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" aria-hidden="true" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{exam.totalQuestions} preguntas</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="primary">{exam.numOptions} opciones</Badge>
            {exam.hasImages && (
              <Badge variant="default">
                <ImageIcon className="h-3 w-3" aria-hidden="true" />
                {exam.imageCount} img
              </Badge>
            )}
            {hasDissection && (
              <Badge variant="success">
                <Microscope className="h-3 w-3" aria-hidden="true" />
                Diseccion
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
