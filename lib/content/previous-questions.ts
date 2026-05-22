import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import type {
  PreviousQuestionAppearanceInput,
  PreviousQuestionInput,
} from "@/types/library";
import type {
  PreviousQuestionType,
  QuestionConfidence,
} from "@/types/database";
import { pbcst304ModulePlan } from "@/lib/content/validation";

const expectedSubjectCode = "PBCST304";
const expectedSubjectSlug = "oop";
const validModules = new Set<number>(pbcst304ModulePlan.validModules);

export type StagedPreviousQuestion = {
  answerAvailable?: boolean;
  appearances?: Array<{
    exam?: string | null;
    sourceFile?: string | null;
    sourcePage?: number | null;
    year?: number | null;
  }>;
  confidence?: string;
  exam?: string | null;
  id?: string;
  marks?: number | null;
  module?: number | null;
  needsReview?: boolean;
  notes?: string;
  question?: string;
  questionType?: string;
  sourceFile?: string | null;
  sourcePage?: number | null;
  status?: string;
  topic?: string | null;
  year?: number | null;
};

export type StagedPreviousQuestionFile = {
  questions?: StagedPreviousQuestion[];
  readyQuestionCount?: number;
  questionCount?: number;
  status?: string;
  subject?: string;
  subjectCode?: string;
};

export type QuestionValidationIssue = {
  id?: string;
  reason: string;
};

export type PreparedQuestionSet = {
  duplicateGroups: number;
  invalidRecords: QuestionValidationIssue[];
  moduleDistribution: Record<string, number>;
  prepared: PreviousQuestionInput[];
  skippedReasons: Record<string, number>;
  source: StagedPreviousQuestionFile;
  total: number;
  unknownMetadata: {
    exam: number;
    marks: number;
    module: number;
    topic: number;
    year: number;
  };
};

function increment(record: Record<string, number>, key: string) {
  record[key] = (record[key] ?? 0) + 1;
}

function normalizeNullableString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeQuestionType(value: unknown): PreviousQuestionType {
  const normalized = String(value ?? "unknown")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (
    normalized === "short" ||
    normalized === "medium" ||
    normalized === "long" ||
    normalized === "part_a" ||
    normalized === "part_b" ||
    normalized === "part_c"
  ) {
    return normalized;
  }

  return "unknown";
}

export function normalizeConfidence(value: unknown): QuestionConfidence {
  const normalized = String(value ?? "medium").trim().toLowerCase();

  if (normalized === "high" || normalized === "low") {
    return normalized;
  }

  return "medium";
}

export function normalizeQuestionText(question: string) {
  return question
    .toLowerCase()
    .replace(/^\s*(?:question|q)?\s*\d+[\).:-]\s*/i, "")
    .replace(/\s+\d+[\).]\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function questionHash(question: string) {
  return createHash("sha256").update(normalizeQuestionText(question)).digest("hex");
}

function normalizeAppearance(
  appearance: PreviousQuestionAppearanceInput,
): PreviousQuestionAppearanceInput {
  return {
    exam: normalizeNullableString(appearance.exam),
    metadata: appearance.metadata ?? {},
    sourceFile: normalizeNullableString(appearance.sourceFile),
    sourcePage: Number.isInteger(appearance.sourcePage) ? appearance.sourcePage : null,
    year: Number.isInteger(appearance.year) ? appearance.year : null,
  };
}

function prepareAppearances(question: StagedPreviousQuestion) {
  const appearances = question.appearances && question.appearances.length > 0
    ? question.appearances
    : [
        {
          exam: question.exam ?? null,
          sourceFile: question.sourceFile ?? null,
          sourcePage: question.sourcePage ?? null,
          year: question.year ?? null,
        },
      ];

  const unique = new Map<string, PreviousQuestionAppearanceInput>();

  for (const appearance of appearances) {
    const normalized = normalizeAppearance({
      exam: appearance.exam ?? null,
      sourceFile: appearance.sourceFile ?? null,
      sourcePage: appearance.sourcePage ?? null,
      year: appearance.year ?? null,
    });
    const key = [
      normalized.year ?? "",
      normalized.exam ?? "",
      normalized.sourceFile ?? "",
      normalized.sourcePage ?? "",
    ].join("|");

    unique.set(key, normalized);
  }

  return [...unique.values()];
}

export async function loadStagedPreviousQuestions(filePath: string) {
  return JSON.parse(await readFile(filePath, "utf8")) as StagedPreviousQuestionFile;
}

export function preparePreviousQuestions(source: StagedPreviousQuestionFile): PreparedQuestionSet {
  const questions = source.questions ?? [];
  const invalidRecords: QuestionValidationIssue[] = [];
  const skippedReasons: Record<string, number> = {};
  const unknownMetadata = {
    exam: 0,
    marks: 0,
    module: 0,
    topic: 0,
    year: 0,
  };
  const moduleDistribution: Record<string, number> = {};
  const byHash = new Map<string, PreviousQuestionInput>();
  let duplicateGroups = 0;

  for (const question of questions) {
    const id = question.id;
    const text = question.question?.trim() ?? "";
    const confidence = normalizeConfidence(question.confidence);
    const moduleNumber = Number.isInteger(question.module) ? question.module ?? null : null;
    const status = question.status === "ready" ? "ready" : "draft";
    const topicTitle = normalizeNullableString(question.topic);
    const exam = normalizeNullableString(question.exam);
    const sourceFile = normalizeNullableString(question.sourceFile);
    const sourcePage = Number.isInteger(question.sourcePage) ? question.sourcePage ?? null : null;
    const year = Number.isInteger(question.year) ? question.year ?? null : null;
    const marks = Number.isInteger(question.marks) ? question.marks ?? null : null;

    if (!text) {
      increment(skippedReasons, "missing question text");
      invalidRecords.push({ id, reason: "missing question text" });
      continue;
    }

    if (source.subjectCode !== expectedSubjectCode) {
      increment(skippedReasons, "wrong subject code");
      invalidRecords.push({ id, reason: "wrong subject code" });
      continue;
    }

    if (status !== "ready") {
      increment(skippedReasons, "not ready");
      continue;
    }

    if (question.needsReview) {
      increment(skippedReasons, "needs review");
      continue;
    }

    if (confidence === "low") {
      increment(skippedReasons, "low confidence");
      continue;
    }

    if (moduleNumber === 5) {
      increment(skippedReasons, "module 5 does not exist in PBCST304 2024 scheme");
      invalidRecords.push({
        id,
        reason: "module 5 does not exist in PBCST304 2024 scheme",
      });
      continue;
    }

    if (!moduleNumber || !validModules.has(moduleNumber)) {
      increment(skippedReasons, "invalid or missing module");
      invalidRecords.push({ id, reason: "invalid or missing module" });
      continue;
    }

    if (!exam || exam === "Unknown") {
      unknownMetadata.exam += 1;
    }

    if (marks === null) {
      unknownMetadata.marks += 1;
    }

    if (!topicTitle) {
      unknownMetadata.topic += 1;
    }

    if (year === null) {
      unknownMetadata.year += 1;
    }

    increment(moduleDistribution, String(moduleNumber));

    const hash = questionHash(text);
    const appearances = prepareAppearances(question);
    const existing = byHash.get(hash);

    if (existing) {
      duplicateGroups += 1;
      existing.appearances.push(...appearances);
      existing.metadata = {
        ...existing.metadata,
        appearances: existing.appearances,
        originalQuestionIds: [
          ...new Set([
            ...((existing.metadata.originalQuestionIds as string[] | undefined) ?? []),
            id,
          ].filter(Boolean)),
        ],
      };
      continue;
    }

    byHash.set(hash, {
      answerAvailable: Boolean(question.answerAvailable),
      appearances,
      confidence,
      exam,
      marks,
      metadata: {
        appearances,
        extractionConfidence: confidence,
        needsReview: Boolean(question.needsReview),
        normalizedQuestion: normalizeQuestionText(text),
        originalQuestionId: id ?? null,
        originalQuestionIds: id ? [id] : [],
        originalQuestionType: question.questionType ?? null,
        questionHash: hash,
        sourceFile,
        sourcePage,
        subjectCode: expectedSubjectCode,
        subjectSlug: expectedSubjectSlug,
        topicTitle,
      },
      moduleNumber,
      question: text,
      questionHash: hash,
      questionType: normalizeQuestionType(question.questionType),
      sourceFile,
      sourcePage,
      status: "ready",
      subjectCode: expectedSubjectCode,
      subjectSlug: expectedSubjectSlug,
      topicTitle,
      year,
    });
  }

  return {
    duplicateGroups,
    invalidRecords,
    moduleDistribution,
    prepared: [...byHash.values()],
    skippedReasons,
    source,
    total: questions.length,
    unknownMetadata,
  };
}
