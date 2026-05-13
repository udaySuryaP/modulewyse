"use client";

import { ArrowUp } from "lucide-react";
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
        className="rounded-[12px] border border-white/18 bg-white/13 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[24px] min-[380px]:p-4 sm:p-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-start justify-between gap-2 text-[11px] font-normal leading-[1.35] tracking-[-0.01em] text-white/55 min-[380px]:gap-3 min-[380px]:text-[12px] sm:mb-5 sm:items-center sm:gap-4 sm:text-[14px]">
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

        <div className="flex min-h-[42px] items-center gap-2 rounded-[12px] border border-white/70 bg-white px-3 py-1 text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] min-[380px]:min-h-[46px] min-[380px]:gap-3 min-[380px]:px-4 sm:min-h-[62px] sm:py-2">
          <input
            aria-label="Ask a question from your syllabus"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-[1.35] tracking-[-0.02em] text-black outline-none placeholder:text-black/55 min-[380px]:text-[14px] sm:text-[16px]"
            maxLength={MAX_LENGTH}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question from your syllabus..."
            value={question}
          />
          <button
            aria-label="Ask ModuleWyse"
            className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-black text-white transition-colors hover:bg-black/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 min-[380px]:size-8 sm:size-10"
            disabled={isSubmitting}
            type="submit"
          >
            <ArrowUp className="size-3.5 min-[380px]:size-4 sm:size-5" strokeWidth={2} />
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55">
        New users will be asked to create an account before opening the
        dashboard.
      </p>
    </div>
  );
}
