import { PageOverlay } from "@/components/landing/page-overlay";
import { VideoBackground } from "@/components/landing/video-background";
import { cn } from "@/lib/utils";

type AppLoadingProps = {
  className?: string;
  label?: string;
};

export function AppLoading({
  className,
  label = "Preparing your workspace",
}: AppLoadingProps) {
  return (
    <>
      <VideoBackground />
      <PageOverlay />
      <main
        aria-busy="true"
        aria-live="polite"
        className={cn(
          "grid min-h-dvh place-items-center px-5 py-10 text-[var(--mw-ink)]",
          className,
        )}
      >
        <section className="mw-card w-full max-w-[420px] p-6 text-center shadow-[0_24px_80px_rgba(12,10,9,0.06)] sm:p-8">
          <div
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]"
          >
            <span className="size-6 animate-spin mw-radius-pill border-2 border-[var(--mw-hairline-strong)] border-t-[var(--mw-ink)]" />
          </div>

          <p className="mw-label mt-6">ModuleWyse</p>
          <h1 className="mw-display mt-3 text-[34px] leading-[1.05] text-[var(--mw-ink)]">
            {label}
          </h1>
          <p className="mt-3 text-[14px] leading-[1.55] text-[var(--mw-body)]">
            Loading your study context, saved chats, and academic workspace.
          </p>

          <div className="mt-6 grid gap-2" aria-hidden="true">
            <span className="h-2 w-full animate-pulse mw-radius-pill bg-[var(--mw-surface-strong)]" />
            <span className="mx-auto h-2 w-3/4 animate-pulse mw-radius-pill bg-[var(--mw-surface-strong)]" />
          </div>
        </section>
      </main>
    </>
  );
}
