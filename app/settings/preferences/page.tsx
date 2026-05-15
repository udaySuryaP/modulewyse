import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { PreferencesForm } from "@/components/settings/preferences-form";

export default function PreferencesPage() {
  return (
    <StudentPageShell>
      <div className="mx-auto max-w-[760px] rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px] sm:p-8">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Settings
        </p>
        <h1 className="mt-4 text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
          Preferences
        </h1>
        <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
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
