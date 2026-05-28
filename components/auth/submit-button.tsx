import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 w-full items-center justify-center mw-radius-pill bg-[var(--mw-primary)] px-[var(--mw-space-lg)] text-[length:var(--mw-type-link)] font-semibold text-white transition-colors hover:bg-[var(--mw-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-primary-focus)]/20 disabled:pointer-events-none disabled:opacity-55 sm:h-11",
        className,
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
