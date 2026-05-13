"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage, TextInput } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  readOnboardingDraft,
  saveOnboardingDraft,
} from "@/components/onboarding/draft";
import { useProfileUpdate } from "@/components/onboarding/use-profile-update";

export function AcademicProfileForm() {
  const router = useRouter();
  const updateProfile = useProfileUpdate();
  const draft = readOnboardingDraft();
  const [collegeName, setCollegeName] = useState(draft.college_name ?? "");
  const [graduationYear, setGraduationYear] = useState(
    draft.graduation_year ? String(draft.graduation_year) : "",
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const parsedYear = Number(graduationYear);

    if (!collegeName.trim() || !parsedYear) {
      setMessage("College and graduation year are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const values = {
        college_name: collegeName.trim(),
        graduation_year: parsedYear,
      };

      saveOnboardingDraft(values);
      await updateProfile(values);
      router.push("/onboarding/branch");
    } catch {
      setMessage("Couldn’t complete setup. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="College name">
        <TextInput
          onChange={(event) => setCollegeName(event.target.value)}
          required
          value={collegeName}
        />
      </Field>
      <Field label="Graduation year">
        <TextInput
          inputMode="numeric"
          max="2035"
          min="2020"
          onChange={(event) => setGraduationYear(event.target.value)}
          required
          type="number"
          value={graduationYear}
        />
      </Field>

      {message ? <FormMessage>{message}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Continue"}
      </SubmitButton>
    </form>
  );
}
