import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeatureTileProps = {
  label: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export function FeatureTile({
  label,
  title,
  description,
  children,
  className,
}: FeatureTileProps) {
  return (
    <article className={cn("mw-panel p-[var(--mw-space-lg)]", className)}>
      {children ? (
        <div className="mb-[var(--mw-space-xl)]">{children}</div>
      ) : null}
      <p className="mw-label">{label}</p>
      <h3 className="mw-heading-sm mt-[var(--mw-space-md)]">{title}</h3>
      <p className="mw-meta mt-[var(--mw-space-sm)]">{description}</p>
    </article>
  );
}
