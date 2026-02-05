import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ExamManifestEntry } from "@/types/quiz";
import { FileText, ImageIcon, ChevronRight } from "lucide-react";

export function ExamCard({ exam }: { exam: ExamManifestEntry }) {
  return (
    <Link href={`/examen/${exam.year}`}>
      <Card hover className="p-5 group">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
              MIR {exam.year}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <FileText className="h-4 w-4" />
              <span>{exam.totalQuestions} preguntas</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-primary transition-colors mt-1" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">{exam.numOptions} opciones</Badge>
          {exam.hasImages && (
            <Badge variant="default">
              <ImageIcon className="h-3 w-3" />
              {exam.imageCount} imágenes
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
