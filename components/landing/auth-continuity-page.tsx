import Link from "next/link";

import { GlassButton } from "@/components/landing/glass-button";
import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";

type AuthContinuityPageProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export function AuthContinuityPage({
  eyebrow,
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: AuthContinuityPageProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main className="grid min-h-dvh place-items-center px-5 py-10 sm:px-8 lg:px-14">
        <section className="mw-panel w-full max-w-[460px] p-[var(--mw-space-lg)] text-center sm:p-[var(--mw-space-xl)]">
          <Link
            className="mw-wordmark"
            href="/"
          >
            ModuleWyse
          </Link>

          <p className="mw-label mt-[var(--mw-space-xxl)]">
            {eyebrow}
          </p>
          <h1 className="mw-display-section mt-[var(--mw-space-md)] text-[var(--mw-ink)]">
            {title}
          </h1>
          <p className="mw-body-copy mt-[var(--mw-space-md)]">
            {body}
          </p>

          <div className="mt-8 grid gap-3">
            <GlassButton href={primaryHref}>{primaryLabel}</GlassButton>
            <GlassButton href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </GlassButton>
          </div>
        </section>
      </main>
    </>
  );
}
