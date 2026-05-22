import Link from "next/link";
import type { ReactNode } from "react";

import { BackLink } from "@/components/ui/back-link";

type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalPageShellProps = {
  children?: ReactNode;
  description: string;
  sections: LegalSection[];
  title: string;
};

export function LegalPageShell({
  children,
  description,
  sections,
  title,
}: LegalPageShellProps) {
  return (
    <main className="min-h-dvh bg-[var(--mw-canvas)] px-4 py-6 text-[var(--mw-ink)] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <BackLink href="/" label="Back to home" />

        <article className="mt-6 mw-card overflow-hidden">
          <header className="border-b border-[var(--mw-hairline)] bg-white p-5 sm:p-8">
            <p className="mw-label text-[11px]">ModuleWyse legal</p>
            <h1 className="mw-display mt-4 text-[42px] leading-[1.05] sm:text-[58px]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-[var(--mw-body)] sm:text-[16px]">
              {description}
            </p>
            <p className="mt-5 mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)] p-4 text-[13px] leading-[1.55] text-[var(--mw-body)]">
              This is a practical launch draft for ModuleWyse and should be
              reviewed before a wider public launch.
            </p>
            {children}
          </header>

          <div className="grid gap-0 divide-y divide-[var(--mw-hairline)]">
            {sections.map((section) => (
              <section className="p-5 sm:p-8" key={section.title}>
                <h2 className="text-[24px] font-medium leading-[1.2] text-[var(--mw-ink)]">
                  {section.title}
                </h2>
                <div className="mt-4 grid gap-3 text-[14px] leading-[1.65] text-[var(--mw-body)] sm:text-[15px]">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </article>

        <footer className="flex flex-wrap gap-x-4 gap-y-2 px-1 py-6 text-[13px] text-[var(--mw-muted)]">
          <Link className="hover:text-[var(--mw-ink)]" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-[var(--mw-ink)]" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-[var(--mw-ink)]" href="/">
            ModuleWyse
          </Link>
        </footer>
      </div>
    </main>
  );
}
