import Link from "next/link";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { StatusBadge } from "@/components/landing/status-badge";
import { getSubjectListWithFallback } from "@/lib/data/subjects";
import { subjectStatusLabel } from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";

export default async function SubjectsPage() {
  const { source, subjects } = await getSubjectListWithFallback();

  return (
    <StudentPageShell>
      <div className="mw-card p-5 sm:p-8">
        <p className="mw-label">
          Subjects
        </p>
        <h1 className="mw-display mt-4 text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
          Browse available and upcoming ModuleWyse subjects.
        </h1>
        <p className="mt-4 max-w-[760px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          Start with available subjects and see what is currently in beta or
          being prepared.
        </p>

        {source === "fallback" && process.env.NODE_ENV === "development" ? (
          <p className="mt-4 rounded-2xl border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-4 py-3 text-[13px] leading-[1.4] text-[var(--mw-muted)]">
            Using fallback subject data.
          </p>
        ) : null}

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {subjects.map((subject) => {
            const enabled = subject.status === "available" || subject.status === "beta";
            const card = (
              <article
                className={cn(
                  "mw-card mw-card-hover min-h-[188px] p-4 sm:p-5",
                  enabled
                    ? ""
                    : "opacity-70",
                )}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mw-label text-[11px]">
                      {subject.semester} / {subject.code}
                    </p>
                    <h2
                      className="mt-3 truncate text-[20px] font-medium leading-[1.25] text-[var(--mw-ink)]"
                      title={subject.name}
                    >
                      {subject.name}
                    </h2>
                  </div>
                  <span className="shrink-0">
                    <StatusBadge status={subject.status} />
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-[14px] font-normal leading-[1.5] text-[var(--mw-body)]">
                  {subject.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="mw-label text-[11px]">
                    {enabled
                      ? `${Math.max(subject.modules.length - 1, 0)} modules`
                      : subjectStatusLabel(subject.status)}
                  </p>
                  <span className="text-[13px] font-medium text-[var(--mw-ink)]">
                    {enabled ? "Open Subject" : "In Preparation"}
                  </span>
                </div>
              </article>
            );

            return enabled ? (
              <Link href={`/subjects/${subject.slug}`} key={subject.slug}>
                {card}
              </Link>
            ) : (
              <div key={subject.slug}>{card}</div>
            );
          })}
        </div>
      </div>
    </StudentPageShell>
  );
}
