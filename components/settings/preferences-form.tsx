"use client";

import { useState } from "react";

import { Field, FormMessage, SelectInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { cn } from "@/lib/utils";

type Preferences = {
  defaultAnswerType: string;
  examModeDefault: string;
  showSourceChips: boolean;
  showSuggestedPrompts: boolean;
  compactAnswerCards: boolean;
};

const preferencesKey = "modulewyse.studentPreferences";
const defaultPreferences: Preferences = {
  defaultAnswerType: "Default",
  examModeDefault: "Exam-ready",
  showSourceChips: true,
  showSuggestedPrompts: true,
  compactAnswerCards: false,
};

export function PreferencesForm() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window === "undefined") {
      return defaultPreferences;
    }

    try {
      const stored = window.localStorage.getItem(preferencesKey);

      if (!stored) {
        return defaultPreferences;
      }

      return {
        ...defaultPreferences,
        ...JSON.parse(stored),
      };
    } catch {
      return defaultPreferences;
    }
  });
  const [message, setMessage] = useState("");

  function updatePreference<Key extends keyof Preferences>(
    key: Key,
    value: Preferences[Key],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
    setMessage("Preferences saved.");
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <Field label="Default answer type">
        <SelectInput
          className="w-full"
          onChange={(event) =>
            updatePreference("defaultAnswerType", event.target.value)
          }
          value={preferences.defaultAnswerType}
        >
          {["Default", "Short", "Medium", "Long", "Part A", "Part B", "Part C"].map(
            (type) => (
              <option key={type}>{type}</option>
            ),
          )}
        </SelectInput>
      </Field>

      <Field label="Exam mode default">
        <SelectInput
          className="w-full"
          onChange={(event) =>
            updatePreference("examModeDefault", event.target.value)
          }
          value={preferences.examModeDefault}
        >
          <option>Exam-ready</option>
          <option>Revision</option>
          <option>Practice</option>
        </SelectInput>
      </Field>

      <div className="grid gap-3">
        <ToggleRow
          checked={preferences.showSourceChips}
          label="Show source chips"
          onChange={(checked) => updatePreference("showSourceChips", checked)}
        />
        <ToggleRow
          checked={preferences.showSuggestedPrompts}
          label="Show suggested prompts"
          onChange={(checked) =>
            updatePreference("showSuggestedPrompts", checked)
          }
        />
        <ToggleRow
          checked={preferences.compactAnswerCards}
          label="Compact answer cards"
          onChange={(checked) => updatePreference("compactAnswerCards", checked)}
        />
      </div>

      {message ? <FormMessage tone="success">{message}</FormMessage> : null}

      <SubmitButton>Save Preferences</SubmitButton>
    </form>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[12px] border border-white/14 bg-white/8 px-4 py-3">
      <span className="text-[15px] leading-[1.45] text-white/72">{label}</span>
      <button
        aria-pressed={checked}
        className={cn(
          "h-8 w-[58px] rounded-[12px] border border-white/18 p-1 transition-colors",
          checked ? "bg-white" : "bg-white/10",
        )}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={cn(
            "block size-6 rounded-[8px] transition-transform",
            checked ? "translate-x-6 bg-black" : "translate-x-0 bg-white/70",
          )}
        />
      </button>
    </label>
  );
}
