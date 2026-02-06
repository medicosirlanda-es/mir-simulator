import { DissectionClient } from "./DissectionClient";
import { DISSECTION_YEARS } from "@/lib/constants";
import type { Metadata } from "next";

export function generateStaticParams() {
  return DISSECTION_YEARS.map((year) => ({ year: String(year) }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  return params.then(({ year }) => ({
    title: `Disección MIR ${year}`,
    description: `Análisis estadístico completo del examen MIR ${year}: distribución por especialidad, tipo de pregunta, nivel cognitivo, codificación SNOMED-CT, ICD-10, ATC.`,
  }));
}

export default async function DissectionPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <DissectionClient year={parseInt(year, 10)} />;
}
