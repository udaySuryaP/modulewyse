import { redirect } from "next/navigation";

import { FinalSetupForm } from "@/components/onboarding/final-setup-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function FinalSetupPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/onboarding/final-setup");
  }

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
