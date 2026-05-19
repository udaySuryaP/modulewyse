import { redirect } from "next/navigation";

import { AcademicProfileForm } from "@/components/onboarding/academic-profile-form";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function AcademicProfilePage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/onboarding/academic-profile");
  }

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
