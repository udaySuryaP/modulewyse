"use client";

import { useRouter } from "next/navigation";

import { GlassButton } from "@/components/landing/glass-button";
import { StatusBadge } from "@/components/landing/status-badge";

const subjects = [
  {
    name: "Object Oriented Programming",
    status: "available",
  },
  {
    name: "DBMS",
    status: "beta",
  },
  {
    name: "Operating Systems",
    status: "coming soon",
  },
  {
    name: "Computer Networks",
    status: "coming soon",
  },
  {
    name: "Data Structures",
    status: "coming soon",
  },
] as const;

function trimSubjectName(name: string) {
  if (name.length <= 22) {
    return name;
  }

  return `${name.slice(0, 22)}...`;
}

export function SubjectStatusPanel() {
  const router = useRouter();

  return (
    <aside className="mx-auto w-full rounded-[12px] border border-white/18 bg-black/24 p-5 backdrop-blur-[28px] sm:p-6">
      <h2 className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
        Available Subjects
      </h2>

      <div className="mt-5 grid gap-3">
        {subjects.map((subject) => (
          <div
            className="flex items-center justify-between gap-3 rounded-[12px] border border-white/12 bg-white/8 px-4 py-3"
            key={subject.name}
          >
            <span
              className="min-w-0 max-w-[22ch] truncate whitespace-nowrap text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/72"
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
