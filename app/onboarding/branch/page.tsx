import { BranchForm } from "@/components/onboarding/branch-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export default function BranchPage() {
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
