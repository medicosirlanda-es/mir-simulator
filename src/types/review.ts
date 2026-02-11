// ── Review validation state (persisted in localStorage) ─────────

export type ReviewStatus = "approved" | "flagged" | "rejected";

export interface ReviewEntry {
  status: ReviewStatus;
  notes: string;
  updatedAt: string; // ISO date
}

export interface ReviewState {
  version: 1;
  reviews: Record<string, ReviewEntry>; // key: "2024-Q1"
}

// ── Similarity data ──────────────────────────────────────────────

export interface SimilarEntry {
  key: string; // "2023-Q42"
  score: number; // 0–1
  shared: string[]; // ["specialty:Cardiología", "ICD-10:I48.0"]
  specialty: string;
  textSummary: string;
}

export type SimilarMap = Record<string, SimilarEntry[]>;

// ── Review stats ─────────────────────────────────────────────────

export interface ReviewStats {
  total: number;
  approved: number;
  flagged: number;
  rejected: number;
  unreviewed: number;
}

// ── Tag filter ───────────────────────────────────────────────────

export interface TagFilter {
  field: string;
  value: string;
  label: string; // human-readable field name
}
