import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: "available" | "beta" | "coming soon" | "coming-soon";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status === "coming-soon" ? "coming soon" : status;

  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 whitespace-nowrap mw-radius-pill px-[var(--mw-space-sm)] py-[var(--mw-space-xxs)] text-[length:var(--mw-type-micro)] font-semibold uppercase leading-none tracking-[0.08em]",
        normalizedStatus === "available" &&
          "bg-[var(--mw-surface-strong)] text-[var(--mw-ink)]",
        normalizedStatus === "beta" &&
          "bg-[var(--mw-surface-lift)] text-[var(--mw-ink)]",
        normalizedStatus === "coming soon" && "bg-[var(--mw-surface-strong)] text-[var(--mw-muted)]",
      )}
    >
      {normalizedStatus}
    </span>
  );
}
