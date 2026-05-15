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
      <div className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px] sm:p-8">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Subjects
        </p>
        <h1 className="mt-4 text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
          Browse available and upcoming ModuleWyse subjects.
        </h1>
        <p className="mt-4 max-w-[760px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
          Start with available subjects and see what is currently in beta or
          being prepared.
        </p>

        {source === "fallback" && process.env.NODE_ENV === "development" ? (
          <p className="mt-4 rounded-[12px] border border-white/14 bg-white/8 px-4 py-3 text-[13px] leading-[1.4] text-white/55">
            Using fallback subject data.
          </p>
        ) : null}

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {subjects.map((subject) => {
            const enabled = subject.status === "available" || subject.status === "beta";
            const card = (
              <article
                className={cn(
                  "min-h-[188px] rounded-[12px] border border-white/14 bg-white/8 p-4 transition-colors sm:p-5",
                  enabled
                    ? "hover:border-white/24 hover:bg-white/12"
                    : "opacity-70",
                )}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-medium uppercase leading-[1.4] tracking-[0.08em] text-white/55">
                      {subject.semester} / {subject.code}
                    </p>
                    <h2
                      className="mt-3 truncate text-[20px] font-normal leading-[1.2] tracking-[-0.02em] text-white"
                      title={subject.name}
                    >
                      {subject.name}
                    </h2>
                  </div>
                  <span className="shrink-0">
                    <StatusBadge status={subject.status} />
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-[14px] font-normal leading-[1.45] tracking-[-0.01em] text-white/68">
                  {subject.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/48">
                    {enabled
                      ? `${Math.max(subject.modules.length - 1, 0)} modules`
                      : subjectStatusLabel(subject.status)}
                  </p>
                  <span className="font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-white/72">
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
