import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <Container>
        <p className="text-center text-sm text-text-muted">
          Preguntas oficiales del Ministerio de Sanidad (2003-2024).
          Herramienta de estudio sin ánimo de lucro.
        </p>
      </Container>
    </footer>
  );
}
