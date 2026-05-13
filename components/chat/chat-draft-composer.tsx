"use client";

import { useEffect, useState } from "react";

import { readPendingQuestion, savePendingQuestion } from "@/lib/landing-flow";

export function ChatDraftComposer({
  initialQuestion,
}: {
  initialQuestion: string;
}) {
  const [draft, setDraft] = useState(
    () => initialQuestion || readPendingQuestion(),
  );

  useEffect(() => {
    if (initialQuestion) {
      savePendingQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  return (
    <div className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Chat composer
        </p>
        <p className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55">
          Mock draft only
        </p>
      </div>

      <div className="mt-4 flex min-h-[56px] items-center gap-3 rounded-[12px] border border-white/22 bg-white/10 px-4 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[18px]">
        <input
          className="min-w-0 flex-1 bg-transparent text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white outline-none placeholder:text-white/45"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question from your syllabus..."
          value={draft}
        />
        <button
          aria-label="Ask ModuleWyse"
          className="grid h-10 shrink-0 place-items-center rounded-[12px] bg-white px-4 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-black transition-colors hover:bg-white/88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          type="button"
        >
          Ask
        </button>
      </div>

      <p className="mt-4 text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55">
        AI/RAG is not connected yet. Your question stays as a draft.
      </p>
    </div>
  );
}
