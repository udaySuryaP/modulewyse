import { cn } from "@/lib/utils";

type MotionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function LiquidReveal({ children, className }: MotionProps) {
  return <div className={className}>{children}</div>;
}

export function LiquidGroup({ children, className }: MotionProps) {
  return <div className={className}>{children}</div>;
}

export function LiquidItem({ children, className }: MotionProps) {
  return <div className={cn("will-change-auto", className)}>{children}</div>;
}
