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
    "inline-flex h-11 items-center justify-center rounded-[12px] px-5 font-mono text-[14px] font-medium uppercase tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
    variant === "primary"
      ? "bg-white text-black hover:bg-white/88"
      : "border border-white/18 bg-white/10 text-white hover:bg-white/16",
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
