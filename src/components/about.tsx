"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ABOUT_BODY, ABOUT_STATEMENT, PROFILE, STATS } from "@/lib/content";

import {
  CountUp,
  DrawLine,
  EASE,
  Reveal,
  RevealWords,
  SectionHeading,
} from "./scroll-primitives";

/** Swaps between the two roles on a slow loop. */
function RoleCycle() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setIndex((value) => (value + 1) % PROFILE.roles.length),
      2800,
    );
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <span className="text-chalk inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={PROFILE.roles[index]}
          initial={reduceMotion ? false : { y: "105%" }}
          animate={{ y: "0%" }}
          exit={reduceMotion ? undefined : { y: "-105%" }}
          transition={{ duration: 0.52, ease: EASE }}
        >
          {PROFILE.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** One row of the spec list under the copy. */
function Spec({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-line/70 flex items-baseline justify-between gap-6 border-b py-3.5">
      <dt className="label shrink-0">{term}</dt>
      <dd className="text-smoke text-right font-mono text-[11px] tracking-[0.12em] uppercase">
        {children}
      </dd>
    </div>
  );
}

/**
 * The photograph, framed like a viewfinder. It drifts slightly against the
 * scroll and wipes up into view the first time it passes.
 *
 * The source is square and the subject stands right of centre behind a tree,
 * so the crop is pulled to 66% across — centred would put a tree trunk in the
 * middle of the frame.
 */
function PhotoFrame() {
  const reduceMotion = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1.02]);

  return (
    <motion.figure
      ref={frame}
      className="group relative lg:sticky lg:top-28 lg:self-start"
      initial={reduceMotion ? false : { opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div className="border-line bg-coal relative overflow-hidden rounded-[26px] border">
        <motion.div
          className="relative aspect-[4/5] w-full overflow-hidden"
          initial={reduceMotion ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
        >
          <motion.div
            className="absolute inset-0"
            style={reduceMotion ? undefined : { y, scale }}
          >
            <Image
              src="/profile.jpg"
              alt={PROFILE.name}
              fill
              sizes="(max-width: 1024px) 92vw, 38vw"
              className="object-cover object-[66%_center] [filter:grayscale(1)_contrast(1.08)_brightness(0.88)] transition-[filter] duration-700 group-hover:[filter:grayscale(1)_contrast(1.12)_brightness(1)]"
            />
          </motion.div>

          {/* Texture and a travelling scanline, on the same motifs as the deck. */}
          <span aria-hidden className="grid-veil absolute inset-0 opacity-[0.12]" />
          <span
            aria-hidden
            className="animate-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <span
            aria-hidden
            className="from-void/95 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          />

          {/* Viewfinder corners — top only; the caption owns the bottom. */}
          {[
            "top-4 left-4 border-t border-l",
            "top-4 right-4 border-t border-r",
          ].map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`border-chalk/40 group-hover:border-chalk/80 absolute size-6 transition-colors duration-700 ${corner}`}
            />
          ))}

          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
            <div>
              <p className="font-display text-chalk text-2xl leading-none tracking-[-0.03em] uppercase">
                {PROFILE.name}
              </p>
              <p className="label mt-2">{PROFILE.location}</p>
            </div>

            {PROFILE.available && (
              <span className="border-line bg-void/70 text-chalk flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur-sm">
                <span className="relative flex size-1.5">
                  <span className="bg-chalk animate-pulse-ring absolute inset-0 rounded-full" />
                  <span className="bg-chalk relative size-1.5 rounded-full" />
                </span>
                Available
              </span>
            )}
          </figcaption>
        </motion.div>
      </div>
    </motion.figure>
  );
}

export function About() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);

  // A vast ghost word slides across behind the copy as the section passes.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const ghostX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);

  return (
    <section
      ref={section}
      className="border-line/60 relative overflow-hidden border-t py-24 md:py-36"
    >
      {/* Background word — purely textural, sits under everything. */}
      <motion.span
        aria-hidden
        style={reduceMotion ? undefined : { x: ghostX }}
        className="pointer-events-none text-[#0d0d0f] absolute top-1/2 left-0 -z-0 -translate-y-1/2 text-[26vw] leading-none font-black tracking-[-0.06em] whitespace-nowrap uppercase select-none"
      >
        About About
      </motion.span>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="about"
          index="02"
          title="About"
          aside="Who is typing"
          variant="serif"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)] lg:gap-20">
          {/* ---------- the statement ---------- */}
          <div>
            <p className="text-chalk text-[clamp(1.35rem,3.1vw,2.35rem)] leading-[1.22] font-light tracking-[-0.04em]">
              <RevealWords text={ABOUT_STATEMENT} stagger={0.028} />
            </p>

            <div className="mt-12 grid gap-7 sm:grid-cols-2">
              {ABOUT_BODY.map((paragraph, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <p className="text-smoke text-sm leading-relaxed md:text-[0.95rem]">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14" delay={0.15}>
              <dl>
                <Spec term="Based in">{PROFILE.location}</Spec>
                <Spec term="Coordinates">{PROFILE.coordinates}</Spec>
                <Spec term="Currently">
                  <RoleCycle />
                </Spec>
                <Spec term="Status">
                  {PROFILE.available ? "Open to work" : "Heads down"}
                </Spec>
              </dl>
            </Reveal>
          </div>

          {/* ---------- the photograph ---------- */}
          <PhotoFrame />
        </div>

        {/* ---------- the numbers ---------- */}
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-28 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.09 }}
            >
              <p className="text-chalk font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-extralight tracking-[-0.05em]">
                <CountUp value={stat.value} plain={stat.plain} />
                {stat.suffix}
              </p>
              <DrawLine className="mt-4" delay={i * 0.09} />
              <p className="label mt-3 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
