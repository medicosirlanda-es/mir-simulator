import { readFileSync } from "fs";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ExamCard } from "@/components/ExamCard";
import type { ExamManifest } from "@/types/quiz";
import { BookOpen, Trophy, FileText, Calendar, Microscope, ArrowRight, Sparkles } from "lucide-react";
import { DISSECTION_YEARS } from "@/lib/constants";
import { HeroAnimations } from "@/components/HeroAnimations";

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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2a4a] via-primary-dark to-primary py-16 sm:py-24 lg:py-28">
          {/* Animated ECG background — client component */}
          <HeroAnimations />

          <Container className="relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: Logo + copy */}
              <div className="flex-1 text-center lg:text-left">
                <div className="animate-fade-in">
                  <Image
                    src="/images/logo-horizontal-white.png"
                    alt="MIR Online"
                    width={320}
                    height={110}
                    className="h-16 sm:h-20 lg:h-24 w-auto mx-auto lg:mx-0"
                    priority
                  />
                </div>
                <p className="animate-slide-up stagger-1 mt-6 text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Practica con las{" "}
                  <strong className="text-white font-bold">{manifest.totalQuestions.toLocaleString("es-ES")}</strong>{" "}
                  preguntas oficiales del examen MIR ({manifest.yearRange}).
                </p>
                <p className="animate-slide-up stagger-2 mt-2 text-base text-white/60 max-w-xl mx-auto lg:mx-0">
                  Correccion automatica, diseccion estadistica y revision detallada.
                </p>
                <div className="animate-slide-up stagger-3 mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    href="/practicar"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-green px-7 py-3.5 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-accent-green-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-green/25 shadow-md cursor-pointer"
                  >
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                    Modo practica
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <a
                    href="#examenes"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-7 py-3.5 font-semibold text-white transition-all duration-200 min-h-[44px] hover:bg-white/20 cursor-pointer"
                  >
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                    Ver examenes
                  </a>
                </div>
              </div>

              {/* Right: Floating stat cards */}
              <div className="animate-slide-up stagger-2 hidden lg:flex flex-col gap-4 w-80">
                {[
                  { label: "Examenes oficiales", value: String(manifest.totalExams), icon: FileText, accent: "bg-accent-orange/20 text-accent-orange" },
                  { label: "Preguntas disponibles", value: manifest.totalQuestions.toLocaleString("es-ES"), icon: Sparkles, accent: "bg-accent-green/20 text-accent-green" },
                  { label: "Convocatorias", value: manifest.yearRange, icon: Calendar, accent: "bg-primary-light/20 text-primary-light" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-4 rounded-2xl bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] px-6 py-5 shadow-lg shadow-black/10 stagger-${i + 1} animate-scale-in hover:bg-white/[0.18] transition-colors duration-300`}
                  >
                    <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${stat.accent}`}>
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-heading text-white tracking-tight">{stat.value}</div>
                      <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile stats row */}
            <div className="lg:hidden mt-10 grid grid-cols-3 gap-3 animate-scale-in stagger-3">
              {[
                { label: "Examenes", value: String(manifest.totalExams) },
                { label: "Preguntas", value: manifest.totalQuestions.toLocaleString("es-ES") },
                { label: "Convocatorias", value: manifest.yearRange },
              ].map((stat) => (
                <div key={stat.label} className="text-center rounded-xl bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] shadow-lg shadow-black/10 py-3.5 px-2">
                  <div className="text-lg font-bold font-heading text-white">{stat.value}</div>
                  <div className="text-[11px] text-white/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
            <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0 56h1440V28c-240-28-480-28-720 0S240 56 0 28v28z" fill="var(--color-background)" />
            </svg>
          </div>
        </section>

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
