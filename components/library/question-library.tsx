"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SelectInput } from "@/components/auth/form-fields";
import { StatusBadge } from "@/components/landing/status-badge";
import {
  isChatEnabledSubject,
  subjectModuleLabel,
} from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";
import type { LibraryQuestionViewModel } from "@/types/library";

const allOption = "All";

export function QuestionLibrary({
  dataSource,
  questions,
}: {
  dataSource: "supabase" | "fallback";
  questions: LibraryQuestionViewModel[];
}) {
  const [subject, setSubject] = useState(allOption);
  const [module, setModule] = useState(allOption);
  const [answerType, setAnswerType] = useState(allOption);
  const [year, setYear] = useState(allOption);
  const subjectOptions = useMemo(
    () => [
      allOption,
      ...Array.from(new Set(questions.map((item) => item.subjectLabel))),
    ],
    [questions],
  );
  const moduleOptions = useMemo(
    () => [
      allOption,
      ...Array.from(
        new Set(questions.map((item) => subjectModuleLabel(item.module))),
      ),
    ],
    [questions],
  );
  const answerTypeOptions = useMemo(
    () => [
      allOption,
      ...Array.from(new Set(questions.map((item) => item.answerType))),
    ],
    [questions],
  );
  const yearOptions = useMemo(
    () => [
      allOption,
      ...Array.from(new Set(questions.map((item) => item.year))),
    ],
    [questions],
  );

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const moduleLabel = subjectModuleLabel(question.module);

        return (
          (subject === allOption || question.subjectLabel === subject) &&
          (module === allOption || moduleLabel === module) &&
          (answerType === allOption || question.answerType === answerType) &&
          (year === allOption || question.year === year)
        );
      }),
    [answerType, module, questions, subject, year],
  );

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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Subject"
            onChange={setSubject}
            options={subjectOptions}
            value={subject}
          />
          <FilterSelect
            label="Module"
            onChange={setModule}
            options={moduleOptions}
            value={module}
          />
          <FilterSelect
            label="Answer type"
            onChange={setAnswerType}
            options={answerTypeOptions}
            value={answerType}
          />
          <FilterSelect
            label="Year"
            onChange={setYear}
            options={yearOptions}
            value={year}
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
            No questions match these filters.
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
  options: string[];
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
          <option key={option}>{option}</option>
        ))}
      </SelectInput>
    </label>
  );
}

function QuestionCard({ question }: { question: LibraryQuestionViewModel }) {
  const canAsk = isChatEnabledSubject({
    code: "",
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
          </div>

          <h2 className="mt-4 text-[22px] font-medium leading-[1.25] text-[var(--mw-ink)] sm:text-[24px]">
            {question.question}
          </h2>

          <p className="mt-3 truncate text-[14px] leading-[1.5] text-[var(--mw-muted)]">
            {question.subjectLabel} / {subjectModuleLabel(question.module)}
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
