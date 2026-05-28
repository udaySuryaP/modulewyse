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
      <main className="grid min-h-dvh place-items-center px-5 py-10 sm:px-8 lg:px-14">
        <section className="mw-panel w-full max-w-[560px] p-[var(--mw-space-lg)] text-center sm:p-[var(--mw-space-xl)]">
          <Link
            className="mw-wordmark"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mw-label mt-[var(--mw-space-xxl)]">
            {step}
          </p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] text-[var(--mw-ink)]">
            {title}
          </h1>
          <p className="mw-body-copy mx-auto mt-[var(--mw-space-md)] max-w-[460px]">
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
