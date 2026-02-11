import type {
  DissectionQuestion,
  DissectionFilters,
  DissectionFilterKey,
  SnomedEntry,
} from "@/types/dissection";

// ── Label map ────────────────────────────────────────────────────

export const LABELS: Record<string, string> = {
  caso_clinico: "Caso clínico",
  directa: "Directa",
  imagen: "Imagen",
  mas_probable: "Más probable",
  de_eleccion: "De elección",
  falso_incorrecto: "Falso/Incorrecto",
  excepto: "EXCEPTO",
  siguiente_paso: "Siguiente paso",
  contraindicado: "Contraindicado",
  recuerdo: "Recuerdo",
  comprension: "Comprensión",
  aplicacion: "Aplicación",
  analisis: "Análisis",
  pattern_recognition: "Reconocimiento de patrón",
  algoritmo: "Algoritmo",
  regla_criterio: "Regla/Criterio",
  integracion_multidisciplinar: "Integración multidisciplinar",
  urgencias: "Urgencias",
  consulta_especializada: "Consulta especializada",
  consulta_ap: "Atención Primaria",
  hospital: "Hospital",
  sin_contexto: "Sin contexto",
  domicilio: "Domicilio",
  adulto: "Adulto",
  anciano: "Anciano (>65a)",
  pediatrico: "Pediátrico",
  neonato: "Neonato",
  gestante: "Gestante",
  diagnostico: "Diagnóstico",
  tratamiento: "Tratamiento",
  fisiopatologia: "Fisiopatología",
  manejo_inicial: "Manejo inicial",
  prevencion: "Prevención",
  estratificacion_riesgo: "Estratificación riesgo",
  prueba_diagnostica: "Prueba diagnóstica",
  decisiones_eticas: "Decisiones éticas",
  certificacion_legal: "Certificación legal",
  diagnostico_molecular: "Dx molecular",
  dx_directo: "Dx directo",
  tx_eleccion: "Tx elección",
  concepto_basico: "Concepto básico",
  clasificacion: "Clasificación",
  protocolo_guia: "Protocolo/guía",
  contraindicacion: "Contraindicación",
  prevencion_mir: "Prevención",
  urgencia: "Urgencia vital",
  genealogico: "Árbol genealógico",
  oftalmologica: "Oftalmológica",
  endoscopia_orl: "Endoscopia ORL",
  rm: "RM",
  tac: "TAC",
  rx: "Rx",
  fotografia_clinica: "Fotografía clínica",
  ecg: "ECG",
  anatomia_patologica: "Anatomía patológica",
  dermatologica: "Dermatológica",
  grafico: "Gráfico/tabla",
};

// ── Chart palette (light theme) ─────────────────────────────────

export const CHART_PALETTE = [
  "#3159a7", "#169B62", "#FF883E", "#8b5cf6",
  "#ef4444", "#06b6d4", "#ec4899", "#f59e0b",
  "#84cc16", "#6366f1", "#14b8a6", "#e11d48",
  "#a855f7", "#eab308", "#22d3ee", "#fb923c",
  "#4ade80", "#f472b6", "#818cf8", "#fbbf24",
  "#2dd4bf", "#c084fc", "#facc15", "#38bdf8",
];

// ── Utilities ────────────────────────────────────────────────────

export function formatLabel(value: string | null | undefined): string {
  if (!value) return "—";
  if (LABELS[value]) return LABELS[value];
  // Capitalize first letter of each space-separated word (Unicode-safe — \b\w breaks on accented chars)
  return value
    .replace(/_/g, " ")
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export function countBy<T>(items: T[], key: keyof T): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of items) {
    const v = (item[key] as string) || "(sin dato)";
    map[v] = (map[v] || 0) + 1;
  }
  return map;
}

export function sortedEntries(
  counts: Record<string, number>,
  dir: "asc" | "desc" = "desc"
): [string, number][] {
  return Object.entries(counts).sort((a, b) =>
    dir === "desc" ? b[1] - a[1] : a[1] - b[1]
  );
}

export function pct(n: number, total: number): string {
  return ((n / total) * 100).toFixed(1);
}

export function topSnomedByRole(
  questions: DissectionQuestion[],
  role: keyof DissectionQuestion["snomed"],
  n = 15
): [string, number][] {
  const counts: Record<string, number> = {};
  for (const q of questions) {
    const entries = q.snomed?.[role] as SnomedEntry[] | undefined;
    if (!entries) continue;
    for (const entry of entries) {
      const key = entry.display || entry.code;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return sortedEntries(counts).slice(0, n);
}

/**
 * Cross-tabulate two categorical fields into a matrix.
 * Returns { rows, cols, matrix, max } where matrix[row][col] = count.
 */
export function crossTabulate(
  questions: DissectionQuestion[],
  rowKey: keyof DissectionQuestion,
  colKey: keyof DissectionQuestion
): {
  rows: string[];
  cols: string[];
  matrix: Record<string, Record<string, number>>;
  max: number;
} {
  const rowSet = new Set<string>();
  const colSet = new Set<string>();

  for (const q of questions) {
    const r = q[rowKey] as string;
    const c = q[colKey] as string;
    if (r) rowSet.add(r);
    if (c) colSet.add(c);
  }

  const rows = [...rowSet];
  const cols = [...colSet];
  const matrix: Record<string, Record<string, number>> = {};
  let max = 0;

  for (const r of rows) {
    matrix[r] = {};
    for (const c of cols) matrix[r][c] = 0;
  }

  for (const q of questions) {
    const r = q[rowKey] as string;
    const c = q[colKey] as string;
    if (r && c && matrix[r]) {
      matrix[r][c]++;
      max = Math.max(max, matrix[r][c]);
    }
  }

  // Sort rows by total count (descending)
  const rowTotals = rows.map((r) => ({
    row: r,
    total: cols.reduce((s, c) => s + (matrix[r][c] || 0), 0),
  }));
  rowTotals.sort((a, b) => b.total - a.total);

  return {
    rows: rowTotals.map((rt) => rt.row),
    cols,
    matrix,
    max,
  };
}

// ── Filter key to question field mapping ────────────────────────

const FILTER_KEY_MAP: Record<DissectionFilterKey, keyof DissectionQuestion> = {
  specialty: "specialty",
  questionType: "questionType",
  cognitiveLevel: "cognitiveLevel",
  clinicalTask: "clinicalTask",
  setting: "setting",
  stemStyle: "stemStyle",
  reasoningType: "reasoningType",
  population: "population",
};

export function filterQuestions(
  questions: DissectionQuestion[],
  filters: DissectionFilters
): DissectionQuestion[] {
  let result = questions;

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;

    if (key === "search") {
      const q = value.toLowerCase();
      result = result.filter(
        (item) =>
          item.text.toLowerCase().includes(q) ||
          item.textSummary.toLowerCase().includes(q) ||
          item.topic.toLowerCase().includes(q)
      );
    } else {
      const field = FILTER_KEY_MAP[key as DissectionFilterKey];
      if (field) {
        result = result.filter((item) => (item[field] as string) === value);
      }
    }
  }

  return result;
}

// ── Filter field definitions for explorer UI ────────────────────

export const FILTER_FIELDS: { key: DissectionFilterKey; label: string }[] = [
  { key: "specialty", label: "Especialidad" },
  { key: "questionType", label: "Tipo" },
  { key: "cognitiveLevel", label: "Nivel cognitivo" },
  { key: "clinicalTask", label: "Tarea clínica" },
  { key: "setting", label: "Entorno" },
  { key: "stemStyle", label: "Formulación" },
  { key: "reasoningType", label: "Razonamiento" },
  { key: "population", label: "Población" },
];

// ── Stat card color config ──────────────────────────────────────

export type StatColor = "blue" | "green" | "orange" | "violet" | "red" | "cyan";

export const STAT_COLORS: Record<StatColor, { bg: string; text: string }> = {
  blue: { bg: "bg-primary/10", text: "text-primary" },
  green: { bg: "bg-accent-green/10", text: "text-accent-green" },
  orange: { bg: "bg-accent-orange/10", text: "text-accent-orange" },
  violet: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]" },
  red: { bg: "bg-error/10", text: "text-error" },
  cyan: { bg: "bg-[#06b6d4]/10", text: "text-[#06b6d4]" },
};

// ── SNOMED role labels ──────────────────────────────────────────

export const SNOMED_ROLE_LABELS: Record<string, string> = {
  clinicalFocus: "Foco clínico",
  context: "Contexto",
  findings: "Hallazgos",
  procedures: "Procedimientos",
  pharmaceuticals: "Fármacos",
  anatomy: "Anatomía",
};
