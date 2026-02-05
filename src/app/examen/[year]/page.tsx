import { ExamClient } from "./ExamClient";
import type { Metadata } from "next";

const YEARS = Array.from({ length: 22 }, (_, i) => 2003 + i);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  return params.then(({ year }) => ({
    title: `Examen MIR ${year}`,
    description: `Simulacro del examen MIR oficial del año ${year}. Practica con las preguntas reales.`,
  }));
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <ExamClient year={parseInt(year, 10)} />;
}
