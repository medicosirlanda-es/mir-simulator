// ── Categorical union types ──────────────────────────────────────

export type QuestionSource = "mir_oficial" | "ai_generated" | "expert_original" | "adaptada";

export type QuestionType = "caso_clinico" | "directa" | "imagen";

export type StemStyle =
  | "mas_probable"
  | "de_eleccion"
  | "falso_incorrecto"
  | "excepto"
  | "siguiente_paso"
  | "contraindicado";

export type ImageType =
  | "genealogico"
  | "oftalmologica"
  | "endoscopia_orl"
  | "rm"
  | "tac"
  | "rx"
  | "fotografia_clinica"
  | "ecg"
  | "anatomia_patologica"
  | "dermatologica"
  | "grafico";

export type ClinicalSetting =
  | "urgencias"
  | "consulta_especializada"
  | "consulta_ap"
  | "hospital"
  | "sin_contexto"
  | "domicilio";

export type Population =
  | "adulto"
  | "anciano"
  | "pediatrico"
  | "neonato"
  | "gestante";

export type ClinicalTask =
  | "diagnostico"
  | "tratamiento"
  | "fisiopatologia"
  | "manejo_inicial"
  | "prevencion"
  | "estratificacion_riesgo"
  | "prueba_diagnostica"
  | "decisiones_eticas"
  | "certificacion_legal"
  | "diagnostico_molecular";

export type CognitiveLevel =
  | "recuerdo"
  | "comprension"
  | "aplicacion"
  | "analisis";

export type ReasoningType =
  | "pattern_recognition"
  | "algoritmo"
  | "regla_criterio"
  | "integracion_multidisciplinar";

export type MirTipologia =
  | "dx_directo"
  | "tx_eleccion"
  | "concepto_basico"
  | "clasificacion"
  | "protocolo_guia"
  | "contraindicacion"
  | "prevencion_mir"
  | "urgencia";

// ── SNOMED ──────────────────────────────────────────────────────

export interface SnomedEntry {
  code: string;
  display: string;
  atc?: string;
}

export interface SnomedCodes {
  clinicalFocus: SnomedEntry[];
  context: SnomedEntry[];
  findings: SnomedEntry[];
  procedures: SnomedEntry[];
  pharmaceuticals: SnomedEntry[];
  anatomy: SnomedEntry[];
}

// ── Answer ──────────────────────────────────────────────────────

export interface DissectionAnswer {
  order: number;
  text: string;
  isCorrect: boolean;
  distractorAnalysis: string | null;
}

// ── Question ────────────────────────────────────────────────────

export interface DissectionQuestion {
  year: number;
  number: number;
  source: QuestionSource;
  text: string;
  textHtml: string;
  textSummary: string;
  images: string[];
  answers: DissectionAnswer[];
  correctAnswerIndex: number;
  explanation: string | null;
  specialty: string;
  subspecialty: string;
  topic: string;
  questionType: QuestionType;
  stemStyle: StemStyle;
  imageType: ImageType | null;
  setting: ClinicalSetting;
  population: Population;
  clinicalTask: ClinicalTask;
  cognitiveLevel: CognitiveLevel;
  reasoningType: ReasoningType;
  mirTipologia: MirTipologia;
  snomed: SnomedCodes;
  icd10: string[];
  atc: string[];
  validatedBy: string | null;
  validatedAt: string | null;
  isActive: boolean;
}

// ── Manifest ────────────────────────────────────────────────────

export interface DissectionManifestEntry {
  year: number;
  totalQuestions: number;
  specialtyCount: number;
  imageCount: number;
}

export interface DissectionManifest {
  years: number[];
  exams: DissectionManifestEntry[];
}

// ── Filter state for explorer ───────────────────────────────────

export type DissectionFilterKey =
  | "specialty"
  | "questionType"
  | "cognitiveLevel"
  | "clinicalTask"
  | "setting"
  | "stemStyle"
  | "reasoningType"
  | "population";

export type DissectionFilters = Partial<Record<DissectionFilterKey | "search", string>>;

// ── Tab identifiers ─────────────────────────────────────────────

export type DissectionTab =
  | "panorama"
  | "especialidades"
  | "forma"
  | "cognicion"
  | "clinica"
  | "codigos"
  | "explorador";
