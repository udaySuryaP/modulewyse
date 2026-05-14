import { StudentPageShell } from "@/components/dashboard/student-page-shell";

export default function AccountSettingsPage() {
  return (
    <StudentPageShell>
      <div className="rounded-[12px] border border-white/18 bg-white/12 p-6 text-white backdrop-blur-[28px] sm:p-8">
        <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
          Settings
        </p>
        <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
          Account settings
        </h1>
        <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
          Password and account controls will be expanded in the next account
          phase.
        </p>
      </div>
    </StudentPageShell>
  );
}
