"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type MotionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function LiquidReveal({ children, className, delay = 0 }: MotionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      transition={{
        damping: 24,
        delay,
        duration: 0.65,
        mass: 0.9,
        stiffness: 120,
        type: "spring",
      }}
    >
      {children}
    </motion.div>
  );
}

export function LiquidGroup({ children, className }: MotionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate="show"
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function LiquidItem({ children, className }: MotionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      variants={{
        hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            damping: 22,
            duration: 0.58,
            stiffness: 130,
            type: "spring",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
