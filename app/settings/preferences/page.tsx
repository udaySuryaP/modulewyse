import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { BackLink } from "@/components/ui/back-link";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function PreferencesPage() {
  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login?next=/settings/preferences");
  }

  return (
    <StudentPageShell>
      <div className="mx-auto max-w-[760px]">
        <BackLink className="mb-6" href="/settings" label="Back to settings" />
        <div className="mw-panel p-[var(--mw-space-lg)] sm:p-[var(--mw-space-xl)]">
          <p className="mw-label">Settings</p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] text-[var(--mw-ink)]">
            Preferences
          </h1>
          <p className="mw-body-copy mt-[var(--mw-space-md)] max-w-[620px]">
            Save local study defaults on this device. These preferences are not
            synced to Supabase yet.
          </p>
          <div className="mt-8">
            <PreferencesForm />
          </div>
        </div>
      </div>
    </StudentPageShell>
  );
}
