import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      className="mb-4 inline-flex h-10 items-center gap-2 rounded-full border border-[var(--mw-hairline-strong)] bg-white px-4 text-[14px] font-medium text-[var(--mw-ink)] transition-colors hover:bg-[var(--mw-surface-strong)]"
      href={href}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
