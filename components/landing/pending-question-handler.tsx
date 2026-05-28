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
    <div className="border border-[var(--mw-hairline)] bg-white p-4">
      <p className="mw-label">
        Pending question
      </p>
      <p className="mw-body-copy mt-[var(--mw-space-xs)]">
        {question}
      </p>
      <button
        className="mw-pill-outline mt-[var(--mw-space-md)] px-[var(--mw-space-md)] py-[var(--mw-space-xs)] text-[length:var(--mw-type-meta)]"
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
