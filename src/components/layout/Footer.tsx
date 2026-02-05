import { Container } from "@/components/ui/Container";
import { EXAM_YEAR_START, EXAM_YEAR_END } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 mt-16">
      <Container>
        <p className="text-center text-sm text-text-muted leading-relaxed">
          Preguntas oficiales del Ministerio de Sanidad ({EXAM_YEAR_START}-{EXAM_YEAR_END}).
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Herramienta de estudio sin ánimo de lucro.
        </p>
      </Container>
    </footer>
  );
}
