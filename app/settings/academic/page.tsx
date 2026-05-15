import { redirect } from "next/navigation";

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
      <div className="mx-auto max-w-[760px] rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px] sm:p-8">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Settings
        </p>
        <h1 className="mt-4 text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
          Academic settings
        </h1>
        <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
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
