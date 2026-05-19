"use client";

import { useRouter } from "next/navigation";

import { GlassButton } from "@/components/landing/glass-button";
import { StatusBadge } from "@/components/landing/status-badge";
import { mockSubjects } from "@/lib/mock-subjects";

function trimSubjectName(name: string) {
  if (name.length <= 22) {
    return name;
  }

  return `${name.slice(0, 22)}...`;
}

export function SubjectStatusPanel() {
  const router = useRouter();

  return (
    <aside className="mw-card mx-auto w-full p-5 sm:p-6">
      <h2 className="mw-label">
        Available Subjects
      </h2>

      <div className="mt-5 grid gap-3">
        {mockSubjects.map((subject) => (
          <div
            className="flex items-center justify-between gap-3 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-4 py-3"
            key={subject.slug}
          >
            <span
              className="min-w-0 max-w-[22ch] truncate whitespace-nowrap text-[14px] font-normal leading-[1.4] text-[var(--mw-body)]"
              title={subject.name}
            >
              {trimSubjectName(subject.name)}
            </span>
            <span className="shrink-0">
              <StatusBadge status={subject.status} />
            </span>
          </div>
        ))}
      </div>

      <GlassButton
        className="mt-5 w-full"
        onClick={() => router.push("/subjects")}
        variant="primary"
      >
        View Subjects
      </GlassButton>
    </aside>
  );
}
