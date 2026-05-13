import { FinalSetupForm } from "@/components/onboarding/final-setup-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export default function FinalSetupPage() {
  return (
    <OnboardingShell
      body="Choose your first focus area. ModuleWyse will open the right destination after setup."
      step="Step 4 / Final setup"
      title="Ready to start preparing."
    >
      <FinalSetupForm />
    </OnboardingShell>
  );
}
