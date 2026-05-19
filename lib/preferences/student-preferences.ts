"use client";

import { useEffect, useState } from "react";

export type StudentPreferences = {
  compactAnswerCards: boolean;
  defaultAnswerType: string;
  examModeDefault: string;
  showSourceChips: boolean;
  showSuggestedPrompts: boolean;
};

export const studentPreferencesKey = "modulewyse.studentPreferences";
export const studentPreferencesChangedEvent = "modulewyse:preferences-changed";

export const defaultStudentPreferences: StudentPreferences = {
  compactAnswerCards: false,
  defaultAnswerType: "Default",
  examModeDefault: "Exam-ready",
  showSourceChips: true,
  showSuggestedPrompts: true,
};

export const answerTypeOptions = [
  "Default",
  "Short",
  "Medium",
  "Long",
  "Part A",
  "Part B",
  "Part C",
];

export const examModeOptions = ["Exam-ready", "Revision", "Practice"];

export function normalizeStudentPreferences(
  value: Partial<StudentPreferences> | null | undefined,
): StudentPreferences {
  return {
    ...defaultStudentPreferences,
    ...value,
    defaultAnswerType: answerTypeOptions.includes(value?.defaultAnswerType ?? "")
      ? value?.defaultAnswerType ?? defaultStudentPreferences.defaultAnswerType
      : defaultStudentPreferences.defaultAnswerType,
    examModeDefault: examModeOptions.includes(value?.examModeDefault ?? "")
      ? value?.examModeDefault ?? defaultStudentPreferences.examModeDefault
      : defaultStudentPreferences.examModeDefault,
  };
}

export function readStudentPreferences() {
  if (typeof window === "undefined") {
    return defaultStudentPreferences;
  }

  try {
    const stored = window.localStorage.getItem(studentPreferencesKey);

    if (!stored) {
      return defaultStudentPreferences;
    }

    return normalizeStudentPreferences(JSON.parse(stored));
  } catch {
    return defaultStudentPreferences;
  }
}

export function saveStudentPreferences(preferences: StudentPreferences) {
  const normalized = normalizeStudentPreferences(preferences);
  window.localStorage.setItem(studentPreferencesKey, JSON.stringify(normalized));
  window.dispatchEvent(new Event(studentPreferencesChangedEvent));
  return normalized;
}

export function useStudentPreferences() {
  const [preferences, setPreferences] = useState(defaultStudentPreferences);

  useEffect(() => {
    function syncPreferences() {
      setPreferences(readStudentPreferences());
    }

    syncPreferences();
    window.addEventListener("storage", syncPreferences);
    window.addEventListener(studentPreferencesChangedEvent, syncPreferences);

    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener(studentPreferencesChangedEvent, syncPreferences);
    };
  }, []);

  return [preferences, setPreferences] as const;
}
