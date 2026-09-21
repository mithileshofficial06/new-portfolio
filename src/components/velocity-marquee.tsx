"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

/** Keeps a value inside [min, max) by wrapping it round. */
const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/**
 * A band of type that always drifts, speeds up with the scroll, and reverses
 * when the scroll reverses. The one element on the page that reacts to how
 * fast you're moving rather than just how far.
 */
export function VelocityMarquee({
  text = "Developer ✦ Designer ✦ Chennai ✦ Available for work ✦ ",
  baseSpeed = 2.2,
}: {
  text?: string;
  baseSpeed?: number;
}) {
  const reduceMotion = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 380,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  // Four copies, so wrapping a quarter of the track is seamless.
  const x = useTransform(baseX, (value) => `${wrap(-25, 0, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;

    let moveBy = direction.current * baseSpeed * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      aria-hidden
      className="border-line/60 relative overflow-hidden border-y py-6 md:py-9"
    >
      <motion.div
        className="flex w-max whitespace-nowrap"
        style={reduceMotion ? undefined : { x }}
      >
        {[0, 1, 2, 3].map((copy) => (
          <span
            key={copy}
            className="text-chalk px-2 text-[clamp(2rem,7vw,6rem)] leading-none font-extralight tracking-[-0.055em] uppercase"
          >
            {text}
          </span>
        ))}
      </motion.div>

      {/* Feather the ends into the page. */}
      <div className="from-void pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r to-transparent" />
      <div className="from-void pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l to-transparent" />
    </div>
  );
}
