import { AcademicProfileForm } from "@/components/onboarding/academic-profile-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export default function AcademicProfilePage() {
  return (
    <OnboardingShell
      body="Tell ModuleWyse where you study so your preparation setup stays tied to your academic profile."
      step="Step 1 / Academic profile"
      title="Set your academic context."
    >
      <AcademicProfileForm />
    </OnboardingShell>
  );
}
