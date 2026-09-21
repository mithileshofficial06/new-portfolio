"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/** The headings it walks between, in page order. */
const STOPS = ["work", "about", "stack", "credentials", "why", "contact"];

/** Where the figure rests relative to a heading's top edge. */
const REST_OFFSET = 26;

type Limb = { rotate: number[] } | { rotate: number };

/**
 * A suited figure walking the right-hand margin.
 *
 * Built as a shaded vector rather than a real mesh: the page carries no 3D
 * runtime, and a 600 KB renderer for a 90 px mascot is a bad trade. Volume
 * comes from the gradients, a rim light down the left of every part, and a
 * perspective tilt that leans into travel — at this size it reads as solid.
 */
function Figure({ walking }: { walking: boolean }) {
  const swing = (forward: boolean): Limb =>
    walking ? { rotate: forward ? [16, -16] : [-16, 16] } : { rotate: 0 };

  const cycle = {
    duration: 0.62,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  };

  const hinge = { transformBox: "fill-box" as const, transformOrigin: "50% 8%" };

  return (
    <svg
      viewBox="0 0 84 152"
      className="w-full drop-shadow-[0_20px_26px_rgba(0,0,0,0.6)]"
    >
      <defs>
        <linearGradient id="tr-suit" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#35353c" />
          <stop offset="0.45" stopColor="#17171a" />
          <stop offset="1" stopColor="#08080a" />
        </linearGradient>
        <linearGradient id="tr-limb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2a30" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <linearGradient id="tr-skin" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#b6b6bd" />
          <stop offset="0.6" stopColor="#8a8a92" />
          <stop offset="1" stopColor="#5c5c64" />
        </linearGradient>
        <linearGradient id="tr-shirt" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#b9b9c1" />
        </linearGradient>
      </defs>

      {/* Contact shadow on the floor. */}
      <motion.ellipse
        cx="42"
        cy="147"
        rx="17"
        ry="3.4"
        fill="#000"
        opacity="0.55"
        animate={walking ? { rx: [17, 13], opacity: [0.55, 0.4] } : { rx: 17 }}
        transition={walking ? cycle : { duration: 0.4 }}
      />

      {/* Everything above the floor bobs together. */}
      <motion.g
        animate={{ y: walking ? [0, -2.4] : [0, -1.4] }}
        transition={
          walking
            ? cycle
            : { duration: 2.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
      >
        {/* Far arm and far leg sit behind the jacket. */}
        <motion.g style={hinge} animate={swing(false)} transition={cycle}>
          <rect x="17" y="56" width="8.5" height="40" rx="4.25" fill="#0b0b0d" />
          <circle cx="21.2" cy="98" r="4.6" fill="#4e4e56" />
        </motion.g>

        <motion.g style={hinge} animate={swing(false)} transition={cycle}>
          <rect x="33" y="96" width="9.5" height="42" rx="4" fill="#0d0d10" />
          <path d="M31 134h13.5v7.5a2 2 0 0 1-2 2H31Z" fill="#141418" />
        </motion.g>

        {/* Near leg. */}
        <motion.g style={hinge} animate={swing(true)} transition={cycle}>
          <rect x="43" y="96" width="9.5" height="42" rx="4" fill="url(#tr-limb)" />
          <path d="M41 134h13.5v7.5a2 2 0 0 1-2 2H41Z" fill="#1c1c20" />
        </motion.g>

        {/* Jacket. */}
        <path
          d="M25 57c3.5-6.5 9.5-10 17-10s13.5 3.5 17 10l4.5 42c-13.5 6-29 6-43 0Z"
          fill="url(#tr-suit)"
        />
        {/* Rim light down the lit edge. */}
        <path
          d="M25 57c3.5-6.5 9.5-10 17-10"
          fill="none"
          stroke="#8f8f98"
          strokeOpacity="0.5"
          strokeWidth="1.1"
        />

        {/* Shirt, tie, lapels. */}
        <path d="M42 47 34 55l8 24 8-24Z" fill="url(#tr-shirt)" />
        <path d="M42 55.5 38.6 60 42 79l3.4-19Z" fill="#101013" />
        <path d="M42 47 34 55l3 4 5-12Z" fill="#26262c" />
        <path d="M42 47l8 8-3 4-5-12Z" fill="#191920" />
        <circle cx="42" cy="84" r="1.1" fill="#4a4a52" />
        <circle cx="42" cy="91" r="1.1" fill="#4a4a52" />

        {/* Near arm, in front of the jacket. */}
        <motion.g style={hinge} animate={swing(true)} transition={cycle}>
          <rect x="58.5" y="56" width="8.5" height="40" rx="4.25" fill="url(#tr-limb)" />
          <circle cx="62.7" cy="98" r="4.6" fill="#77777f" />
        </motion.g>

        {/* Neck and head. */}
        <rect x="38" y="38" width="8" height="10" rx="3" fill="#6b6b73" />
        <ellipse cx="42" cy="27" rx="12.5" ry="14" fill="url(#tr-skin)" />
        {/* Hair, cut close. */}
        <path
          d="M29.7 24c0-8 5.6-13 12.3-13s12.3 5 12.3 13c-2.6-3.4-6.6-5-12.3-5s-9.7 1.6-12.3 5Z"
          fill="#111114"
        />
        <ellipse cx="42" cy="27" rx="12.5" ry="14" fill="none" stroke="#c4c4cb" strokeOpacity="0.28" />
      </motion.g>
    </svg>
  );
}

export function Traveler() {
  const reduceMotion = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState<number[]>([]);
  const [walking, setWalking] = useState(false);

  const { scrollY } = useScroll();
  const target = useMotionValue(0);
  const smooth = useSpring(target, { stiffness: 110, damping: 26, mass: 0.7 });
  const velocity = useVelocity(smooth);

  // Leans into the direction of travel, and turns a little as it goes — the
  // two together are what sell the volume.
  const lean = useTransform(velocity, [-2600, 0, 2600], [7, 0, -7], {
    clamp: true,
  });
  const turn = useTransform(velocity, [-2600, 0, 2600], [-18, 0, 18], {
    clamp: true,
  });

  // Heading offsets, measured against the track rather than the document so
  // the figure is unaffected by anything above main.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const base = track.current;
      if (!base) return;
      const origin = base.getBoundingClientRect().top + window.scrollY;

      const next = STOPS.map((id) => {
        const node = document.getElementById(id);
        if (!node) return null;
        return node.getBoundingClientRect().top + window.scrollY - origin - REST_OFFSET;
      }).filter((value): value is number => value !== null);

      setStops((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();

    // The preloader holds the page for a beat and fonts land late; both move
    // every heading. A body observer catches those without polling.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Walks from one heading to the next as the scroll carries it, then rests.
  // Smoothstep between triggers is what makes it dwell at a heading instead
  // of drifting the whole way down.
  useEffect(() => {
    if (stops.length < 2) return;

    const place = (scrolled: number) => {
      const triggers = stops.map((stop) => stop - window.innerHeight * 0.5);

      if (scrolled <= triggers[0]) return target.set(stops[0]);

      for (let i = 0; i < triggers.length - 1; i++) {
        if (scrolled < triggers[i + 1]) {
          const span = triggers[i + 1] - triggers[i] || 1;
          const t = Math.min(Math.max((scrolled - triggers[i]) / span, 0), 1);
          const eased = t * t * (3 - 2 * t);
          return target.set(stops[i] + (stops[i + 1] - stops[i]) * eased);
        }
      }

      target.set(stops[stops.length - 1]);
    };

    place(window.scrollY);
    return scrollY.on("change", place);
  }, [stops, scrollY, target]);

  useMotionValueEvent(velocity, "change", (value) => {
    const moving = Math.abs(value) > 90;
    setWalking((prev) => (prev === moving ? prev : moving));
  });

  return (
    <div
      ref={track}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 hidden xl:block"
    >
      <div className="relative mx-auto h-full max-w-[1500px] px-6 md:px-10">
        <motion.div
          style={{
            y: reduceMotion ? target : smooth,
            rotate: reduceMotion ? 0 : lean,
            perspective: 700,
          }}
          className="absolute top-0 right-2 w-[86px]"
        >
          <motion.div
            style={{ rotateY: reduceMotion ? 0 : turn, transformStyle: "preserve-3d" }}
          >
            <Figure walking={walking && !reduceMotion} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
