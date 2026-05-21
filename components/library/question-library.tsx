"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SelectInput } from "@/components/auth/form-fields";
import { StatusBadge } from "@/components/landing/status-badge";
import { isChatEnabledSubject } from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";
import type { LibraryQuestionViewModel } from "@/types/library";

const allValue = "all";

type FilterOption = {
  label: string;
  value: string;
};

type LibraryFilters = {
  answerType: string;
  exam: string;
  module: string;
  subject: string;
  year: string;
};

const allOptions = {
  answerType: { label: "All question types", value: allValue },
  exam: { label: "All exams", value: allValue },
  module: { label: "All modules", value: allValue },
  subject: { label: "All subjects", value: allValue },
  year: { label: "All years", value: allValue },
} satisfies Record<keyof LibraryFilters, FilterOption>;

const questionTypeRank: Record<string, number> = {
  part_a: 0,
  part_b: 1,
  part_c: 2,
  short: 3,
  medium: 4,
  long: 5,
  unknown: 99,
};

function uniqueByValue(options: FilterOption[]) {
  return [...new Map(options.map((option) => [option.value, option])).values()];
}

function subjectDisplayLabel(question: LibraryQuestionViewModel) {
  return question.subjectCode
    ? `${question.subjectLabel} · ${question.subjectCode}`
    : question.subjectLabel;
}

function byLabel(left: FilterOption, right: FilterOption) {
  return left.label.localeCompare(right.label);
}

function byModuleNumber(left: FilterOption, right: FilterOption) {
  return Number(left.value) - Number(right.value);
}

function byYearDesc(left: FilterOption, right: FilterOption) {
  if (left.value === "unknown") {
    return 1;
  }

  if (right.value === "unknown") {
    return -1;
  }

  return Number(right.value) - Number(left.value);
}

function byQuestionType(left: FilterOption, right: FilterOption) {
  return (
    (questionTypeRank[left.value] ?? 50) -
      (questionTypeRank[right.value] ?? 50) ||
    left.label.localeCompare(right.label)
  );
}

function valueFromYear(year: string) {
  return year === "Unknown year" ? "unknown" : year;
}

function valuesContain(options: FilterOption[], value: string) {
  return value === allValue || options.some((option) => option.value === value);
}

function applyFilters(
  questions: LibraryQuestionViewModel[],
  filters: LibraryFilters,
) {
  return questions.filter(
    (question) =>
      (filters.subject === allValue || question.subjectSlug === filters.subject) &&
      (filters.module === allValue || question.module === filters.module) &&
      (filters.answerType === allValue ||
        question.questionType === filters.answerType) &&
      (filters.year === allValue || valueFromYear(question.year) === filters.year) &&
      (filters.exam === allValue || question.exam === filters.exam),
  );
}

function buildSubjectOptions(questions: LibraryQuestionViewModel[]) {
  return uniqueByValue(
    questions.map((question) => ({
      label: subjectDisplayLabel(question),
      value: question.subjectSlug,
    })),
  ).sort(byLabel);
}

function buildModuleOptions(questions: LibraryQuestionViewModel[]) {
  return uniqueByValue(
    questions
      .filter((question) => question.module !== allValue)
      .map((question) => ({
        label: question.moduleLabel,
        value: question.module,
      })),
  ).sort(byModuleNumber);
}

function buildQuestionTypeOptions(questions: LibraryQuestionViewModel[]) {
  return uniqueByValue(
    questions.map((question) => ({
      label: question.answerType,
      value: question.questionType,
    })),
  ).sort(byQuestionType);
}

function buildYearOptions(questions: LibraryQuestionViewModel[]) {
  return uniqueByValue(
    questions.map((question) => ({
      label: question.year,
      value: valueFromYear(question.year),
    })),
  ).sort(byYearDesc);
}

function buildExamOptions(questions: LibraryQuestionViewModel[]) {
  return uniqueByValue(
    questions
      .filter((question) => question.exam.trim().length > 0)
      .map((question) => ({
        label: question.exam,
        value: question.exam,
      })),
  ).sort((left, right) => {
    if (left.value === "Unknown exam") {
      return 1;
    }

    if (right.value === "Unknown exam") {
      return -1;
    }

    return left.label.localeCompare(right.label);
  });
}

export function QuestionLibrary({
  dataSource,
  questions,
}: {
  dataSource: "supabase" | "fallback";
  questions: LibraryQuestionViewModel[];
}) {
  const [filters, setFilters] = useState<LibraryFilters>({
    answerType: allValue,
    exam: allValue,
    module: allValue,
    subject: allValue,
    year: allValue,
  });

  const subjectOptions = useMemo(
    () => [allOptions.subject, ...buildSubjectOptions(questions)],
    [questions],
  );
  const subjectScopedQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          filters.subject === allValue ||
          question.subjectSlug === filters.subject,
      ),
    [filters.subject, questions],
  );
  const moduleOptions = useMemo(
    () => [allOptions.module, ...buildModuleOptions(subjectScopedQuestions)],
    [subjectScopedQuestions],
  );
  const moduleScopedQuestions = useMemo(
    () =>
      subjectScopedQuestions.filter(
        (question) =>
          filters.module === allValue || question.module === filters.module,
      ),
    [filters.module, subjectScopedQuestions],
  );
  const answerTypeOptions = useMemo(
    () => [
      allOptions.answerType,
      ...buildQuestionTypeOptions(moduleScopedQuestions),
    ],
    [moduleScopedQuestions],
  );
  const typeScopedQuestions = useMemo(
    () =>
      moduleScopedQuestions.filter(
        (question) =>
          filters.answerType === allValue ||
          question.questionType === filters.answerType,
      ),
    [filters.answerType, moduleScopedQuestions],
  );
  const yearOptions = useMemo(
    () => [allOptions.year, ...buildYearOptions(typeScopedQuestions)],
    [typeScopedQuestions],
  );
  const yearScopedQuestions = useMemo(
    () =>
      typeScopedQuestions.filter(
        (question) =>
          filters.year === allValue ||
          valueFromYear(question.year) === filters.year,
      ),
    [filters.year, typeScopedQuestions],
  );
  const examOptions = useMemo(
    () => [allOptions.exam, ...buildExamOptions(yearScopedQuestions)],
    [yearScopedQuestions],
  );

  const effectiveFilters = useMemo(
    () => ({
      answerType: valuesContain(answerTypeOptions, filters.answerType)
        ? filters.answerType
        : allValue,
      exam: valuesContain(examOptions, filters.exam) ? filters.exam : allValue,
      module: valuesContain(moduleOptions, filters.module)
        ? filters.module
        : allValue,
      subject: valuesContain(subjectOptions, filters.subject)
        ? filters.subject
        : allValue,
      year: valuesContain(yearOptions, filters.year) ? filters.year : allValue,
    }),
    [
      answerTypeOptions,
      examOptions,
      filters.answerType,
      filters.exam,
      filters.module,
      filters.subject,
      filters.year,
      moduleOptions,
      subjectOptions,
      yearOptions,
    ],
  );
  const filteredQuestions = useMemo(
    () => applyFilters(questions, effectiveFilters),
    [effectiveFilters, questions],
  );

  function updateFilter(key: keyof LibraryFilters, value: string) {
    setFilters((current) => {
      if (key === "subject") {
        return {
          answerType: allValue,
          exam: allValue,
          module: allValue,
          subject: value,
          year: allValue,
        };
      }

      if (key === "module") {
        return {
          ...current,
          answerType: allValue,
          exam: allValue,
          module: value,
          year: allValue,
        };
      }

      if (key === "answerType") {
        return {
          ...current,
          answerType: value,
          exam: allValue,
          year: allValue,
        };
      }

      if (key === "year") {
        return {
          ...current,
          exam: allValue,
          year: value,
        };
      }

      return { ...current, [key]: value };
    });
  }

  return (
    <div className="grid gap-4">
      <section className="mw-card p-5 sm:p-8">
        <p className="mw-label">
          Library
        </p>
        <h1 className="mw-display mt-4 text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
          Previous-question library
        </h1>
        <p className="mt-4 max-w-[720px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          Browse previous-year questions and open supported subjects directly in
          the ModuleWyse mock chat flow.
        </p>
        {dataSource === "fallback" ? (
          <p className="mt-3 text-[13px] leading-[1.5] text-[var(--mw-muted)]">
            Showing fallback sample questions while the database library is unavailable.
          </p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            label="Subject"
            onChange={(value) => updateFilter("subject", value)}
            options={subjectOptions}
            value={effectiveFilters.subject}
          />
          <FilterSelect
            label="Module"
            onChange={(value) => updateFilter("module", value)}
            options={moduleOptions}
            value={effectiveFilters.module}
          />
          <FilterSelect
            label="Question type"
            onChange={(value) => updateFilter("answerType", value)}
            options={answerTypeOptions}
            value={effectiveFilters.answerType}
          />
          <FilterSelect
            label="Year"
            onChange={(value) => updateFilter("year", value)}
            options={yearOptions}
            value={effectiveFilters.year}
          />
          <FilterSelect
            label="Exam"
            onChange={(value) => updateFilter("exam", value)}
            options={examOptions}
            value={effectiveFilters.exam}
          />
        </div>
      </section>

      <section className="grid gap-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="mw-card p-5 text-[15px] leading-[1.5] text-[var(--mw-body)]">
            <p className="font-medium text-[var(--mw-ink)]">
              No questions found for this filter.
            </p>
            <p className="mt-2 text-[14px] text-[var(--mw-muted)]">
              Try changing the module, year, or question type.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="mw-label text-[11px]">
        {label}
      </span>
      <SelectInput
        className="w-full min-w-0"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectInput>
    </label>
  );
}

function QuestionCard({ question }: { question: LibraryQuestionViewModel }) {
  const canAsk = isChatEnabledSubject({
    code: question.subjectCode ?? "",
    description: "",
    modules: [],
    name: question.subjectLabel,
    semester: "",
    shortName: question.subjectLabel,
    slug: question.subjectSlug,
    status: question.subjectStatus,
    topicSamples: [],
  });
  const chatHref = `/chat?q=${encodeURIComponent(question.question)}&subject=${question.subjectSlug}&module=${question.module}`;

  return (
    <article
      className={cn(
        "mw-card p-4 sm:p-5",
        !canAsk && "opacity-78",
      )}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={question.subjectStatus} />
            <span className="mw-badge">
              {question.answerType}
            </span>
            <span className="mw-badge">
              {question.year}
            </span>
            <span className="mw-badge">
              {question.exam}
            </span>
          </div>

          <h2 className="mt-4 text-[22px] font-medium leading-[1.25] text-[var(--mw-ink)] sm:text-[24px]">
            {question.question}
          </h2>

          <p className="mt-3 truncate text-[14px] leading-[1.5] text-[var(--mw-muted)]">
            {subjectDisplayLabel(question)} / {question.moduleLabel}
          </p>

          {!canAsk ? (
            <p className="mt-3 text-[14px] leading-[1.5] text-[var(--mw-muted)]">
              Subject coming soon. This question is visible for preview, but
              chat is not enabled for this subject yet.
            </p>
          ) : null}
        </div>

        {canAsk ? (
          <Link
            className="mw-pill-primary w-full lg:w-auto"
            href={chatHref}
          >
            Ask AI
          </Link>
        ) : (
          <button
            className="h-11 w-full mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] px-5 text-[13px] font-medium text-[var(--mw-muted)] lg:w-auto"
            disabled
            type="button"
          >
            Subject Coming Soon
          </button>
        )}
      </div>
    </article>
  );
}
