"use client";

import { motion } from "motion/react";

import { MARQUEE_ITEMS } from "@/lib/content";

import { useIntroReady } from "./intro-context";



export function Marquee() {
  const ready = useIntroReady();

  return (
    <motion.div
      className="border-line/80 pause-on-hover relative overflow-hidden border-y"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 1, delay: 1.35 }}
    >
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="text-smoke flex items-center gap-8 px-6 py-3.5 font-mono text-[11px] tracking-[0.22em] whitespace-nowrap uppercase"
              >
                {item}
                <span className="bg-line h-1 w-1 rotate-45" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Feather the ends so items enter and leave the void. */}
      <div className="from-void pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent" />
      <div className="from-void pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent" />
    </motion.div>
  );
}
