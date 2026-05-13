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

      <textarea
        className="mt-4 min-h-[132px] w-full resize-none rounded-[12px] border border-white/22 bg-white/10 px-4 py-3 text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] outline-none backdrop-blur-[18px] placeholder:text-white/45 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/24"
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Ask a question from your syllabus..."
        value={draft}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55">
          AI/RAG is not connected yet. Your question stays as a draft.
        </p>
        <button
          className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/22 bg-white/12 px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[18px] disabled:opacity-55"
          disabled
          type="button"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
