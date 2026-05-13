import { OnboardingContinuityPage } from "@/components/landing/onboarding-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function BranchPage() {
  return (
    <OnboardingContinuityPage
      body="ModuleWyse will start with supported KTU engineering preparation content and expand through quality gates."
      primaryHref={ROUTES.ONBOARDING_SEMESTER}
      primaryLabel="Continue"
      step="Step 2 / Branch"
      title="Choose your study track."
    />
  );
}
