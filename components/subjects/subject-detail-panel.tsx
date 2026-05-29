import Link from "next/link";

import { StatusBadge } from "@/components/landing/status-badge";
import type {
  ModuleReadiness,
  SubjectModuleViewModel,
  SubjectViewModel,
} from "@/lib/data/subjects";
import { subjectStatusLabel } from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";

type SubjectDetailPanelProps = {
  subject: SubjectViewModel;
};

const moduleStatusClasses: Record<ModuleReadiness, string> = {
  empty: "bg-[var(--mw-surface-strong)] text-[var(--mw-muted)]",
  ready: "bg-[var(--mw-primary)] text-white",
  review: "bg-[var(--mw-surface-lift)] text-[var(--mw-ink)]",
};

function moduleMeta(module: SubjectModuleViewModel) {
  const details = [
    module.topicCount === 1
      ? "1 topic"
      : `${module.topicCount} topics`,
  ];

  if (module.readyChunkCount > 0) {
    details.push(
      module.readyChunkCount === 1
        ? "1 ready chunk"
        : `${module.readyChunkCount} ready chunks`,
    );
  }

  return details.join(" · ");
}

export function SubjectDetailPanel({ subject }: SubjectDetailPanelProps) {
  const subjectChatEnabled =
    (subject.status === "available" || subject.status === "beta") &&
    subject.hasReadyContent;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-white p-4 sm:p-8">
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

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="mw-radius-pill bg-[var(--mw-surface-strong)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--mw-muted)]">
            {subject.moduleCountLabel}
          </span>
          <span className="mw-radius-pill bg-[var(--mw-surface-strong)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--mw-muted)]">
            {subject.contentStatusLabel}
          </span>
        </div>

        {subject.status === "beta" ? (
          <div className="mt-6 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] p-4 text-[14px] leading-[1.5] text-[var(--mw-body)]">
            This subject is in beta. Answers may be less complete until the
            curated content set is expanded.
          </div>
        ) : null}

        <div className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mw-label">
                Modules
              </p>
              <p className="mt-2 text-[14px] leading-[1.5] text-[var(--mw-muted)]">
                Module readiness is based on the notes and syllabus currently
                fed into ModuleWyse.
              </p>
            </div>

            {subjectChatEnabled ? (
              <Link
                className="mw-pill-primary w-full sm:w-auto"
                href={`/chat?subject=${subject.slug}&module=all`}
              >
                Start Chat
              </Link>
            ) : null}
          </div>

          {subject.modules.length > 0 ? (
          <div className="mt-4 grid overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-white lg:grid-cols-2">
              {subject.modules.map((module) => {
                return (
                  <article
                    className="min-w-0 border-b border-[var(--mw-hairline)] p-4 lg:border-r"
                    key={module.value}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mw-label text-[11px]">
                          {module.label}
                        </p>
                        <h2 className="mt-2 line-clamp-2 text-[17px] font-medium leading-[1.25] text-[var(--mw-ink)]">
                          {module.title}
                        </h2>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 mw-radius-pill px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.08em]",
                          moduleStatusClasses[module.moduleReadiness],
                        )}
                      >
                        {module.contentStatus}
                      </span>
                    </div>

                    <p className="mt-3 text-[13px] leading-[1.45] text-[var(--mw-muted)]">
                      {moduleMeta(module)}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-5 text-[14px] leading-[1.5] text-[var(--mw-muted)]">
              No notes or syllabus modules have been fed for this subject yet.
            </div>
          )}
        </div>
      </section>

      <aside className="min-w-0 mw-radius-card border border-[var(--mw-hairline)] bg-white p-4 sm:p-6 xl:self-start">
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

        <div className="mt-6 grid gap-1 text-[14px] leading-[1.45] text-[var(--mw-body)]">
          <span className="mw-label text-[11px]">
            Content
          </span>
          <span className="text-[var(--mw-ink)]">{subject.contentStatusLabel}</span>
        </div>
      </aside>
    </div>
  );
}
