"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormMessage } from "@/components/auth/form-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  readOnboardingDraft,
  saveOnboardingDraft,
} from "@/components/onboarding/draft";
import { useProfileUpdate } from "@/components/onboarding/use-profile-update";
import { cn } from "@/lib/utils";

export function SemesterForm() {
  const router = useRouter();
  const updateProfile = useProfileUpdate();
  const draft = readOnboardingDraft();
  const [semester, setSemester] = useState(draft.semester ?? 4);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!semester) {
      setMessage("Choose a semester.");
      return;
    }

    setIsSubmitting(true);

    try {
      saveOnboardingDraft({ semester });
      await updateProfile({ semester });
      router.push("/onboarding/final-setup");
    } catch {
      setMessage("Couldn’t complete setup. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => (
          <button
            className={cn(
              "h-12 mw-radius-pill border text-[14px] font-medium",
              semester === item
                ? "border-[var(--mw-primary)] bg-[var(--mw-primary)] text-white"
                : "border-[var(--mw-hairline)] bg-white text-[var(--mw-ink)]",
            )}
            key={item}
            onClick={() => setSemester(item)}
            type="button"
          >
            S{item}
          </button>
        ))}
      </div>

      {message ? <FormMessage>{message}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Continue"}
      </SubmitButton>
    </form>
  );
}
