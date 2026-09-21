"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ABOUT_BODY, ABOUT_STATEMENT, STATS } from "@/lib/content";

import {
  CountUp,
  DrawLine,
  EASE,
  Reveal,
  RevealWords,
  SectionHeading,
} from "./scroll-primitives";

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
        <SectionHeading id="about" index="01" title="About" aside="Who is typing" />

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-20">
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
          </div>

          {/* ---------- the numbers ---------- */}
          <div className="lg:pt-3">
            <Reveal>
              <p className="label mb-7">By the numbers</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
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
        </div>
      </div>
    </section>
  );
}
