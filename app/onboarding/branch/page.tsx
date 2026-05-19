import { redirect } from "next/navigation";

import { BranchForm } from "@/components/onboarding/branch-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function BranchPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/onboarding/branch");
  }

  return (
    <OnboardingShell
      body="Choose the study track ModuleWyse should use for subject and module context."
      step="Step 2 / Branch"
      title="Choose your study track."
    >
      <BranchForm />
    </OnboardingShell>
  );
}
