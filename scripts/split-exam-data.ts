/**
 * Split mir_questions_clean.json into per-year static files.
 * Run: npx tsx scripts/split-exam-data.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SOURCE = join(__dirname, "../../mir_questions_clean.json");
const OUT_DIR = join(__dirname, "../public/data");

interface RawAnswer {
  order: number;
  text: string;
  is_correct: boolean;
}

interface RawQuestion {
  number: number;
  text: string;
  text_html: string;
  images: string[];
  explanation: string | null;
  answers: RawAnswer[];
  correct_answer_index: number;
}

interface RawExam {
  year: number;
  total_questions: number;
  questions: RawQuestion[];
}

interface RawData {
  metadata: {
    total_exams: number;
    total_questions: number;
    year_range: string;
  };
  exams: RawExam[];
}

function stripImgTags(html: string): string {
  return html.replace(/<img[^>]*>/gi, "");
}

function main() {
  console.log("Reading source data...");
  const raw: RawData = JSON.parse(readFileSync(SOURCE, "utf-8"));

  mkdirSync(OUT_DIR, { recursive: true });

  const manifest: {
    totalExams: number;
    totalQuestions: number;
    yearRange: string;
    exams: Array<{
      year: number;
      totalQuestions: number;
      numOptions: number;
      hasImages: boolean;
      imageCount: number;
    }>;
  } = {
    totalExams: raw.metadata.total_exams,
    totalQuestions: raw.metadata.total_questions,
    yearRange: raw.metadata.year_range,
    exams: [],
  };

  for (const exam of raw.exams) {
    const numOptions = exam.questions[0]?.answers.length ?? 4;
    const imageCount = exam.questions.filter(
      (q) => q.images && q.images.length > 0
    ).length;

    const transformed = {
      year: exam.year,
      totalQuestions: exam.total_questions,
      numOptions,
      hasImages: imageCount > 0,
      questions: exam.questions.map((q) => ({
        number: q.number,
        text: q.text,
        textHtml: stripImgTags(q.text_html),
        images: q.images,
        explanation: q.explanation,
        answers: q.answers.map((a) => ({
          order: a.order,
          text: a.text,
          isCorrect: a.is_correct,
        })),
        correctAnswerIndex: q.correct_answer_index,
      })),
    };

    const filename = `exam-${exam.year}.json`;
    writeFileSync(
      join(OUT_DIR, filename),
      JSON.stringify(transformed),
      "utf-8"
    );

    const size = (
      Buffer.byteLength(JSON.stringify(transformed)) / 1024
    ).toFixed(1);
    console.log(`  ${filename} (${size} KB, ${exam.total_questions} questions)`);

    manifest.exams.push({
      year: exam.year,
      totalQuestions: exam.total_questions,
      numOptions,
      hasImages: imageCount > 0,
      imageCount,
    });
  }

  writeFileSync(
    join(OUT_DIR, "exams-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  console.log(
    `\nDone! ${manifest.totalExams} exams, ${manifest.totalQuestions} questions total.`
  );
}

main();
