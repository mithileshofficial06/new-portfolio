"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { useIntroReady } from "./intro-context";

/**
 * The background-removed subject, standing on the centre line.
 *
 * He is the axis the rest of the hero is arranged around: the name is set
 * across him, the meta columns flank him, and the actions float in front of
 * his fade. Bottom-anchored so he is grounded on the marquee rather than
 * floating above it. No pointer tracking — a portrait that drifts with the
 * cursor reads as a sticker, not a subject. The only movement he takes is
 * scroll: he leaves a little slower than the type does, which is what gives
 * the stage its depth.
 */
export function Portrait() {
  const ready = useIntroReady();
  const reduceMotion = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start start", "end start"],
  });
  // Against the stage's own 14% descent this nets out to roughly 8% — he
  // trails the type instead of moving with it.
  const drag = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const swell = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <div
      ref={frame}
      aria-hidden
      /* Behind the type on small screens, where he shares the centre with it;
         in front of it from lg, where the name is set wide enough that only
         the crown of his head crosses the letters. */
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center lg:z-30"
    >
      <motion.div
        className="relative h-[44%] w-[min(78vw,400px)] sm:h-[54%] lg:h-[72%] lg:w-[min(38vw,520px)]"
        initial={{ opacity: 0, y: 46, scale: 1.04 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        style={reduceMotion ? undefined : { y: drag, scale: swell }}
      >
        {/* Halo — a hairline ring set behind the shoulders, drawn on once the
            figure has landed. It gives the centred composition a centre. */}
        <motion.span
          className="border-line/70 absolute top-[6%] left-1/2 -z-10 aspect-square w-[118%] -translate-x-1/2 rounded-full border"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        />

        {/* Rim glow — separates a black suit from a black page. */}
        <div className="absolute inset-0 -z-10 translate-y-[8%] scale-[1.16] bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,255,255,0.15),transparent_64%)] blur-2xl" />

        <Image
          src="/profile-cut.png"
          alt="Mithilesh KS"
          fill
          priority
          sizes="(max-width: 1024px) 78vw, 38vw"
          /* Pushed well back on small screens, where he sits behind the type
             instead of beside it. */
          className="object-contain object-bottom [filter:grayscale(1)_contrast(1.05)_brightness(0.34)] lg:[filter:grayscale(1)_contrast(1.1)_brightness(0.97)]"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 62%, rgba(0,0,0,0.4) 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 62%, rgba(0,0,0,0.4) 88%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
