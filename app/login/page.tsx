import { AuthContinuityPage } from "@/components/landing/auth-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <AuthContinuityPage
      body="Sign in to continue to your ModuleWyse dashboard and restore any pending question from the landing page."
      eyebrow="Welcome back"
      primaryHref={ROUTES.CHAT}
      primaryLabel="Open Dashboard"
      secondaryHref={ROUTES.SIGNUP}
      secondaryLabel="Get Started"
      title="Return to exam prep."
    />
  );
}
