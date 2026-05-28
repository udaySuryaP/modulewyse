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
  return (
    <aside className="mw-panel mx-auto w-full p-[var(--mw-space-lg)]">
      <h2 className="mw-label">
        Available Subjects
      </h2>

      <div className="mt-[var(--mw-space-lg)] grid divide-y divide-[var(--mw-hairline)] border-y border-[var(--mw-hairline)]">
        {mockSubjects.map((subject) => (
          <div
            className="flex items-center justify-between gap-[var(--mw-space-sm)] px-[var(--mw-space-xxs)] py-[var(--mw-space-sm)]"
            key={subject.slug}
          >
            <span
              className="min-w-0 max-w-[22ch] truncate whitespace-nowrap text-[length:var(--mw-type-link)] font-normal leading-[1.4] text-[var(--mw-body)]"
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
        className="mt-[var(--mw-space-lg)] w-full"
        href="/subjects"
        variant="primary"
      >
        View Subjects
      </GlassButton>
    </aside>
  );
}
