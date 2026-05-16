import Link from "next/link";

import { SignoutButton } from "@/components/auth/signout-button";
import { StudentPageShell } from "@/components/dashboard/student-page-shell";

const settingsCards = [
  {
    href: "/settings/account",
    label: "Account",
    title: "Name and email",
    body: "Update your student profile name and review your account email.",
  },
  {
    href: "/settings/academic",
    label: "Academic",
    title: "College and subject context",
    body: "Manage college, graduation year, branch, semester, and focus subject.",
  },
  {
    href: "/settings/preferences",
    label: "Preferences",
    title: "Local study defaults",
    body: "Save answer style and interface defaults on this device.",
  },
] as const;

export default function SettingsPage() {
  return (
    <StudentPageShell>
      <div className="grid gap-4">
        <section className="mw-card p-5 sm:p-8">
          <p className="mw-label">
            Settings
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mw-display text-[40px] leading-[1.05] text-[var(--mw-ink)] sm:text-[52px]">
                Student settings
              </h1>
              <p className="mt-3 max-w-[620px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
                Manage your account, academic setup, and local study
                preferences.
              </p>
            </div>
            <SignoutButton />
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-3">
          {settingsCards.map((card) => (
            <Link
              className="mw-card mw-card-hover p-5"
              href={card.href}
              key={card.href}
            >
              <p className="mw-label text-[11px]">
                {card.label}
              </p>
              <h2 className="mt-4 text-[22px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                {card.title}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.5] text-[var(--mw-body)]">
                {card.body}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </StudentPageShell>
  );
}
