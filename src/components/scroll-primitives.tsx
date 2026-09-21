"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Enters when it first scrolls into view, then stays. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a string into words and slides each out from behind its own mask as
 * the block scrolls in.
 *
 * One `useInView` on the wrapper drives every word, rather than giving each
 * word its own `whileInView`. Per-word viewport props did not fire at all
 * here — and even working, a four-line statement would have meant thirty
 * IntersectionObservers for one paragraph.
 */
export function RevealWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-8% 0px -8% 0px" });
  const words = text.split(" ");
  const shown = inView || reduceMotion;

  return (
    <span ref={wrap} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={reduceMotion ? false : { y: "110%" }}
              animate={shown ? { y: "0%" } : { y: "110%" }}
              transition={{
                duration: reduceMotion ? 0 : 1,
                ease: EASE,
                delay: reduceMotion ? 0 : delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
}

/** A hairline that draws itself across when it scrolls in. */
export function DrawLine({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`bg-line h-px w-full origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    />
  );
}

/** Counts from zero to `value` the first time it appears. */
export function CountUp({
  value,
  duration = 1.6,
  plain = false,
  className = "",
}: {
  value: number;
  duration?: number;
  plain?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const node = useRef<HTMLSpanElement>(null);
  const inView = useInView(node, { once: true, margin: "-15% 0px" });

  // Seeded only from `plain`, which is identical on both sides of hydration.
  // Seeding from `reduceMotion` printed 0 on the server and the final value
  // on a reduced-motion client — a text mismatch that threw React #418.
  const [display, setDisplay] = useState(plain ? value : 0);

  useEffect(() => {
    if (!inView || plain) return;

    // Reduced motion collapses the duration instead of taking its own path,
    // so the first frame lands on the final value.
    const ms = reduceMotion ? 0 : duration * 1000;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = ms === 0 ? 1 : Math.min((now - start) / ms, 1);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, plain, reduceMotion]);

  return (
    <span ref={node} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}

/**
 * Section header: a mono index, the title in thin display type, and a rule
 * that draws across the remaining width.
 */
export function SectionHeading({
  index,
  title,
  aside,
  id,
}: {
  index: string;
  title: string;
  aside?: string;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <Reveal className="flex items-baseline gap-4">
        <span className="label shrink-0">{index}</span>
        <DrawLine className="translate-y-[-0.35em]" />
        {aside && <span className="label shrink-0">{aside}</span>}
      </Reveal>

      <h2 className="text-chalk mt-6 text-[clamp(2rem,6vw,4.75rem)] leading-[0.95] font-light tracking-[-0.055em] uppercase">
        <RevealWords text={title} />
      </h2>
    </div>
  );
}

/** Drifts its children against the scroll for a shallow parallax. */
export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Pulls toward the cursor while hovered, springs back on leave. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  // Always the same element — swapping to a plain div under reduced motion
  // made the server and client trees disagree. The pull is simply not wired.
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={
        reduceMotion
          ? undefined
          : (event) => {
              const box = ref.current?.getBoundingClientRect();
              if (!box) return;
              mx.set((event.clientX - (box.left + box.width / 2)) * strength);
              my.set((event.clientY - (box.top + box.height / 2)) * strength);
            }
      }
      onPointerLeave={
        reduceMotion
          ? undefined
          : () => {
              mx.set(0);
              my.set(0);
            }
      }
    >
      {children}
    </motion.div>
  );
}
