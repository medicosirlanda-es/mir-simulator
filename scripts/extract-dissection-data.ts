/**
 * Extract dissection data from the standalone HTML prototype
 * and generate JSON files for the Next.js app.
 *
 * Usage: npx tsx scripts/extract-dissection-data.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const HTML_PATH = join(
  __dirname,
  "../../../mironline/Preguntas-generator/codificacion-poc/mir-2024-diseccion.html"
);
const OUTPUT_DIR = join(__dirname, "../public/data");

// ── Helpers ──────────────────────────────────────────────────────

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function transformKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(transformKeys);
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[snakeToCamel(key)] = transformKeys(value);
    }
    return result;
  }
  return obj;
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  console.log("Reading HTML from:", HTML_PATH);
  const html = readFileSync(HTML_PATH, "utf-8");

  // Extract the DATA array from between "const DATA = [" and "];"
  const startMarker = "const DATA = [";
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error("Could not find 'const DATA = [' in HTML");
  }

  // Find the matching closing bracket
  const arrayStart = startIdx + startMarker.length - 1; // include the '['
  let depth = 0;
  let endIdx = -1;
  for (let i = arrayStart; i < html.length; i++) {
    if (html[i] === "[") depth++;
    if (html[i] === "]") depth--;
    if (depth === 0) {
      endIdx = i + 1; // include the ']'
      break;
    }
  }

  if (endIdx === -1) {
    throw new Error("Could not find matching ']' for DATA array");
  }

  const jsonStr = html.slice(arrayStart, endIdx);
  console.log(`Extracted ${jsonStr.length} chars of JSON`);

  const rawData = JSON.parse(jsonStr) as Record<string, unknown>[];
  console.log(`Parsed ${rawData.length} questions`);

  // Transform snake_case → camelCase
  const data = transformKeys(rawData) as Record<string, unknown>[];

  // Validate
  for (const q of data) {
    if (!q.number || !q.specialty || !q.text) {
      throw new Error(`Invalid question: ${JSON.stringify(q).slice(0, 200)}`);
    }
  }

  // Write dissection data
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const year = 2024;
  const outputPath = join(OUTPUT_DIR, `dissection-${year}.json`);
  writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Wrote ${outputPath} (${data.length} questions)`);

  // Compute manifest
  const specialties = new Set(data.map((q) => q.specialty as string));
  const imageCount = data.filter(
    (q) => Array.isArray(q.images) && (q.images as string[]).length > 0
  ).length;

  const manifest = {
    years: [year],
    exams: [
      {
        year,
        totalQuestions: data.length,
        specialtyCount: specialties.size,
        imageCount,
      },
    ],
  };

  const manifestPath = join(OUTPUT_DIR, "dissections-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote ${manifestPath}`);

  console.log("\nSummary:");
  console.log(`  Questions: ${data.length}`);
  console.log(`  Specialties: ${specialties.size}`);
  console.log(`  With images: ${imageCount}`);
}

main();
