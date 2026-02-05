import { ResultsClient } from "./ResultsClient";
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
