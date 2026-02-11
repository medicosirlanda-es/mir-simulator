import { readFileSync } from "fs";
import { join } from "path";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ExamCard } from "@/components/ExamCard";
import type { ExamManifest } from "@/types/quiz";
import { BookOpen, GraduationCap, Trophy, FileText, Calendar, Microscope } from "lucide-react";
import Link from "next/link";
import { DISSECTION_YEARS } from "@/lib/constants";

function getManifest(): ExamManifest {
  const filePath = join(process.cwd(), "public/data/exams-manifest.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export default function HomePage() {
  const manifest = getManifest();

  const recentExams = manifest.exams.filter((e) =>
    (DISSECTION_YEARS as readonly number[]).includes(e.year)
  ).reverse();

  const olderExams = manifest.exams.filter((e) =>
    !(DISSECTION_YEARS as readonly number[]).includes(e.year)
  ).reverse();

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20 sm:py-28">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-accent-green/[0.06] rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/20 rounded-full blur-3xl" />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <Container className="relative text-center text-text-inverted">
            <div className="mx-auto max-w-3xl">
              <div className="animate-fade-in">
                <GraduationCap className="mx-auto h-14 w-14 mb-6 opacity-90" aria-hidden="true" />
              </div>
              <h1 className="animate-slide-up text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading">
                Simulador MIR
              </h1>
              <p className="animate-slide-up stagger-2 mt-5 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
                Practica con las{" "}
                <strong className="text-white font-bold">{manifest.totalQuestions.toLocaleString("es-ES")}</strong>{" "}
                preguntas oficiales del examen MIR ({manifest.yearRange}).
                Correccion automatica y revision detallada.
              </p>
              <div className="animate-slide-up stagger-3 mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/practicar"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-green px-7 py-3.5 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-accent-green-dark hover:-translate-y-0.5 hover:shadow-lg shadow-md"
                >
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                  Modo practica
                </Link>
                <a
                  href="#examenes"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-7 py-3.5 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-white/20"
                >
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                  Ver examenes
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats */}
        <Container className="-mt-8 relative z-10">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: "Examenes", value: manifest.totalExams, icon: FileText },
              { label: "Preguntas", value: manifest.totalQuestions.toLocaleString("es-ES"), icon: BookOpen },
              { label: "Convocatorias", value: manifest.yearRange, icon: Calendar },
            ].map((stat, i) => (
              <Card key={stat.label} className={`p-4 sm:p-5 text-center animate-scale-in stagger-${i + 1}`}>
                <stat.icon className="mx-auto h-5 w-5 text-primary/60 mb-2" aria-hidden="true" />
                <div className="text-xl sm:text-2xl font-bold font-heading text-primary">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>
        </Container>

        {/* Recent exams — featured */}
        <section id="examenes" className="pt-16 sm:pt-20">
          <Container>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-green mb-3">
                <Microscope className="h-4 w-4" aria-hidden="true" />
                Con diseccion estadistica
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
                Ultimas convocatorias
              </h2>
              <p className="mt-2 text-text-secondary text-sm sm:text-base">
                Examenes con analisis completo: especialidad, codigos SNOMED, ICD-10, ATC
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentExams.map((exam) => (
                <ExamCard key={exam.year} exam={exam} featured />
              ))}
            </div>
          </Container>
        </section>

        {/* Older exams */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
                Archivo historico
              </h2>
              <p className="mt-2 text-text-secondary text-sm sm:text-base">
                {olderExams.length} convocatorias anteriores ({olderExams[olderExams.length - 1]?.year}-{olderExams[0]?.year})
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {olderExams.map((exam) => (
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
