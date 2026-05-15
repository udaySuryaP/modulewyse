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
        <section className="rounded-[12px] border border-white/18 bg-white/12 p-5 backdrop-blur-[28px] sm:p-8">
          <p className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
            Settings
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[32px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
                Student settings
              </h1>
              <p className="mt-3 max-w-[620px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
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
              className="rounded-[12px] border border-white/18 bg-white/10 p-5 text-white backdrop-blur-[28px] transition-colors hover:bg-white/14"
              href={card.href}
              key={card.href}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
                {card.label}
              </p>
              <h2 className="mt-4 text-[22px] font-normal leading-[1.15] tracking-[-0.03em]">
                {card.title}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.45] tracking-[-0.01em] text-white/68">
                {card.body}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </StudentPageShell>
  );
}
