import { DissectionClient } from "./DissectionClient";
import { DISSECTION_YEAR_PARAMS } from "@/lib/constants";
import type { Metadata } from "next";

export function generateStaticParams() {
  return DISSECTION_YEAR_PARAMS.map((year) => ({ year }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  return params.then(({ year }) => {
    const label = year === "all" ? "2020–2024" : year;
    return {
      title: `Disección MIR ${label}`,
      description: `Análisis estadístico completo del examen MIR ${label}: distribución por especialidad, tipo de pregunta, nivel cognitivo, codificación SNOMED-CT, ICD-10, ATC.`,
    };
  });
}

export default async function DissectionPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <DissectionClient yearParam={year} />;
}
