import { cn } from "@/lib/utils";

type GlassButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

export function GlassButton({
  children,
  href,
  type = "button",
  variant = "primary",
  className,
  onClick,
}: GlassButtonProps) {
  const classes = cn(
    "inline-flex h-10 items-center justify-center mw-radius-pill px-5 text-[14px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-primary-focus)]/20",
    variant === "primary"
      ? "bg-[var(--mw-primary)] text-white hover:bg-[var(--mw-primary-hover)]"
      : "border border-[var(--mw-ink)] bg-[var(--mw-canvas)] text-[var(--mw-ink)] hover:bg-[var(--mw-surface-card)]",
    className,
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
