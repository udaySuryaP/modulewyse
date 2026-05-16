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
        <section className="mw-card p-5 sm:p-8">
          <p className="mw-label">Profile</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mw-display text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
                Student profile
              </h1>
              <p className="mt-3 max-w-[620px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
                Your ModuleWyse account and academic context.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="mw-pill-primary h-11" href="/settings/account">
                Edit Profile
              </Link>
              <Link className="mw-pill-outline h-11" href="/settings">
                Settings
              </Link>
              <SignoutButton />
            </div>
          </div>
        </section>

        <section className="mw-card grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {usageStats.map(([label, value]) => (
            <div
              className="rounded-2xl border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4"
              key={label}
            >
              <p className="mw-label text-[11px]">{label}</p>
              <p className="mt-3 text-[22px] font-medium leading-[1.1] text-[var(--mw-ink)]">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mw-card p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {profileRows.map(([label, value]) => (
              <div
                className="min-w-0 rounded-2xl border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4"
                key={label}
              >
                <p className="mw-label text-[11px]">{label}</p>
                <p className="mt-2 truncate text-[16px] leading-[1.5] text-[var(--mw-body)]">
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
