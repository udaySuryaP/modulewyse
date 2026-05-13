import { OnboardingContinuityPage } from "@/components/landing/onboarding-continuity-page";

export default function FinalSetupPage() {
  return (
    <OnboardingContinuityPage
      body="After setup, ModuleWyse opens the right destination and restores any question saved from the landing page."
      finalStep
      primaryLabel="Open Dashboard"
      step="Step 4 / Final setup"
      title="Ready to start preparing."
    />
  );
}
