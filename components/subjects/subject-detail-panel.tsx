"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/landing/status-badge";
import type { SubjectModule } from "@/lib/mock-subjects";
import { subjectStatusLabel } from "@/lib/mock-subjects";
import type { SubjectViewModel } from "@/lib/data/subjects";
import { cn } from "@/lib/utils";

type SubjectDetailPanelProps = {
  subject: SubjectViewModel;
};

export function SubjectDetailPanel({ subject }: SubjectDetailPanelProps) {
  const [selectedModule, setSelectedModule] = useState<SubjectModule>("all");
  const chatEnabled = subject.status === "available" || subject.status === "beta";
  const chatHref = useMemo(
    () => `/chat?subject=${subject.slug}&module=${selectedModule}`,
    [selectedModule, subject.slug],
  );

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="mw-card min-w-0 overflow-hidden p-4 sm:p-8">
        <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <p className="mw-label">
              {subject.semester} / {subject.code}
            </p>
            <h1
              className="mw-display mt-4 max-w-full break-words text-[34px] leading-[1.08] text-[var(--mw-ink)] sm:text-[48px] lg:text-[56px]"
              title={subject.name}
            >
              {subject.name}
            </h1>
          </div>
          <StatusBadge status={subject.status} />
        </div>

        <p className="mt-5 max-w-[760px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          {subject.description}
        </p>

        {subject.status === "beta" ? (
          <div className="mt-6 mw-radius-card border border-[var(--mw-hairline)] bg-[rgba(244,197,168,0.22)] p-4 text-[14px] leading-[1.5] text-[var(--mw-body)]">
            This subject is in beta. Answers may be less complete until the
            curated content set is expanded.
          </div>
        ) : null}

        {chatEnabled ? (
          <>
            <div className="mt-8">
              <p className="mw-label">
                Select module
              </p>
              <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                {subject.modules.map((module) => (
                  <button
                    className={cn(
                      "min-h-10 max-w-full mw-radius-pill border border-[var(--mw-hairline)] bg-white px-4 py-2 text-[13px] font-medium leading-none text-[var(--mw-body)] transition-colors hover:bg-[var(--mw-surface-strong)] hover:text-[var(--mw-ink)]",
                      selectedModule === module.value &&
                        "bg-[var(--mw-primary)] text-white hover:bg-[var(--mw-ink)] hover:text-white",
                    )}
                    key={module.value}
                    onClick={() => setSelectedModule(module.value)}
                    type="button"
                  >
                    <span className="block truncate">{module.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link
              className="mw-pill-primary mt-8 w-full sm:w-auto"
              href={chatHref}
            >
              Start Chat
            </Link>
          </>
        ) : (
          <div className="mt-8 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-5">
            <h2 className="mw-display text-[28px] leading-[1.08] text-[var(--mw-ink)] sm:text-[32px]">
              This subject is being prepared.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-[var(--mw-body)]">
              ModuleWyse will open this subject after the curated academic
              content is ready.
            </p>
            <Link
              className="mw-pill-primary mt-5 w-full sm:w-auto"
              href="/subjects"
            >
              View Available Subjects
            </Link>
          </div>
        )}
      </section>

      <aside className="mw-card min-w-0 p-4 sm:p-6 xl:self-start">
        <p className="mw-label">
          Topic preview
        </p>
        <div className="mt-4 grid gap-2">
          {subject.topicSamples.length > 0 ? subject.topicSamples.map((topic) => (
            <div
              className="mw-radius-card min-w-0 break-words border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-4 py-3 text-[14px] leading-[1.45] text-[var(--mw-body)]"
              key={topic}
            >
              {topic}
            </div>
          )) : (
            <div className="mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-4 py-3 text-[14px] leading-[1.45] text-[var(--mw-muted)]">
              Topic previews will appear after content is synced.
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-1 text-[14px] leading-[1.45] text-[var(--mw-body)]">
          <span className="mw-label text-[11px]">
            Status
          </span>
          <span className="text-[var(--mw-ink)]">{subjectStatusLabel(subject.status)}</span>
        </div>
      </aside>
    </div>
  );
}
