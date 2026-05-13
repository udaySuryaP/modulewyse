"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Field,
  FormMessage,
  SelectInput,
  TextInput,
} from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  clearOnboardingDraft,
  readOnboardingDraft,
  saveOnboardingDraft,
} from "@/components/onboarding/draft";
import { useProfileUpdate } from "@/components/onboarding/use-profile-update";
import {
  chatHrefWithQuestion,
  pendingDestinationRoute,
  readPendingQuestion,
} from "@/lib/landing-flow";

export function FinalSetupForm() {
  const router = useRouter();
  const updateProfile = useProfileUpdate();
  const draft = readOnboardingDraft();
  const [focusSubject, setFocusSubject] = useState(
    draft.focus_subject ?? "Object Oriented Programming",
  );
  const [referralSource, setReferralSource] = useState(
    draft.referral_source ?? "",
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!referralSource.trim()) {
      setMessage("Referral source is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const values = {
        ...draft,
        focus_subject: focusSubject.trim(),
        referral_source: referralSource.trim(),
        onboarding_completed: true,
      };

      saveOnboardingDraft(values);
      await updateProfile(values);
      clearOnboardingDraft();

      const pendingQuestion = readPendingQuestion();
      router.push(
        pendingDestinationRoute() ??
          (pendingQuestion ? chatHrefWithQuestion(pendingQuestion) : "/chat"),
      );
      router.refresh();
    } catch {
      setMessage("Couldn’t complete setup. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Focus subject">
        <SelectInput
          onChange={(event) => setFocusSubject(event.target.value)}
          value={focusSubject}
        >
          <option>Object Oriented Programming</option>
          <option>DBMS</option>
          <option>Operating Systems</option>
          <option>Computer Networks</option>
          <option>Data Structures</option>
        </SelectInput>
      </Field>
      <Field label="How did you hear about ModuleWyse?">
        <TextInput
          onChange={(event) => setReferralSource(event.target.value)}
          required
          value={referralSource}
        />
      </Field>

      {message ? <FormMessage>{message}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Open Dashboard"}
      </SubmitButton>
    </form>
  );
}
