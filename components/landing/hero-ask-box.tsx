"use client";

import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { nextRouteForQuestion } from "@/lib/landing-flow";

const MAX_LENGTH = 3000;

export function HeroAskBox() {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const route = nextRouteForQuestion(question);
    router.push(route);
  };

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <form
        className="rounded-[12px] border border-white/18 bg-white/13 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[24px] sm:p-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-center justify-between gap-4 text-[12px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55 sm:text-[14px]">
          <span>KTU BASED EXAM PREP COMPANION</span>
          <span>Powered by o4-mini</span>
        </div>

        <div className="flex min-h-[58px] items-center gap-3 rounded-[12px] bg-white px-4 py-2 text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:min-h-[74px] sm:py-3">
          <input
            aria-label="Ask a question from your syllabus"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[1.35] tracking-[-0.02em] text-black outline-none placeholder:text-black/55 sm:text-[16px]"
            maxLength={MAX_LENGTH}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question from your syllabus..."
            value={question}
          />
          <button
            aria-label="Ask ModuleWyse"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-white transition-colors hover:bg-black/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:size-10"
            type="submit"
          >
            <ArrowUp className="size-4 sm:size-5" strokeWidth={2} />
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
