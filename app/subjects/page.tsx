import Link from "next/link";
import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { StatusBadge } from "@/components/landing/status-badge";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getSubjectListWithFallback } from "@/lib/data/subjects";
import { subjectStatusLabel } from "@/lib/mock-subjects";
import { cn } from "@/lib/utils";

export default async function SubjectsPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/subjects");
  }

  const { source, subjects } = await getSubjectListWithFallback();

  return (
    <StudentPageShell>
      <div className="min-w-0">
        <section className="mw-page-rule">
          <p className="mw-label">
            Subjects
          </p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] max-w-[980px] text-[var(--mw-ink)]">
            Browse available and upcoming ModuleWyse subjects.
          </h1>
          <p className="mw-body-copy mt-[var(--mw-space-md)] max-w-[760px]">
            Start with available subjects and see what is currently in beta or
            being prepared.
          </p>
        </section>

        {source === "fallback" && process.env.NODE_ENV === "development" ? (
          <p className="mw-panel-muted mw-meta mt-[var(--mw-space-md)] px-[var(--mw-space-md)] py-[var(--mw-space-sm)]">
            Using fallback subject data.
          </p>
        ) : null}

        <div className="mw-slab mt-[var(--mw-space-xl)] grid min-w-0 lg:grid-cols-2">
          {subjects.map((subject) => {
            const enabled = subject.status === "available" || subject.status === "beta";
            const card = (
              <article
                className={cn(
                  "flex h-full min-h-[188px] min-w-0 flex-col border-b border-[var(--mw-hairline)] p-[var(--mw-space-lg)] transition-colors hover:bg-[var(--mw-canvas-soft)] lg:border-r",
                  enabled
                    ? ""
                    : "opacity-70",
                )}
              >
                <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:justify-between">
                  <div className="min-w-0">
                    <p className="mw-label text-[length:var(--mw-type-micro)]">
                      {subject.semester} / {subject.code}
                    </p>
                    <h2
                      className="mw-title-sm mt-[var(--mw-space-sm)] line-clamp-2 text-[var(--mw-ink)]"
                      title={subject.name}
                    >
                      {subject.name}
                    </h2>
                  </div>
                  <span className="shrink-0">
                    <StatusBadge status={subject.status} />
                  </span>
                </div>

                <p className="mw-meta mt-[var(--mw-space-md)] line-clamp-3">
                  {subject.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <p className="mw-label text-[length:var(--mw-type-micro)]">
                    {enabled
                      ? `${subject.moduleCountLabel} · ${subject.contentStatusLabel}`
                      : subject.totalModules > 0
                        ? `${subject.moduleCountLabel} · ${subject.contentStatusLabel}`
                        : subjectStatusLabel(subject.status)}
                  </p>
                  <span className="text-[length:var(--mw-type-meta)] font-medium text-[var(--mw-ink)]">
                    {enabled ? "Open Subject" : "In Preparation"}
                  </span>
                </div>
              </article>
            );

            return enabled ? (
              <Link className="block min-w-0" href={`/subjects/${subject.slug}`} key={subject.slug}>
                {card}
              </Link>
            ) : (
              <div className="min-w-0" key={subject.slug}>{card}</div>
            );
          })}
        </div>
      </div>
    </StudentPageShell>
  );
}
