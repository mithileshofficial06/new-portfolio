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
 * Section headers.
 *
 * Every band used the same lockup — mono index, hairline, big uppercase
 * display — so the page read as one long section no matter what the words
 * said. Each variant below is a different piece of typography, and a section
 * is recognisable from its header alone.
 */
type HeadingVariant = "rule" | "serif" | "outline" | "split" | "center";

export function SectionHeading({
  index,
  title,
  aside,
  id,
  variant = "rule",
}: {
  index: string;
  title: string;
  aside?: string;
  id?: string;
  variant?: HeadingVariant;
}) {
  const body = {
    rule: <RuleHeading index={index} title={title} aside={aside} />,
    serif: <SerifHeading index={index} title={title} aside={aside} />,
    outline: <OutlineHeading index={index} title={title} aside={aside} />,
    split: <SplitHeading index={index} title={title} aside={aside} />,
    center: <CenterHeading index={index} title={title} aside={aside} />,
  }[variant];

  return (
    <div id={id} className="scroll-mt-28">
      {body}
    </div>
  );
}

type Parts = { index: string; title: string; aside?: string };

/** 01 — index, rule, aside, then the title beneath at full width. */
function RuleHeading({ index, title, aside }: Parts) {
  return (
    <>
      <Reveal className="flex items-baseline gap-4">
        <span className="label shrink-0">{index}</span>
        <DrawLine className="translate-y-[-0.35em]" />
        {aside && <span className="label shrink-0">{aside}</span>}
      </Reveal>

      <h2 className="text-chalk mt-6 text-[clamp(2rem,6vw,4.75rem)] leading-[0.95] font-light tracking-[-0.055em] uppercase">
        <RevealWords text={title} />
      </h2>
    </>
  );
}

/**
 * 02 — the serif voice, set lower case and italic. The only header on the
 * page that is neither grotesk nor uppercase.
 */
function SerifHeading({ index, title, aside }: Parts) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
      <Reveal className="flex shrink-0 items-center gap-3 pt-3">
        <span className="border-line text-ash flex size-11 items-center justify-center rounded-full border font-mono text-[11px] tracking-[0.1em]">
          {index}
        </span>
        {aside && <span className="label sm:hidden">{aside}</span>}
      </Reveal>

      <div className="min-w-0">
        <h2 className="text-chalk font-serif text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.02em] italic">
          <RevealWords text={title} />
        </h2>
        {aside && (
          <Reveal delay={0.15} y={14}>
            <p className="label mt-4 hidden sm:block">{aside}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/**
 * 03 — outlined display type over a ghost numeral. Hovering fills the
 * letters, so the header answers the pointer the way the tiles below it do.
 */
function OutlineHeading({ index, title, aside }: Parts) {
  return (
    <div className="group relative">
      <span
        aria-hidden
        className="font-display text-line pointer-events-none absolute -top-6 -left-2 text-[clamp(7rem,18vw,15rem)] leading-none tracking-[-0.06em] opacity-40 select-none md:-top-12"
      >
        {index}
      </span>

      <div className="relative">
        <h2 className="font-display text-[clamp(2.2rem,8.5vw,7rem)] leading-[0.9] tracking-[-0.055em] text-transparent uppercase transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [-webkit-text-stroke:1px_var(--color-ash)] group-hover:text-chalk">
          <RevealWords text={title} />
        </h2>
        {aside && (
          <Reveal delay={0.2} y={14} className="mt-6 flex items-center gap-4">
            <span className="label shrink-0">{aside}</span>
            <DrawLine delay={0.3} />
          </Reveal>
        )}
      </div>
    </div>
  );
}

/** 04 — title left, a heavy numeral right, ruled above and below. */
function SplitHeading({ index, title, aside }: Parts) {
  return (
    <div>
      <DrawLine />
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-7 md:py-9">
        <div className="min-w-0">
          {aside && (
            <Reveal y={12}>
              <p className="label mb-4">{aside}</p>
            </Reveal>
          )}
          <h2 className="text-chalk text-[clamp(1.9rem,5.2vw,4rem)] leading-[1] font-light tracking-[-0.045em]">
            <RevealWords text={title} />
          </h2>
        </div>

        <Reveal delay={0.12} y={18} className="shrink-0">
          <span
            aria-hidden
            className="font-display text-ash/45 text-[clamp(3.5rem,9vw,7rem)] leading-[0.8] tabular-nums"
          >
            {index}
          </span>
        </Reveal>
      </div>
      <DrawLine delay={0.2} />
    </div>
  );
}

/** 05 — centred, with the index held between two rules that draw outward. */
function CenterHeading({ index, title, aside }: Parts) {
  return (
    <div className="flex flex-col items-center text-center">
      <Reveal className="flex w-full max-w-3xl items-center gap-5">
        <DrawLine className="origin-right" />
        <span className="label shrink-0">{index}</span>
        <DrawLine />
      </Reveal>

      <h2 className="text-chalk mt-7 text-[clamp(2rem,6vw,4.75rem)] leading-[0.95] font-light tracking-[-0.055em] uppercase">
        <RevealWords text={title} />
      </h2>

      {aside && (
        <Reveal delay={0.18} y={14}>
          <p className="label mt-5">{aside}</p>
        </Reveal>
      )}
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
