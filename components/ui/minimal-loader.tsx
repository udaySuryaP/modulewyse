import { cn } from "@/lib/utils";

type MinimalLoaderProps = {
  className?: string;
  label?: string;
  showBrand?: boolean;
  variant?: "page" | "inline" | "button";
};

const variantStyles = {
  page: {
    container:
      "grid min-h-dvh place-items-center bg-[var(--mw-canvas)] px-5 py-10 text-center",
    content: "flex-col items-center gap-3",
    label: "text-[13px] text-[var(--mw-muted)]",
  },
  inline: {
    container: "inline-flex items-center text-left",
    content: "flex-row items-center gap-2",
    label: "text-[13px] text-[var(--mw-muted)]",
  },
  button: {
    container: "inline-flex items-center",
    content: "flex-row items-center gap-2",
    label: "text-current",
  },
} as const;

export function MinimalLoader({
  className,
  label = "Loading",
  showBrand = false,
  variant = "inline",
}: MinimalLoaderProps) {
  const styles = variantStyles[variant];

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(styles.container, className)}
      role="status"
    >
      <div className={cn("flex", styles.content)}>
        {showBrand ? (
          <span className="mw-label text-[11px]">modulewyse</span>
        ) : null}

        <span className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span className="size-1.5 mw-radius-pill bg-[var(--mw-primary)] motion-safe:animate-pulse" />
          <span className="size-1.5 mw-radius-pill bg-[var(--mw-muted)] motion-safe:animate-pulse [animation-delay:120ms]" />
          <span className="size-1.5 mw-radius-pill bg-[var(--mw-muted-soft)] motion-safe:animate-pulse [animation-delay:240ms]" />
        </span>

        <span className={cn("font-medium leading-none", styles.label)}>
          {label}
        </span>
      </div>
    </div>
  );
}
