"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Resting state: hairline-thin, letters almost touching. */
const BASE_WGHT = 140;
const PEAK_WGHT = 780;
const BASE_WDTH = 90;
const PEAK_WDTH = 104;
const PEAK_SCALE = 1.8;

/** Dock reach, in multiples of one average character box. */
const REACH_X = 3;
/** Vertical tolerance, in multiples of the line's height. */
const REACH_Y = 1.6;

/** Per-frame approach rate — higher snaps harder to the cursor. */
const EASING = 0.22;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The Dock's falloff: a cosine bell, flat at the peak, zero at the edge. */
const bell = (d: number) =>
  d >= 1 ? 0 : Math.pow(Math.cos((d * Math.PI) / 2), 1.35);

type MagneticNameProps = {
  text: string;
  play: boolean;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * The name set hairline-thin and tightly tracked, magnifying like the macOS
 * Dock: the character under the cursor swells from a shared baseline, its
 * neighbours taper off along a cosine bell, and the whole row spreads sideways
 * to make room instead of letting glyphs collide.
 *
 * Each character sits in a box whose width is frozen to its resting measure,
 * so changing `wght` inside never disturbs the row's layout. That keeps the
 * spread arithmetic exact and lets everything run as pure transforms inside a
 * single rAF loop — reads batched ahead of writes, zero React renders.
 */
export function MagneticName({
  text,
  play,
  className = "",
  delay = 0,
  stagger = 0.038,
}: MagneticNameProps) {
  const reduceMotion = useReducedMotion();

  const row = useRef<HTMLSpanElement>(null);
  const boxes = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphs = useRef<(HTMLSpanElement | null)[]>([]);

  /** Resting widths and centres, measured once and re-measured on resize. */
  const baseWidth = useRef<number[]>([]);
  const baseCenter = useRef<number[]>([]);
  const influence = useRef<number[]>([]);

  const pointer = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  // Masks stay clipped during the reveal, then open so a magnified character
  // isn't sliced by its own overflow box.
  const [revealed, setRevealed] = useState(false);

  const characters = [...text];
  const lastIndex = characters.length - 1;

  const handleMove = useCallback((event: React.PointerEvent) => {
    pointer.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleLeave = useCallback(() => {
    pointer.current = null;
  }, []);

  /** Release the frozen widths, read the natural layout, then re-freeze. */
  const measure = useCallback(() => {
    const container = row.current;
    if (!container) return;

    boxes.current.forEach((box) => {
      if (box) box.style.width = "";
    });

    const origin = container.getBoundingClientRect();
    const widths: number[] = [];
    const centers: number[] = [];

    boxes.current.forEach((box) => {
      if (!box) {
        widths.push(0);
        centers.push(0);
        return;
      }
      const rect = box.getBoundingClientRect();
      widths.push(rect.width);
      centers.push(rect.left - origin.left + rect.width / 2);
    });

    boxes.current.forEach((box, i) => {
      if (box) box.style.width = `${widths[i]}px`;
    });

    baseWidth.current = widths;
    baseCenter.current = centers;
  }, []);

  // Measure once the webfont is actually in place, and on any resize.
  useEffect(() => {
    measure();

    let raf = 0;
    const remeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    document.fonts?.ready.then(remeasure).catch(() => {});
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
    };
  }, [measure, text]);

  useEffect(() => {
    if (!revealed || reduceMotion) return;

    influence.current = characters.map(() => 0);

    const tick = () => {
      const container = row.current;
      const nodes = glyphs.current;
      const cursor = pointer.current;

      if (!container) {
        frame.current = requestAnimationFrame(tick);
        return;
      }

      // ---- read pass ----
      const origin = container.getBoundingClientRect();
      const widths = baseWidth.current;
      const centers = baseCenter.current;
      const span = widths.length
        ? widths.reduce((a, b) => a + b, 0) / widths.length
        : 1;

      const naturalWidth: number[] = [];
      for (let i = 0; i < nodes.length; i += 1) {
        naturalWidth.push(nodes[i]?.offsetWidth ?? widths[i] ?? 0);
      }

      const targets: number[] = [];
      for (let i = 0; i < nodes.length; i += 1) {
        if (!cursor || centers[i] === undefined) {
          targets.push(0);
          continue;
        }
        const dx = Math.abs(cursor.x - origin.left - centers[i]) / (span * REACH_X);
        const dy =
          Math.abs(cursor.y - origin.top - origin.height / 2) /
          (origin.height * REACH_Y);
        targets.push(bell(dx) * bell(Math.min(dy, 1)));
      }

      // ---- compute pass: scales first, then the spread they force ----
      const scales: number[] = [];
      const growth: number[] = [];
      let totalGrowth = 0;

      for (let i = 0; i < nodes.length; i += 1) {
        const next = lerp(influence.current[i] ?? 0, targets[i], EASING);
        influence.current[i] = next;

        const scale = lerp(1, PEAK_SCALE, next);
        scales.push(scale);

        const grown = naturalWidth[i] * scale - (widths[i] ?? naturalWidth[i]);
        growth.push(grown);
        totalGrowth += grown;
      }

      // ---- write pass ----
      let running = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!node) continue;

        const next = influence.current[i];
        // Push each glyph past everything that grew before it, then recentre
        // the row so magnifying near one end doesn't drag the whole name.
        const offset = running + growth[i] / 2 - totalGrowth / 2;
        running += growth[i];

        node.style.transform = `translateX(${offset.toFixed(2)}px) scale(${scales[i].toFixed(4)})`;
        node.style.fontVariationSettings =
          `"wght" ${lerp(BASE_WGHT, PEAK_WGHT, next).toFixed(1)}, ` +
          `"wdth" ${lerp(BASE_WDTH, PEAK_WDTH, next).toFixed(1)}`;
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // `characters` is derived from `text`; tracking the string is enough.
  }, [revealed, reduceMotion, text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span
      ref={row}
      onPointerMove={reduceMotion ? undefined : handleMove}
      onPointerLeave={reduceMotion ? undefined : handleLeave}
      className={`inline-flex ${className}`}
      style={{
        fontFamily: "var(--font-archivo)",
        fontVariationSettings: `"wght" ${BASE_WGHT}, "wdth" ${BASE_WDTH}`,
      }}
    >
      <span className="sr-only">{text}</span>

      {characters.map((character, index) => (
        <span
          key={`${character}-${index}`}
          aria-hidden
          ref={(node) => {
            boxes.current[index] = node;
          }}
          className={`inline-block text-center ${
            revealed ? "overflow-visible" : "overflow-hidden"
          }`}
        >
          {/* Each character rides up out of its slot and rolls level on the
              way, hinged on its own baseline. The slot's overflow does the
              rest: a letter still tipped away is cut off by the box it is
              climbing out of, so the row reads as type being set rather than
              as text sliding upward. */}
          <motion.span
            className="inline-block will-change-transform"
            style={{ transformOrigin: "50% 100%" }}
            initial={{ y: "118%", rotateX: -78, transformPerspective: 620 }}
            animate={
              play ? { y: "0%", rotateX: 0, transformPerspective: 620 } : undefined
            }
            transition={{
              duration: reduceMotion ? 0 : 1.25,
              ease: [0.16, 1, 0.3, 1],
              delay: reduceMotion ? 0 : delay + index * stagger,
            }}
            onAnimationComplete={
              index === lastIndex ? () => setRevealed(true) : undefined
            }
          >
            <span
              ref={(node) => {
                glyphs.current[index] = node;
              }}
              className="inline-block will-change-[font-variation-settings,transform]"
              style={{
                // Grow up off the baseline, the way Dock icons do.
                transformOrigin: "50% 100%",
                fontVariationSettings: `"wght" ${BASE_WGHT}, "wdth" ${BASE_WDTH}`,
              }}
            >
              {character === " " ? " " : character}
            </span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}
