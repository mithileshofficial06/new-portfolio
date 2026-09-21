"use client";

import { motion, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Simple fade + rise, for everything that isn't display type. */
export function Rise({
  children,
  play,
  delay = 0,
  y = 20,
  className = "",
}: {
  children: React.ReactNode;
  play: boolean;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
