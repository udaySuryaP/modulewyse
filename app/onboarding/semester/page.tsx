import { OnboardingContinuityPage } from "@/components/landing/onboarding-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function SemesterPage() {
  return (
    <OnboardingContinuityPage
      body="Semester and subject selection will control the module-aware chat context."
      primaryHref={ROUTES.ONBOARDING_FINAL}
      primaryLabel="Continue"
      step="Step 3 / Semester"
      title="Pick your semester."
    />
  );
}
