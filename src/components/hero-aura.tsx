"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Points on the shell. Enough to read as a surface, few enough to be free. */
const POINTS = 460;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Radians per second. Slow enough that you notice it only if you wait. */
const SPIN = 0.13;
/** Seconds between pings. */
const PING_PERIOD = 6.4;
const PING_COUNT = 3;

/** Viewer distance in sphere radii — the smaller, the harder the perspective. */
const DEPTH = 2.7;

/**
 * A live wireframe shell turning behind the figure.
 *
 * Points are laid on a Fibonacci sphere, so they spread evenly instead of
 * bunching at the poles the way a lat/long grid does, and the whole shell
 * turns on its axis under a fixed tilt. Depth does the drawing: a point's
 * distance from the viewer sets its size and its alpha together, so the far
 * face sinks into the page and the near face picks up the light. Rings ping
 * outward through it on a slow cycle to keep the thing reading as live rather
 * than looping.
 *
 * All of it is one canvas and one rAF loop — no DOM, no layout, nothing for
 * React to re-render. The loop stops when the hero leaves the viewport or the
 * tab goes to the background, and never starts at all under reduced motion,
 * which gets a single still frame instead.
 */
export function HeroAura({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;

    const context = node.getContext("2d");
    if (!context) return;

    // The shell, built once in unit space and projected every frame.
    const shell = Array.from({ length: POINTS }, (_, i) => {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GOLDEN_ANGLE;
      return { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
    });

    let width = 0;
    let height = 0;
    let radius = 0;

    const resize = () => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Capped, because past 2x nobody can tell and the fill rate is real.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      radius = Math.min(width, height) * 0.36;

      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (elapsed: number) => {
      if (!width || !height) return;

      const cx = width / 2;
      const cy = height / 2;

      context.clearRect(0, 0, width, height);

      // ---- rings, behind the shell ----
      for (let k = 0; k < PING_COUNT; k += 1) {
        const progress =
          (((elapsed / PING_PERIOD + k / PING_COUNT) % 1) + 1) % 1;
        const r = radius * (0.5 + progress * 1.45);
        // Fades in off nothing, then out — a hard edge appearing at the
        // centre read as a glitch rather than a pulse.
        const alpha = 0.16 * Math.sin(Math.PI * progress) ** 1.5;

        context.beginPath();
        context.ellipse(cx, cy, r, r * 0.94, 0, 0, Math.PI * 2);
        context.strokeStyle = `rgba(250,250,250,${alpha.toFixed(4)})`;
        context.lineWidth = 1;
        context.stroke();
      }

      // ---- the shell ----
      const spin = elapsed * SPIN;
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);

      // A little sway on the tilt, so the silhouette never settles.
      const tilt = 0.4 + Math.sin(elapsed * 0.11) * 0.09;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      for (const point of shell) {
        // Spin about Y, then tilt about X.
        const x = point.x * cosSpin + point.z * sinSpin;
        const zSpun = point.z * cosSpin - point.x * sinSpin;
        const y = point.y * cosTilt - zSpun * sinTilt;
        const z = point.y * sinTilt + zSpun * cosTilt;

        const scale = DEPTH / (DEPTH - z);
        const depth = (z + 1) / 2;

        const alpha = 0.05 + depth * depth * 0.46;
        const size = (0.45 + depth * 1.35) * scale;

        context.beginPath();
        context.arc(
          cx + x * radius * scale,
          cy + y * radius * scale,
          size,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(250,250,250,${alpha.toFixed(4)})`;
        context.fill();
      }
    };

    resize();

    if (reduceMotion) {
      // One frame, held. Enough to keep the composition's centre.
      draw(0);
      const observer = new ResizeObserver(() => {
        resize();
        draw(0);
      });
      observer.observe(node);
      return () => observer.disconnect();
    }

    let frame = 0;
    let running = false;
    let visible = true;
    let onscreen = true;
    // Kept separately from the wall clock so time doesn't jump forward across
    // a pause — the shell would snap to a new angle on return.
    let elapsed = 0;
    let last = 0;

    const tick = (now: number) => {
      // Clamped, so one long frame can't throw the rotation.
      elapsed += Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(elapsed);
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const shouldRun = visible && onscreen;
      if (shouldRun === running) return;
      running = shouldRun;

      if (shouldRun) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) draw(elapsed);
    });
    resizeObserver.observe(node);

    const inView = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    inView.observe(node);

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      inView.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvas} aria-hidden className={className} />;
}
