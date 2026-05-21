import { hasSupabasePublicEnv } from "@/lib/env/public";
import { mockLibraryQuestions } from "@/lib/mock-library";
import {
  getSubjectBySlug as getFallbackSubjectBySlug,
  subjectModuleLabel,
  type SubjectModule,
} from "@/lib/mock-subjects";
import { createClient } from "@/lib/supabase/server";
import type { PreviousQuestionType, QuestionConfidence } from "@/types/database";
import type { LibraryQuestionViewModel } from "@/types/library";

export type LibraryQuestionListResult = {
  questions: LibraryQuestionViewModel[];
  source: "supabase" | "fallback";
};

export type LibraryQuestionFilters = {
  answerTypes: string[];
  exams: string[];
  modules: string[];
  subjects: string[];
  years: string[];
};

type PreviousQuestionRow = {
  answer_available: boolean;
  confidence: QuestionConfidence;
  exam: string | null;
  id: string;
  modules: {
    module_number: number;
    title: string;
  } | null;
  question: string;
  question_type: PreviousQuestionType;
  status: string;
  subjects: {
    code: string | null;
    name: string;
    slug: string;
    status: "available" | "beta" | "coming-soon" | "draft";
  };
  year: number | null;
};

function answerTypeLabel(questionType: PreviousQuestionType) {
  const labels: Record<PreviousQuestionType, string> = {
    long: "Long",
    medium: "Medium",
    part_a: "Part A",
    part_b: "Part B",
    part_c: "Part C",
    short: "Short Answer",
    unknown: "Unknown Type",
  };

  return labels[questionType];
}

function normalizeExamLabel(exam: string | null) {
  const normalized = exam?.trim();

  if (!normalized || normalized.toLowerCase() === "unknown") {
    return "Unknown exam";
  }

  return normalized;
}

function normalizeYearLabel(year: number | string | null) {
  if (typeof year === "number" && Number.isFinite(year)) {
    return String(year);
  }

  if (typeof year === "string" && year.trim() && year !== "Unknown") {
    return year.trim();
  }

  return "Unknown year";
}

function fallbackQuestions(): LibraryQuestionViewModel[] {
  return mockLibraryQuestions.map((question) => {
    const subject = getFallbackSubjectBySlug(question.subjectSlug);

    return {
      answerAvailable: true,
      answerType: question.answerType,
      confidence: "medium",
      exam: normalizeExamLabel(question.exam),
      id: question.id,
      module: question.module,
      moduleLabel: subjectModuleLabel(question.module),
      question: question.question,
      questionType: "unknown",
      source: "fallback",
      status: question.status,
      subjectCode: question.subjectCode,
      subjectLabel: question.subjectLabel,
      subjectSlug: question.subjectSlug,
      subjectStatus: subject?.status ?? "coming-soon",
      year: normalizeYearLabel(question.year),
    };
  });
}

function rowToViewModel(row: PreviousQuestionRow): LibraryQuestionViewModel {
  const moduleValue = row.modules?.module_number
    ? String(row.modules.module_number) as SubjectModule
    : "all";

  return {
    answerAvailable: row.answer_available,
    answerType: answerTypeLabel(row.question_type),
    confidence: row.confidence,
    exam: normalizeExamLabel(row.exam),
    id: row.id,
    module: moduleValue,
    moduleLabel: subjectModuleLabel(moduleValue),
    question: row.question,
    questionType: row.question_type,
    source: "supabase",
    status: row.status,
    subjectCode: row.subjects.code,
    subjectLabel: row.subjects.name,
    subjectSlug: row.subjects.slug,
    subjectStatus: row.subjects.status === "draft" ? "coming-soon" : row.subjects.status,
    year: normalizeYearLabel(row.year),
  };
}

export async function getPreviousQuestions(): Promise<LibraryQuestionViewModel[]> {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("previous_questions")
    .select("id, question, question_type, year, exam, answer_available, confidence, status, subjects!inner(slug, name, code, status), modules(module_number, title)")
    .eq("status", "ready")
    .order("year", { ascending: false, nullsFirst: false })
    .order("question", { ascending: true });

  if (error) {
    return [];
  }

  return ((data ?? []) as unknown as PreviousQuestionRow[]).map(rowToViewModel);
}

export async function getPreviousQuestionsBySubject(subjectSlug: string) {
  const questions = await getPreviousQuestions();

  return questions.filter((question) => question.subjectSlug === subjectSlug);
}

export async function getPreviousQuestionsBySubjectModule(
  subjectSlug: string,
  moduleNumber: number,
) {
  const questions = await getPreviousQuestionsBySubject(subjectSlug);

  return questions.filter((question) => question.module === String(moduleNumber));
}

export function getPreviousQuestionFilters(
  questions: LibraryQuestionViewModel[],
): LibraryQuestionFilters {
  return {
    answerTypes: [...new Set(questions.map((question) => question.answerType))],
    exams: [...new Set(questions.map((question) => question.exam))],
    modules: [
      ...new Set(questions.map((question) => subjectModuleLabel(question.module))),
    ],
    subjects: [...new Set(questions.map((question) => question.subjectLabel))],
    years: [...new Set(questions.map((question) => question.year))],
  };
}

export async function getLibraryQuestionsWithFallback(): Promise<LibraryQuestionListResult> {
  const questions = await getPreviousQuestions();

  if (questions.length === 0) {
    return {
      questions: fallbackQuestions(),
      source: "fallback",
    };
  }

  return {
    questions,
    source: "supabase",
  };
}
