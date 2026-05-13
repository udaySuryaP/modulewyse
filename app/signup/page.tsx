import { AuthContinuityPage } from "@/components/landing/auth-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <AuthContinuityPage
      body="Create your student account, then complete a short academic setup before opening the dashboard."
      eyebrow="Student access"
      primaryHref={ROUTES.ONBOARDING_ACADEMIC}
      primaryLabel="Continue Setup"
      secondaryHref={ROUTES.LOGIN}
      secondaryLabel="Login"
      title="Start with ModuleWyse."
    />
  );
}
