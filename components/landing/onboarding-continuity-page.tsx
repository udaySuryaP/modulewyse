import Link from "next/link";

import { ContinueFlowButton } from "@/components/landing/continue-flow-button";
import { GlassButton } from "@/components/landing/glass-button";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";

type OnboardingContinuityPageProps = {
  step: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref?: string;
  finalStep?: boolean;
};

export function OnboardingContinuityPage({
  step,
  title,
  body,
  primaryLabel,
  primaryHref,
  finalStep = false,
}: OnboardingContinuityPageProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="grid min-h-dvh place-items-center px-5 py-10">
        <section className="w-full max-w-[560px] rounded-[12px] border border-white/18 bg-white/12 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[28px] sm:p-8">
          <Link
            className="text-[24px] font-normal leading-none tracking-[-0.03em] text-white"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mt-10 text-[14px] font-normal uppercase leading-[1.4] tracking-[0.02em] text-white/55">
            {step}
          </p>
          <h1 className="mt-4 text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-[460px] text-[16px] font-normal leading-[1.45] tracking-[-0.02em] text-white/72">
            {body}
          </p>

          <div className="mt-8">
            {finalStep ? (
              <ContinueFlowButton className="w-full">
                {primaryLabel}
              </ContinueFlowButton>
            ) : (
              <GlassButton className="w-full" href={primaryHref}>
                {primaryLabel}
              </GlassButton>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
