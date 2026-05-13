"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  clearPendingQuestion,
  readPendingQuestion,
  savePendingQuestion,
} from "@/lib/landing-flow";

export function PendingQuestionHandler() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const urlQuestion = searchParams.get("q") ?? "";
  const question = dismissed ? "" : urlQuestion || readPendingQuestion();

  useEffect(() => {
    if (urlQuestion) {
      savePendingQuestion(urlQuestion);
    }
  }, [urlQuestion]);

  if (!question) {
    return null;
  }

  return (
    <div className="rounded-[12px] border border-white/18 bg-white/12 p-4 text-white/72 backdrop-blur-[24px]">
      <p className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/55">
        Pending question
      </p>
      <p className="mt-2 text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white">
        {question}
      </p>
      <button
        className="mt-4 rounded-[12px] border border-white/18 bg-white/10 px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-white"
        onClick={() => {
          clearPendingQuestion();
          setDismissed(true);
        }}
        type="button"
      >
        Clear
      </button>
    </div>
  );
}
