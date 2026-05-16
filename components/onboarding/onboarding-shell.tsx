import Link from "next/link";

import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";

type OnboardingShellProps = {
  step: string;
  title: string;
  body: string;
  children: React.ReactNode;
};

export function OnboardingShell({
  step,
  title,
  body,
  children,
}: OnboardingShellProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="grid min-h-dvh place-items-center px-5 py-10 sm:px-8 lg:px-14">
        <section className="mw-card w-full max-w-[560px] p-6 text-center shadow-[0_24px_80px_rgba(12,10,9,0.06)] sm:p-8">
          <Link
            className="text-[24px] font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)]"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mw-label mt-10">
            {step}
          </p>
          <h1 className="mw-display mt-4 text-[42px] leading-[1.05] text-[var(--mw-ink)]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-[460px] text-[16px] font-normal leading-[1.55] text-[var(--mw-body)]">
            {body}
          </p>

          <div className="mt-8 text-left">{children}</div>
        </section>
      </main>
    </>
  );
}
