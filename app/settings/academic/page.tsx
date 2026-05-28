import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { AcademicSettingsForm } from "@/components/settings/academic-settings-form";
import { BackLink } from "@/components/ui/back-link";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function AcademicSettingsPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login?next=/settings/academic");
  }

  return (
    <StudentPageShell>
      <div className="mx-auto max-w-[760px]">
        <BackLink className="mb-6" href="/settings" label="Back to settings" />
        <div className="mw-panel p-[var(--mw-space-lg)] sm:p-[var(--mw-space-xl)]">
          <p className="mw-label">Settings</p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] text-[var(--mw-ink)]">
            Academic settings
          </h1>
          <p className="mw-body-copy mt-[var(--mw-space-md)] max-w-[620px]">
            Edit the academic context ModuleWyse uses for student-side
            preparation.
          </p>
          <div className="mt-8">
            <AcademicSettingsForm profile={profile} />
          </div>
        </div>
      </div>
    </StudentPageShell>
  );
}
