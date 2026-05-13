import { AuthContinuityPage } from "@/components/landing/auth-continuity-page";
import { ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  return (
    <AuthContinuityPage
      body="Password reset will be connected with Supabase Auth in the next backend phase."
      eyebrow="Account recovery"
      primaryHref={ROUTES.LOGIN}
      primaryLabel="Back To Login"
      secondaryHref={ROUTES.SIGNUP}
      secondaryLabel="Get Started"
      title="Reset access safely."
    />
  );
}
