import { BackLink } from "@/components/dashboard/back-link";
import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { PreferencesForm } from "@/components/settings/preferences-form";

export default function PreferencesPage() {
  return (
    <StudentPageShell>
      <div className="mw-card mx-auto max-w-[760px] p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <BackLink href="/settings" label="Back" />
          <p className="mw-label">Settings</p>
        </div>
        <h1 className="mw-display mt-4 text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
          Preferences
        </h1>
        <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
          Save local study defaults on this device. These preferences are not
          synced to Supabase yet.
        </p>
        <div className="mt-8">
          <PreferencesForm />
        </div>
      </div>
    </StudentPageShell>
  );
}
