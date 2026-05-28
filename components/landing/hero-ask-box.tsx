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
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const route = await nextRouteForQuestion(trimmedQuestion);
      router.push(route);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <form className="mw-panel p-[var(--mw-space-md)] sm:p-[var(--mw-space-lg)]" onSubmit={handleSubmit}>
        <div className="mb-[var(--mw-space-md)] flex items-start justify-between gap-[var(--mw-space-xs)] text-[length:var(--mw-type-micro)] font-medium leading-[1.35] text-[var(--mw-muted)] sm:items-center sm:gap-[var(--mw-space-md)]">
          <span className="max-w-[160px] text-left min-[380px]:max-w-[185px] sm:max-w-none">
            REVIEWED ACADEMIC NOTES
          </span>
          <span className="shrink-0 text-right">
            <span className="md:hidden">
              SOURCE
              <br />
              BACKED
            </span>
            <span className="hidden whitespace-nowrap md:inline">
              SOURCE BACKED
            </span>
          </span>
        </div>

        <div className="flex min-h-[3rem] items-center gap-[var(--mw-space-xs)] border-b border-[var(--mw-hairline-strong)] px-[var(--mw-space-xs)] py-[var(--mw-space-xs)] sm:min-h-[3.625rem] sm:gap-[var(--mw-space-sm)]">
          <input
            aria-label="Ask a question from your syllabus"
            className="min-w-0 flex-1 bg-transparent text-[length:var(--mw-type-link)] font-normal leading-[1.35] text-[var(--mw-ink)] outline-none placeholder:text-[var(--mw-muted-soft)] sm:text-[length:var(--mw-type-body)]"
            maxLength={MAX_LENGTH}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask from reviewed notes..."
            value={question}
          />
          <button
            aria-label="Ask ModuleWyse"
            className="grid h-10 shrink-0 place-items-center mw-radius-pill bg-[var(--mw-primary)] px-[var(--mw-space-lg)] text-[length:var(--mw-type-link)] font-semibold text-white transition-colors hover:bg-[var(--mw-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-primary-focus)]/20"
            disabled={isSubmitting || !question.trim()}
            type="submit"
          >
            Ask
          </button>
        </div>
      </form>

      <p className="mw-meta mt-[var(--mw-space-md)] text-center">
        New users will be asked to create an account before opening the
        dashboard.
      </p>
    </div>
  );
}
