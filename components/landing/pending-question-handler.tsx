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
    <div className="mw-card p-4">
      <p className="mw-label">
        Pending question
      </p>
      <p className="mt-2 text-[16px] font-normal leading-[1.5] text-[var(--mw-body)]">
        {question}
      </p>
      <button
        className="mw-pill-outline mt-4 px-4 py-2 text-[13px]"
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
