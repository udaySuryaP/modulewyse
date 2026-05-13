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
        "inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-white px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] text-black transition-colors hover:bg-white/88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:pointer-events-none disabled:opacity-55",
        className,
      )}
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
