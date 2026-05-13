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
        className="fixed left-5 top-4 z-20 inline-flex h-10 items-center justify-center rounded-[12px] border border-white/18 bg-white/10 px-4 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-white backdrop-blur-[18px] sm:left-8 sm:top-6 sm:h-11 sm:px-5 sm:text-[14px]"
        href="/"
      >
        Home
      </Link>
      <main className="grid min-h-svh place-items-center px-5 py-4 sm:min-h-dvh sm:px-8 sm:py-10 lg:px-14">
        <LiquidReveal className="w-full max-w-[460px] rounded-[12px] border border-white/18 bg-white/12 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[28px] sm:p-8">
          <Link
            className="text-[20px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[24px]"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mt-5 text-[12px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55 sm:mt-10 sm:text-[14px]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[28px] font-normal leading-[1.1] tracking-[-0.03em] text-white sm:mt-4 sm:text-[36px]">
            {title}
          </h1>
          <p className="mt-3 text-[14px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72 sm:mt-4 sm:text-[16px]">
            {body}
          </p>

          <div className="mt-5 text-left sm:mt-8">{children}</div>
        </LiquidReveal>
      </main>
    </>
  );
}
