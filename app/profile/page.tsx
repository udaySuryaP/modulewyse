import Link from "next/link";
import { redirect } from "next/navigation";

import { SignoutButton } from "@/components/auth/signout-button";
import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { getUserProfile } from "@/lib/auth/get-user-profile";

const usageStats = [
  ["Questions asked", "0"],
  ["Subjects used", "Static/mock"],
  ["Answers copied", "0"],
  ["Feedback given", "0"],
] as const;

function displayValue(value: string | number | boolean | null | undefined) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  return String(value);
}

export default async function ProfilePage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login?next=/profile");
  }

  const profileRows = [
    ["Full name", profile.full_name],
    ["Email", profile.email || user.email || ""],
    ["College", profile.college_name],
    ["Graduation year", profile.graduation_year],
    ["Branch", profile.branch],
    ["Semester", profile.semester ? `S${profile.semester}` : null],
    ["Focus subject", profile.focus_subject],
    ["Onboarding completed", profile.onboarding_completed],
  ] as const;

  return (
    <StudentPageShell>
      <div className="grid gap-4">
        <section className="rounded-[12px] border border-white/18 bg-white/12 p-5 text-white backdrop-blur-[28px] sm:p-8">
          <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
            Profile
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
                Student profile
              </h1>
              <p className="mt-3 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
                Your ModuleWyse account and academic context.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-black"
                href="/settings/account"
              >
                Edit Profile
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/18 bg-white/10 px-5 font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-white"
                href="/settings"
              >
                Settings
              </Link>
              <SignoutButton />
            </div>
          </div>
        </section>

        <section className="grid gap-3 rounded-[12px] border border-white/18 bg-white/10 p-5 backdrop-blur-[28px] sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {usageStats.map(([label, value]) => (
            <div
              className="rounded-[12px] border border-white/12 bg-white/8 p-4"
              key={label}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
                {label}
              </p>
              <p className="mt-3 text-[22px] leading-[1.1] tracking-[-0.02em] text-white">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[12px] border border-white/18 bg-white/12 p-5 backdrop-blur-[28px] sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {profileRows.map(([label, value]) => (
              <div
                className="min-w-0 rounded-[12px] border border-white/12 bg-white/8 p-4"
                key={label}
              >
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
                  {label}
                </p>
                <p className="mt-2 truncate text-[16px] leading-[1.45] tracking-[-0.02em] text-white/78">
                  {displayValue(value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StudentPageShell>
  );
}
