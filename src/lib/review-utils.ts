import type { DissectionQuestion } from "@/types/dissection";
import type { ReviewStatus, TagFilter } from "@/types/review";

// ── Question key ─────────────────────────────────────────────────

export function questionKey(q: DissectionQuestion): string {
  return `${q.year}-Q${q.number}`;
}

export function parseQuestionKey(key: string): { year: number; number: number } | null {
  const match = key.match(/^(\d+)-Q(\d+)$/);
  if (!match) return null;
  return { year: parseInt(match[1], 10), number: parseInt(match[2], 10) };
}

// ── Tag filter field labels ──────────────────────────────────────

export const TAG_FIELD_LABELS: Record<string, string> = {
  year: "Convocatoria",
  specialty: "Especialidad",
  subspecialty: "Subespecialidad",
  topic: "Tema",
  questionType: "Tipo",
  stemStyle: "Formulación",
  cognitiveLevel: "Nivel cognitivo",
  reasoningType: "Razonamiento",
  mirTipologia: "Tipología MIR",
  clinicalTask: "Tarea clínica",
  setting: "Entorno",
  population: "Población",
  imageType: "Tipo imagen",
  icd10: "ICD-10",
  atc: "ATC",
  snomed: "SNOMED",
};

// ── Filtering ────────────────────────────────────────────────────

export interface ReviewFiltersState {
  year: number | null;
  specialty: string;
  status: string; // "" | "approved" | "flagged" | "rejected" | "unreviewed"
  questionType: string;
  cognitiveLevel: string;
  clinicalTask: string;
  population: string;
  setting: string;
  search: string;
  tag: TagFilter | null;
}

export const INITIAL_FILTERS: ReviewFiltersState = {
  year: null,
  specialty: "",
  status: "",
  questionType: "",
  cognitiveLevel: "",
  clinicalTask: "",
  population: "",
  setting: "",
  search: "",
  tag: null,
};

export function filterQuestions(
  questions: DissectionQuestion[],
  filters: ReviewFiltersState,
  getStatus: (year: number, number: number) => ReviewStatus | null
): DissectionQuestion[] {
  let result = questions;

  // Year filter
  if (filters.year !== null) {
    result = result.filter((q) => q.year === filters.year);
  }

  // Specialty filter
  if (filters.specialty) {
    result = result.filter((q) => q.specialty === filters.specialty);
  }

  // Status filter
  if (filters.status) {
    result = result.filter((q) => {
      const s = getStatus(q.year, q.number);
      if (filters.status === "unreviewed") return s === null;
      return s === filters.status;
    });
  }

  // Question type filter
  if (filters.questionType) {
    result = result.filter((q) => q.questionType === filters.questionType);
  }

  // Cognitive level filter
  if (filters.cognitiveLevel) {
    result = result.filter((q) => q.cognitiveLevel === filters.cognitiveLevel);
  }

  // Clinical task filter
  if (filters.clinicalTask) {
    result = result.filter((q) => q.clinicalTask === filters.clinicalTask);
  }

  // Population filter
  if (filters.population) {
    result = result.filter((q) => q.population === filters.population);
  }

  // Setting filter
  if (filters.setting) {
    result = result.filter((q) => q.setting === filters.setting);
  }

  // Tag filter (field + value match)
  if (filters.tag) {
    const { field, value } = filters.tag;
    result = result.filter((q) => {
      if (field === "year") return String(q.year) === value;
      if (field === "icd10") return q.icd10.includes(value);
      if (field === "atc") return q.atc.includes(value);
      if (field === "snomed") {
        return Object.values(q.snomed).some((entries) =>
          entries.some((e: { code: string; display: string }) => e.code === value || e.display === value)
        );
      }
      const fieldValue = q[field as keyof DissectionQuestion];
      return String(fieldValue) === value;
    });
  }

  // Search filter
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (q) =>
        q.text.toLowerCase().includes(term) ||
        q.textSummary.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.specialty.toLowerCase().includes(term)
    );
  }

  return result;
}

// ── Sort ─────────────────────────────────────────────────────────

export function sortQuestions(
  questions: DissectionQuestion[]
): DissectionQuestion[] {
  return [...questions].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.number - b.number;
  });
}

// ── Unique values ────────────────────────────────────────────────

export function uniqueValues<T>(
  items: T[],
  key: keyof T
): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const v = item[key];
    if (v != null && v !== "") set.add(String(v));
  }
  return [...set].sort();
}
