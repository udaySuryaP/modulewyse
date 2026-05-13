import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SemesterForm } from "@/components/onboarding/semester-form";

export default function SemesterPage() {
  return (
    <OnboardingShell
      body="Semester selection controls which subjects and module-aware answers are prioritized."
      step="Step 3 / Semester"
      title="Pick your semester."
    >
      <SemesterForm />
    </OnboardingShell>
  );
}
