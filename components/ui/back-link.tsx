import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BackLinkProps = {
  className?: string;
  href: string;
  label?: string;
};

export function BackLink({ className, href, label = "Back" }: BackLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-10 items-center gap-2 mw-radius-pill border border-[var(--mw-hairline-strong)] bg-white px-4 text-[14px] font-medium text-[var(--mw-ink)] transition-colors hover:bg-[var(--mw-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mw-primary)]",
        className,
      )}
      href={href}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
