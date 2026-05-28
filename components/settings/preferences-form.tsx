"use client";

import { useState } from "react";

import { Field, FormMessage, SelectInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  answerTypeOptions,
  examModeOptions,
  saveStudentPreferences,
  type StudentPreferences,
  useStudentPreferences,
} from "@/lib/preferences/student-preferences";
import { cn } from "@/lib/utils";

export function PreferencesForm() {
  const [preferences, setPreferences] = useStudentPreferences();
  const [message, setMessage] = useState("");

  function updatePreference<Key extends keyof StudentPreferences>(
    key: Key,
    value: StudentPreferences[Key],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreferences(saveStudentPreferences(preferences));
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
          {answerTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
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
          {examModeOptions.map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
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
    <label className="flex items-center justify-between gap-4 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] px-4 py-3">
      <span className="text-[15px] leading-[1.45] text-[var(--mw-body)]">{label}</span>
      <button
        aria-pressed={checked}
        className={cn(
          "h-8 w-[58px] mw-radius-pill border border-[var(--mw-hairline-strong)] p-1 transition-colors",
          checked ? "bg-[var(--mw-primary)]" : "bg-[var(--mw-surface-card)]",
        )}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={cn(
            "block size-6 mw-radius-pill transition-transform",
            checked ? "translate-x-6 bg-[#f7f8f8]" : "translate-x-0 bg-[var(--mw-surface-strong)]",
          )}
        />
      </button>
    </label>
  );
}
