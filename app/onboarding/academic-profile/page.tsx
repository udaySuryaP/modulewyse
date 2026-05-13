import { OnboardingContinuityPage } from "@/components/landing/onboarding-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function AcademicProfilePage() {
  return (
    <OnboardingContinuityPage
      body="Academic profile fields will be connected to Supabase profiles in the auth phase."
      primaryHref={ROUTES.ONBOARDING_BRANCH}
      primaryLabel="Continue"
      step="Step 1 / Academic profile"
      title="Set your academic context."
    />
  );
}
