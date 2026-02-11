import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EXAM_YEAR_START, EXAM_YEAR_END } from "@/lib/constants";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <Container className="py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-text-primary mb-3">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Simulador MIR</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Preguntas oficiales del Ministerio de Sanidad ({EXAM_YEAR_START}-{EXAM_YEAR_END}).
              Herramienta de estudio sin animo de lucro.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Herramientas
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                  Examenes oficiales
                </Link>
              </li>
              <li>
                <Link href="/practicar" className="text-text-secondary hover:text-primary transition-colors">
                  Modo practica
                </Link>
              </li>
              <li>
                <Link href="/diseccion/all" className="text-text-secondary hover:text-primary transition-colors">
                  Diseccion estadistica
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Datos
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>23 convocatorias oficiales</li>
              <li>5.267 preguntas disponibles</li>
              <li>Correccion automatica</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-text-muted">
          MIRonline.es &middot; Proyecto de Miguel Casali / CSE
        </div>
      </Container>
    </footer>
  );
}
