import { ResultsClient } from "./ResultsClient";
import { EXAM_YEARS } from "@/lib/constants";
import type { Metadata } from "next";

export function generateStaticParams() {
  return EXAM_YEARS.map((year) => ({ year: String(year) }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  return params.then(({ year }) => ({
    title: `Resultados MIR ${year}`,
    description: `Resultados del simulacro MIR ${year}`,
  }));
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <ResultsClient year={parseInt(year, 10)} />;
}
