import { redirect } from "next/navigation";

import { BackLink } from "@/components/dashboard/back-link";
import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { AcademicSettingsForm } from "@/components/settings/academic-settings-form";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function AcademicSettingsPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login?next=/settings/academic");
  }

  return (
    <StudentPageShell>
      <div className="mw-card mx-auto max-w-[760px] p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <BackLink href="/settings" label="Back" />
          <p className="mw-label">Settings</p>
        </div>
        <h1 className="mw-display mt-4 text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
          Academic settings
        </h1>
        <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          Edit the academic context ModuleWyse uses for student-side
          preparation.
        </p>
        <div className="mt-8">
          <AcademicSettingsForm profile={profile} />
        </div>
      </div>
    </StudentPageShell>
  );
}
