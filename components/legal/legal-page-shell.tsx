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

        <article className="mw-panel mt-[var(--mw-space-lg)] overflow-hidden">
          <header className="border-b border-[var(--mw-hairline)] bg-white p-[var(--mw-space-lg)] sm:p-[var(--mw-space-xl)]">
            <p className="mw-label text-[length:var(--mw-type-micro)]">ModuleWyse legal</p>
            <h1 className="mw-display-section mt-[var(--mw-space-md)]">
              {title}
            </h1>
            <p className="mw-body-copy mt-[var(--mw-space-md)] max-w-2xl">
              {description}
            </p>
            <p className="mw-panel-muted mt-[var(--mw-space-lg)] p-[var(--mw-space-md)] text-[length:var(--mw-type-meta)] leading-[1.55] text-[var(--mw-body)]">
              This is a practical launch draft for ModuleWyse and should be
              reviewed before a wider public launch.
            </p>
            {children}
          </header>

          <div className="grid gap-0 divide-y divide-[var(--mw-hairline)]">
            {sections.map((section) => (
              <section className="p-[var(--mw-space-lg)] sm:p-[var(--mw-space-xl)]" key={section.title}>
                <h2 className="mw-heading-sm text-[var(--mw-ink)]">
                  {section.title}
                </h2>
                <div className="mw-body-copy mt-[var(--mw-space-md)] grid gap-[var(--mw-space-sm)]">
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
