"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { nextRouteForQuestion } from "@/lib/landing-flow";

const MAX_LENGTH = 3000;

export function HeroAskBox() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const route = await nextRouteForQuestion(question);
      router.push(route);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <form
        className="mw-card p-3 shadow-[0_20px_80px_rgba(12,10,9,0.05)] min-[380px]:p-4 sm:p-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-start justify-between gap-2 text-[11px] font-medium leading-[1.35] text-[var(--mw-muted)] min-[380px]:gap-3 min-[380px]:text-[12px] sm:mb-5 sm:items-center sm:gap-4 sm:text-[13px]">
          <span className="max-w-[160px] text-left min-[380px]:max-w-[185px] sm:max-w-none">
            KTU BASED EXAM PREP COMPANION
          </span>
          <span className="shrink-0 text-right">
            <span className="md:hidden">
              POWERED BY
              <br />
              O4-MINI
            </span>
            <span className="hidden whitespace-nowrap md:inline">
              POWERED BY O4-MINI
            </span>
          </span>
        </div>

        <div className="mw-radius-card border border-[var(--mw-hairline-strong)] bg-[var(--mw-canvas-soft)] p-1.5">
          <div className="mw-input flex min-h-[42px] items-center gap-2 px-2 py-1 min-[380px]:min-h-[46px] min-[380px]:gap-3 min-[380px]:px-3 sm:min-h-[58px] sm:py-2">
          <input
            aria-label="Ask a question from your syllabus"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-[1.35] text-[var(--mw-ink)] outline-none placeholder:text-[var(--mw-muted-soft)] min-[380px]:text-[14px] sm:text-[16px]"
            maxLength={MAX_LENGTH}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question from your syllabus..."
            value={question}
          />
          <button
            aria-label="Ask ModuleWyse"
            className="grid h-8 shrink-0 place-items-center mw-radius-pill bg-[var(--mw-primary)] px-[16px] text-[12px] font-medium text-white transition-colors hover:bg-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20 sm:h-10 sm:px-5 sm:text-[14px]"
            disabled={isSubmitting}
            type="submit"
          >
            Ask
          </button>
          </div>
        </div>
      </form>

      <p className="mt-4 text-center text-[14px] font-normal leading-[1.45] text-[var(--mw-muted)]">
        New users will be asked to create an account before opening the
        dashboard.
      </p>
    </div>
  );
}
