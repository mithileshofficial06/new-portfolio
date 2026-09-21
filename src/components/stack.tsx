"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { STACK_GROUPS, TIMELINE } from "@/lib/content";

import { DrawLine, EASE, Reveal, SectionHeading } from "./scroll-primitives";

function StackGrid() {
  return (
    <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {STACK_GROUPS.map((group, g) => (
        <div key={group.title}>
          <Reveal delay={g * 0.05}>
            <p className="label">{group.title}</p>
          </Reveal>
          <DrawLine className="mt-3" delay={g * 0.05} />

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
            {group.items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: g * 0.05 + i * 0.035,
                }}
                className="text-smoke hover:text-chalk cursor-default text-base font-light tracking-[-0.02em] transition-colors duration-300 md:text-lg"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const reduceMotion = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);

  // The spine fills as the list scrolls past.
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    // Two columns on wide screens: a single narrow list left two thirds of
    // the page empty.
    <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal>
          <p className="label">Education &amp; recognition</p>
          <p className="text-smoke mt-5 max-w-[32ch] text-sm leading-relaxed">
            Studying in Chennai, certified in security, and shipping at
            hackathons in between.
          </p>
        </Reveal>
      </div>

      <ol ref={list} className="relative pl-8 md:pl-12">
        {/* Spine */}
        <span aria-hidden className="bg-line absolute top-2 bottom-2 left-0 w-px" />
        <motion.span
          aria-hidden
          className="bg-chalk absolute top-2 bottom-2 left-0 w-px origin-top"
          style={reduceMotion ? { scaleY: 1 } : { scaleY }}
        />

        {TIMELINE.map((entry, i) => (
          <motion.li
            key={`${entry.title}-${i}`}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: i * 0.06 }}
            className="group relative pb-11 last:pb-0"
          >
            {/* Node */}
            <span
              aria-hidden
              className="bg-void border-ash group-hover:border-chalk group-hover:bg-chalk absolute top-2 -left-8 h-2 w-2 -translate-x-1/2 rounded-full border transition-colors duration-500 md:-left-12"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
              <h3 className="text-chalk order-2 w-full text-xl font-light tracking-[-0.03em] sm:order-1 sm:w-auto md:text-2xl">
                {entry.title}
              </h3>
              <p className="label order-1 sm:order-2">{entry.period}</p>
            </div>
            <p className="text-smoke mt-1.5 text-sm">{entry.org}</p>
            <p className="text-ash mt-2 max-w-[62ch] text-sm leading-relaxed">
              {entry.note}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Stack() {
  return (
    <section className="border-line/60 border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="stack"
          index="03"
          title="Stack & history"
          aside="What I reach for"
        />
        <StackGrid />
        <Timeline />
      </div>
    </section>
  );
}
