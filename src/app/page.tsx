import { readFileSync } from "fs";
import { join } from "path";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ExamCard } from "@/components/ExamCard";
import type { ExamManifest } from "@/types/quiz";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function getManifest(): ExamManifest {
  const filePath = join(process.cwd(), "public/data/exams-manifest.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export default function HomePage() {
  const manifest = getManifest();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary py-16 sm:py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-green rounded-full blur-3xl" />
          </div>
          <Container className="relative text-center text-text-inverted">
            <div className="mx-auto max-w-3xl">
              <GraduationCap className="mx-auto h-16 w-16 mb-6 opacity-90" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Simulador MIR
              </h1>
              <p className="mt-4 text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
                Practica con las{" "}
                <strong>{manifest.totalQuestions.toLocaleString("es-ES")}</strong>{" "}
                preguntas oficiales del examen MIR ({manifest.yearRange}).
                Corrección automática y revisión detallada.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/practicar">
                  <Button className="bg-accent-green hover:bg-accent-green-dark text-white gap-2">
                    <Trophy className="h-5 w-5" />
                    Modo práctica
                  </Button>
                </Link>
                <a href="#examenes">
                  <Button variant="secondary" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2">
                    <BookOpen className="h-5 w-5" />
                    Ver exámenes
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats */}
        <Container className="-mt-8 relative z-10">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Exámenes", value: manifest.totalExams },
              { label: "Preguntas", value: manifest.totalQuestions.toLocaleString("es-ES") },
              { label: "Años", value: manifest.yearRange },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface rounded-2xl border border-border shadow-sm p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>

        {/* Exam grid */}
        <section id="examenes" className="py-16">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-10">
              Elige tu examen
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {manifest.exams
                .slice()
                .reverse()
                .map((exam) => (
                  <ExamCard key={exam.year} exam={exam} />
                ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
