import Link from "next/link";
import { redirect } from "next/navigation";

import { SignoutButton } from "@/components/auth/signout-button";
import { StudentPageShell } from "@/components/dashboard/student-page-shell";
import { PreferencesSummary } from "@/components/settings/preferences-summary";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getStudentActivityStats } from "@/lib/data/activity";

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  return String(value);
}

function SummaryRows({
  rows,
}: {
  rows: readonly (readonly [string, string | number | null | undefined])[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div
          className="min-w-0 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4"
          key={label}
        >
          <p className="mw-label text-[11px]">{label}</p>
          <p className="mt-2 truncate text-[15px] leading-[1.45] text-[var(--mw-body)]">
            {displayValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function SettingsPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login?next=/settings");
  }

  const email = profile.email || user.email || "";
  const onboardingState = profile.onboarding_completed ? "Complete" : "Incomplete";
  const activityStats = await getStudentActivityStats(user.id);

  const profileRows = [
    ["Full name", profile.full_name],
    ["Email", email],
    ["Academic setup", onboardingState],
  ] as const;

  const accountRows = [
    ["Full name", profile.full_name],
    ["Email", email],
  ] as const;

  const academicRows = [
    ["College", profile.college_name],
    ["Graduation year", profile.graduation_year],
    ["Branch", profile.branch],
    ["Semester", profile.semester ? `S${profile.semester}` : null],
  ] as const;

  const usageStats = [
    ["Conversations", activityStats.conversations],
    ["Questions asked", activityStats.questionsAsked],
    ["Answers generated", activityStats.answersGenerated],
    ["Subjects used", activityStats.subjectsUsed],
    ["Feedback given", activityStats.feedbackGiven],
  ] as const;

  return (
    <StudentPageShell>
      <div className="grid gap-4">
        <section className="mw-card p-5 sm:p-8">
          <p className="mw-label">Settings</p>
          <div className="mt-4">
            <div>
              <h1 className="mw-display text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
                Account and settings
              </h1>
              <p className="mt-3 max-w-[660px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
                Manage your ModuleWyse profile, academic context, local study
                preferences, and session.
              </p>
            </div>
          </div>
        </section>

        <section className="mw-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mw-label text-[11px]">Profile Summary</p>
              <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                Student identity
              </h2>
            </div>
            <span className="mw-badge w-fit">{onboardingState}</span>
          </div>
          <div className="mt-5">
            <SummaryRows rows={profileRows} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="mw-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mw-label text-[11px]">Academic Profile</p>
                <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                  Study context
                </h2>
              </div>
              <Link className="mw-pill-outline h-10" href="/settings/academic">
                Edit Academic Details
              </Link>
            </div>
            <div className="mt-5">
              <SummaryRows rows={academicRows} />
            </div>
          </div>

          <div className="mw-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mw-label text-[11px]">Account</p>
                <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                  Name and email
                </h2>
              </div>
              <Link className="mw-pill-outline h-10" href="/settings/account">
                Edit Account
              </Link>
            </div>
            <div className="mt-5">
              <SummaryRows rows={accountRows} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="mw-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mw-label text-[11px]">Preferences</p>
                <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                  Local study defaults
                </h2>
                <p className="mt-2 max-w-[560px] text-[14px] leading-[1.55] text-[var(--mw-body)]">
                  These preferences are saved on this device for now.
                </p>
              </div>
              <Link className="mw-pill-outline h-10" href="/settings/preferences">
                Edit Preferences
              </Link>
            </div>
            <div className="mt-5">
              <PreferencesSummary />
            </div>
          </div>

          <div className="mw-card p-5 sm:p-6">
            <p className="mw-label text-[11px]">Usage Snapshot</p>
            <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
              Basic activity
            </h2>
            <p className="mt-2 text-[14px] leading-[1.55] text-[var(--mw-body)]">
              These counters update from your saved conversations, messages,
              and feedback.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {usageStats.map(([label, value]) => (
                <div
                  className="mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4"
                  key={label}
                >
                  <p className="mw-label text-[11px]">{label}</p>
                  <p className="mt-2 text-[20px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mw-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="mw-label text-[11px]">Session</p>
            <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
              Sign out
            </h2>
            <p className="mt-2 max-w-[560px] text-[14px] leading-[1.55] text-[var(--mw-body)]">
              End this browser session when you are done using ModuleWyse.
            </p>
          </div>
          <SignoutButton />
        </section>

        <section className="mw-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="mw-label text-[11px]">Legal</p>
            <h2 className="mt-3 text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
              Policies and terms
            </h2>
            <p className="mt-2 max-w-[560px] text-[14px] leading-[1.55] text-[var(--mw-body)]">
              Review how ModuleWyse handles privacy, AI study support, and
              service terms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="mw-pill-outline h-10" href="/privacy">
              Privacy
            </Link>
            <Link className="mw-pill-outline h-10" href="/terms">
              Terms
            </Link>
          </div>
        </section>
      </div>
    </StudentPageShell>
  );
}
