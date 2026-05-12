import { APP_NAME } from "@/lib/constants";

/**
 * Landing page — will be implemented in Phase 1.
 * This is a minimal placeholder to verify the build works.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="mw-glass max-w-md px-10 py-12 text-center">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--mw-soft-white)]">
          {APP_NAME}
        </h1>
        <p className="mw-label mb-6">KTU AI Exam Prep</p>
        <p className="text-sm leading-relaxed text-[var(--mw-muted-white)]">
          Module-aware, syllabus-grounded, exam-ready answers from curated
          academic notes.
        </p>
      </div>
    </main>
  );
}
