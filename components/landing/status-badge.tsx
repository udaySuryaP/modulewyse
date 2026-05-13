import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: "available" | "beta" | "coming soon";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-[12px] px-3 py-1.5 text-[12px] font-normal uppercase leading-none tracking-[0.02em]",
        status === "available" && "bg-[rgba(90,225,76,0.16)] text-[#A8F5A0]",
        status === "beta" && "bg-[rgba(215,160,119,0.18)] text-[#F8D1B1]",
        status === "coming soon" && "bg-white/12 text-white/55",
      )}
    >
      {status}
    </span>
  );
}
