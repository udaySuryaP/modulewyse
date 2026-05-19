import { redirect } from "next/navigation";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { SemesterForm } from "@/components/onboarding/semester-form";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function SemesterPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/onboarding/semester");
  }

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
