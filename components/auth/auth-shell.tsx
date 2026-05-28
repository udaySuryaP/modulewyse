import Link from "next/link";

import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { LiquidReveal } from "@/components/motion/liquid-motion";

type AuthShellProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  children: React.ReactNode;
  showHeader?: boolean;
};

export function AuthShell({
  eyebrow,
  title,
  body,
  children,
  showHeader = true,
}: AuthShellProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <Link
        className="mw-pill-outline fixed left-[var(--mw-space-lg)] top-[var(--mw-space-md)] z-20 px-[var(--mw-space-md)] text-[length:var(--mw-type-meta)] sm:left-[var(--mw-space-xl)] sm:top-[var(--mw-space-lg)]"
        href="/"
      >
        Home
      </Link>
      <main className="grid min-h-svh place-items-center px-5 py-4 sm:min-h-dvh sm:px-8 sm:py-10 lg:px-14">
        <LiquidReveal className="mw-panel w-full max-w-[460px] p-[var(--mw-space-md)] text-center sm:p-[var(--mw-space-xl)]">
          {showHeader ? (
            <>
              <Link
                className="mw-wordmark"
                href="/"
              >
                ModuleWyse
              </Link>

              {eyebrow ? <p className="mw-label mt-[var(--mw-space-lg)] sm:mt-[var(--mw-space-xxl)]">{eyebrow}</p> : null}
              {title ? (
                <h1 className="mw-display-section mt-[var(--mw-space-sm)] text-[var(--mw-ink)] sm:mt-[var(--mw-space-md)]">
                  {title}
                </h1>
              ) : null}
              {body ? (
                <p className="mw-body-copy mt-[var(--mw-space-sm)] sm:mt-[var(--mw-space-md)]">
                  {body}
                </p>
              ) : null}
            </>
          ) : null}

          <div className={showHeader ? "mt-5 text-left sm:mt-8" : "text-left"}>
            {children}
          </div>

          <div className="mt-[var(--mw-space-lg)] flex justify-center gap-[var(--mw-space-md)] border-t border-[var(--mw-hairline)] pt-[var(--mw-space-md)] text-[length:var(--mw-type-micro)] font-medium text-[var(--mw-muted)]">
            <Link className="hover:text-[var(--mw-ink)]" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-[var(--mw-ink)]" href="/terms">
              Terms
            </Link>
          </div>
        </LiquidReveal>
      </main>
    </>
  );
}
