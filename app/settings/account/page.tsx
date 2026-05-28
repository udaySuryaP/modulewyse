import { redirect } from "next/navigation";

import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";
import { BackLink } from "@/components/ui/back-link";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function AccountSettingsPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login?next=/settings/account");
  }

  return (
    <StudentPageShell>
      <div className="mx-auto max-w-[760px]">
        <BackLink className="mb-6" href="/settings" label="Back to settings" />
        <div className="mw-panel p-[var(--mw-space-lg)] sm:p-[var(--mw-space-xl)]">
          <p className="mw-label">Settings</p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] text-[var(--mw-ink)]">
            Account settings
          </h1>
          <p className="mw-body-copy mt-[var(--mw-space-md)] max-w-[620px]">
            Update your profile name. Email is read-only for this MVP.
          </p>
          <div className="mt-8">
            <AccountSettingsForm profile={profile} />
          </div>
        </div>
      </div>
    </StudentPageShell>
  );
}
