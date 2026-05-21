import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type MinimalLoaderProps = {
  className?: string;
  label?: string;
  variant?: "page" | "inline" | "button";
};

const barIndexes = Array.from({ length: 12 }, (_, index) => index);

const variantStyles = {
  page: {
    bar: "h-[7px] w-0.5",
    container:
      "grid min-h-dvh place-items-center bg-[var(--mw-canvas)] px-5 py-10 text-center",
    content: "flex-col items-center gap-3",
    label: "text-[13px] text-[var(--mw-muted)]",
    offset: 10,
    size: "size-7",
  },
  inline: {
    bar: "h-[5px] w-[1.5px]",
    container: "inline-flex items-center text-left",
    content: "flex-row items-center gap-2",
    label: "text-[13px] text-[var(--mw-muted)]",
    offset: 7,
    size: "size-5",
  },
  button: {
    bar: "h-1 w-[1.5px]",
    container: "inline-flex items-center",
    content: "flex-row items-center gap-2",
    label: "text-current",
    offset: 5.5,
    size: "size-4",
  },
} as const;

function CircularBarLoader({
  label,
  variant,
}: {
  label: string;
  variant: NonNullable<MinimalLoaderProps["variant"]>;
}) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn("relative shrink-0 text-[var(--mw-primary)]", styles.size)}
    >
      {barIndexes.map((index) => (
        <span
          aria-hidden="true"
          className={cn(
            "mw-ios-loader-bar absolute left-1/2 top-1/2 mw-radius-pill bg-current",
            styles.bar,
          )}
          key={index}
          style={
            {
              animationDelay: `${index * -80}ms`,
              transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-${styles.offset}px)`,
            } satisfies CSSProperties
          }
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function MinimalLoader({
  className,
  label,
  variant = "inline",
}: MinimalLoaderProps) {
  const styles = variantStyles[variant];
  const resolvedLabel =
    label ?? (variant === "page" ? "Preparing ModuleWyse" : "Loading");

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(styles.container, className)}
      role="status"
    >
      <div className={cn("flex", styles.content)}>
        <CircularBarLoader label={resolvedLabel} variant={variant} />

        <span
          aria-hidden="true"
          className={cn("font-medium leading-none", styles.label)}
        >
          {resolvedLabel}
        </span>
      </div>
    </div>
  );
}
