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
        <div className="mw-card p-5 sm:p-8">
          <p className="mw-label">Settings</p>
          <h1 className="mw-display mt-4 text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
            Account settings
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
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
