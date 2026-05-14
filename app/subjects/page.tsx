import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { StatusBadge } from "@/components/landing/status-badge";

const subjects = [
  ["Object Oriented Programming", "available"],
  ["DBMS", "beta"],
  ["Operating Systems", "coming soon"],
  ["Computer Networks", "coming soon"],
  ["Data Structures", "coming soon"],
] as const;

export default function SubjectsPage() {
  return (
    <StudentPageShell>
      <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 backdrop-blur-[28px] sm:p-8">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Subjects
        </p>
        <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
          Browse available and upcoming ModuleWyse subjects.
        </h1>
        <p className="mt-4 max-w-[760px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
          Start with available subjects and see what is currently in beta or
          coming soon.
        </p>

        <div className="mt-8 grid gap-3">
          {subjects.map(([name, status]) => (
            <div
              className="flex min-w-0 items-center justify-between gap-3 rounded-[12px] border border-white/12 bg-white/8 px-3 py-3 sm:gap-4 sm:px-4"
              key={name}
            >
              <span className="min-w-0 truncate text-[15px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72 sm:text-[16px]">
                {name}
              </span>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </div>
    </StudentPageShell>
  );
}
