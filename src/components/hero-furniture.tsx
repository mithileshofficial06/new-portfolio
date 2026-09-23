"use client";

import { motion } from "motion/react";

import { useIntroReady } from "./intro-context";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Technical tick marks at the corners of the content frame. */
export function Crosshairs() {
  const ready = useIntroReady();
  const spots = [
    "left-5 top-24 md:left-9",
    "right-5 top-24 md:right-9",
    "left-5 bottom-16 md:left-9",
    "right-5 bottom-16 md:right-9",
  ];

  return (
    <>
      {spots.map((spot, i) => (
        <motion.span
          key={spot}
          aria-hidden
          className={`text-line absolute z-30 hidden text-xs select-none md:block ${spot}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 1.5 + i * 0.07 }}
        >
          ✛
        </motion.span>
      ))}
    </>
  );
}

/** Rotated text running up the left and right gutters. */
export function Rail({
  side,
  children,
  delay = 1.5,
}: {
  side: "left" | "right";
  children: React.ReactNode;
  delay?: number;
}) {
  const ready = useIntroReady();

  return (
    <motion.div
      aria-hidden
      className={`absolute top-1/2 z-30 hidden -translate-y-1/2 lg:block ${
        side === "left" ? "left-9" : "right-9"
      }`}
      initial={{ opacity: 0, y: "-40%" }}
      animate={ready ? { opacity: 1, y: "-50%" } : undefined}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      <span
        className="label whitespace-nowrap"
        style={{
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : undefined,
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

/** A small mono readout — used for the stat pair flanking the name. */
export function Stat({
  value,
  label,
  align = "left",
  delay = 1.4,
}: {
  value: string;
  label: string;
  /** "center" centres below lg only — the desktop row stays flush left. */
  align?: "left" | "right" | "center";
  delay?: number;
}) {
  const ready = useIntroReady();
  const alignment = {
    left: "text-left",
    right: "text-right",
    center: "text-center lg:text-left",
  }[align];

  return (
    <motion.div
      className={alignment}
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <p className="text-chalk font-mono text-lg leading-none tracking-[-0.02em] tabular-nums sm:text-xl md:text-2xl">
        {value}
      </p>
      <p className="label mt-2 text-[10px] leading-snug tracking-[0.14em] sm:text-[0.6875rem] sm:tracking-[0.22em]">
        {label}
      </p>
    </motion.div>
  );
}
