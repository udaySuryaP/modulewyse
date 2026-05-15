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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[12px] font-medium uppercase leading-[1.4] tracking-[0.08em] text-white/55">
              {subject.semester} / {subject.code}
            </p>
            <h1
              className="mt-4 max-w-full text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]"
              title={subject.name}
            >
              {subject.name}
            </h1>
          </div>
          <StatusBadge status={subject.status} />
        </div>

        <p className="mt-5 max-w-[760px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
          {subject.description}
        </p>

        {subject.status === "beta" ? (
          <div className="mt-6 rounded-[12px] border border-white/14 bg-[rgba(215,160,119,0.14)] p-4 text-[14px] leading-[1.45] text-white/72">
            This subject is in beta. Answers may be less complete until the
            curated content set is expanded.
          </div>
        ) : null}

        {chatEnabled ? (
          <>
            <div className="mt-8">
              <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/55">
                Select module
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {subject.modules.map((module) => (
                  <button
                    className={cn(
                      "h-10 rounded-[12px] border border-white/18 bg-white/10 px-4 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-white/72 transition-colors hover:bg-white/16 hover:text-white",
                      selectedModule === module.value &&
                        "bg-white text-black hover:bg-white hover:text-black",
                    )}
                    key={module.value}
                    onClick={() => setSelectedModule(module.value)}
                    type="button"
                  >
                    {module.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-black transition-colors hover:bg-white/88 sm:w-auto"
              href={chatHref}
            >
              Start Chat
            </Link>
          </>
        ) : (
          <div className="mt-8 rounded-[12px] border border-white/14 bg-white/8 p-5">
            <h2 className="text-[24px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
              This subject is being prepared.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.45] text-white/68">
              ModuleWyse will open this subject after the curated academic
              content is ready.
            </p>
            <Link
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-black transition-colors hover:bg-white/88 sm:w-auto"
              href="/subjects"
            >
              View Available Subjects
            </Link>
          </div>
        )}
      </section>

      <aside className="rounded-[12px] border border-white/18 bg-white/10 p-5 text-white backdrop-blur-[28px] sm:p-6 xl:self-start">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white/55">
          Topic preview
        </p>
        <div className="mt-4 grid gap-2">
          {subject.topicSamples.length > 0 ? subject.topicSamples.map((topic) => (
            <div
              className="rounded-[12px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] leading-[1.4] text-white/72"
              key={topic}
            >
              {topic}
            </div>
          )) : (
            <div className="rounded-[12px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] leading-[1.4] text-white/55">
              Topic previews will appear after content is synced.
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-1 text-[14px] leading-[1.45] text-white/68">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
            Status
          </span>
          <span className="text-white/78">{subjectStatusLabel(subject.status)}</span>
        </div>
      </aside>
    </div>
  );
}
