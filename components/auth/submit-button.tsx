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
        "inline-flex h-10 w-full items-center justify-center rounded-full bg-[var(--mw-primary)] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--mw-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20 disabled:pointer-events-none disabled:opacity-55 sm:h-11",
        className,
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
