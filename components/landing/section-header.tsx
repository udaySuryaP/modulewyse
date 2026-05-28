import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-[720px]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="mw-label">{eyebrow}</p>
      <h2 className="mw-display-section mt-[var(--mw-space-md)]">{title}</h2>
      {description ? (
        <p className="mw-body-copy mt-[var(--mw-space-lg)]">{description}</p>
      ) : null}
    </div>
  );
}
