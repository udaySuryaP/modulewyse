import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[14px] font-normal leading-[1.4] tracking-[-0.01em] text-white/72">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 rounded-[12px] border border-white/18 bg-white px-4 text-[16px] font-normal text-black outline-none placeholder:text-black/45 focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
      {...props}
    />
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 rounded-[12px] border border-white/18 bg-white px-4 text-[16px] font-normal text-black outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FormMessage({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "success" | "muted";
}) {
  return (
    <p
      className={cn(
        "text-center text-[14px] font-normal leading-[1.4] tracking-[-0.01em]",
        tone === "error" && "text-red-200",
        tone === "success" && "text-[#A8F5A0]",
        tone === "muted" && "text-white/55",
      )}
    >
      {children}
    </p>
  );
}
