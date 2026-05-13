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

export function BranchForm() {
  const router = useRouter();
  const updateProfile = useProfileUpdate();
  const draft = readOnboardingDraft();
  const [branch, setBranch] = useState(draft.branch ?? "CSE");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!branch) {
      setMessage("Choose a branch.");
      return;
    }

    setIsSubmitting(true);

    try {
      saveOnboardingDraft({ branch });
      await updateProfile({ branch });
      router.push("/onboarding/semester");
    } catch {
      setMessage("Couldn’t complete setup. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <button
        className="rounded-[12px] border border-white/24 bg-white/16 p-4 text-left text-white"
        onClick={() => setBranch("CSE")}
        type="button"
      >
        <span className="block text-[18px]">Computer Science Engineering</span>
        <span className="mt-1 block text-[14px] text-white/55">Available</span>
      </button>
      <button
        className="rounded-[12px] border border-white/12 bg-white/8 p-4 text-left text-white/45"
        disabled
        type="button"
      >
        Other branches
        <span className="mt-1 block text-[14px]">Coming later</span>
      </button>

      {message ? <FormMessage>{message}</FormMessage> : null}

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Continue"}
      </SubmitButton>
    </form>
  );
}
