import Link from "next/link";

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
    "inline-flex h-10 items-center justify-center mw-radius-pill px-5 text-[15px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mw-ink)]/20",
    variant === "primary"
      ? "bg-[var(--mw-primary)] text-white hover:bg-[var(--mw-ink)]"
      : "border border-[var(--mw-hairline-strong)] bg-transparent text-[var(--mw-ink)] hover:bg-[var(--mw-surface-strong)]",
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
