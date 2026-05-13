"use client";

import type { OnboardingDraft } from "@/lib/auth/types";

const ONBOARDING_DRAFT_KEY = "modulewyse.onboardingDraft";

export function readOnboardingDraft(): OnboardingDraft {
  if (typeof window === "undefined") {
    return {};
  }

  const rawDraft = localStorage.getItem(ONBOARDING_DRAFT_KEY);

  if (!rawDraft) {
    return {};
  }

  try {
    return JSON.parse(rawDraft) as OnboardingDraft;
  } catch {
    return {};
  }
}

export function saveOnboardingDraft(nextDraft: OnboardingDraft) {
  if (typeof window === "undefined") {
    return;
  }

  const draft = {
    ...readOnboardingDraft(),
    ...nextDraft,
  };

  localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ONBOARDING_DRAFT_KEY);
}
