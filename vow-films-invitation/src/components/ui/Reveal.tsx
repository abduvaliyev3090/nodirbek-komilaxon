"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fades + lifts content into view once. Under `prefers-reduced-motion`
 * (MotionConfig reducedMotion="user") the movement is dropped and only a gentle fade remains.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure";
}) {
  // Indexing motion[...] with a union yields a union of component types that JSX can't call; one cast keeps it simple.
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}
