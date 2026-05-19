"use client";

import { useStudentPreferences } from "@/lib/preferences/student-preferences";

function status(value: boolean) {
  return value ? "On" : "Off";
}

export function PreferencesSummary() {
  const [preferences] = useStudentPreferences();

  const rows = [
    ["Default answer type", preferences.defaultAnswerType],
    ["Exam mode", preferences.examModeDefault],
    ["Source chips", status(preferences.showSourceChips)],
    ["Suggested prompts", status(preferences.showSuggestedPrompts)],
    ["Compact answers", status(preferences.compactAnswerCards)],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div
          className="mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4"
          key={label}
        >
          <p className="mw-label text-[11px]">{label}</p>
          <p className="mt-2 truncate text-[15px] leading-[1.45] text-[var(--mw-body)]">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
