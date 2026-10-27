"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  className?: string;
  y?: number;
}

/**
 * Small wrapper that fades/slides content in once when it scrolls into view.
 * Reduced motion is handled globally by MotionProvider.
 */
export function Reveal({ children, delay = 0, className, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
