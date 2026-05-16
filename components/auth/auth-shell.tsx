import Link from "next/link";

import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { LiquidReveal } from "@/components/motion/liquid-motion";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, body, children }: AuthShellProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <Link
        className="mw-pill-outline fixed left-5 top-4 z-20 px-4 text-[13px] sm:left-8 sm:top-6"
        href="/"
      >
        Home
      </Link>
      <main className="grid min-h-svh place-items-center px-5 py-4 sm:min-h-dvh sm:px-8 sm:py-10 lg:px-14">
        <LiquidReveal className="mw-card w-full max-w-[460px] p-4 text-center shadow-[0_24px_80px_rgba(12,10,9,0.06)] sm:p-8">
          <Link
            className="text-[20px] font-medium leading-none tracking-[-0.03em] text-[var(--mw-ink)] sm:text-[24px]"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mw-label mt-5 sm:mt-10">
            {eyebrow}
          </p>
          <h1 className="mw-display mt-3 text-[32px] leading-[1.05] text-[var(--mw-ink)] sm:mt-4 sm:text-[42px]">
            {title}
          </h1>
          <p className="mt-3 text-[14px] font-normal leading-[1.55] text-[var(--mw-body)] sm:mt-4 sm:text-[16px]">
            {body}
          </p>

          <div className="mt-5 text-left sm:mt-8">{children}</div>
        </LiquidReveal>
      </main>
    </>
  );
}
