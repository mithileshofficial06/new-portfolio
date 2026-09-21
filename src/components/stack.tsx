"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

import { STACK_GROUPS, TIMELINE } from "@/lib/content";
import { TECH_ICONS } from "@/lib/tech-icons";

import { DrawLine, EASE, Reveal, SectionHeading } from "./scroll-primitives";

/** Tools with no official mark of their own wear their initials instead. */
const MONOGRAMS: Record<string, string> = {
  SQL: "SQL",
  BullMQ: "BMQ",
  Nmap: "NM",
  Nuclei: "NC",
  Subfinder: "SF",
};

type Active = { name: string; group: string } | null;

function Tile({
  name,
  group,
  order,
  active,
  onActivate,
}: {
  name: string;
  group: string;
  order: number;
  active: Active;
  onActivate: (value: Active) => void;
}) {
  const reduceMotion = useReducedMotion();
  const path = TECH_ICONS[name];
  const isActive = active?.name === name;
  const isMuted = active !== null && !isActive;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay: Math.min(order * 0.03, 0.4) }}
      onPointerEnter={() => onActivate({ name, group })}
      onPointerLeave={() => onActivate(null)}
    >
      <motion.div
        title={name}
        className="border-line bg-coal relative flex size-16 items-center justify-center rounded-2xl border md:size-[4.5rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: isMuted ? 0.36 : 1,
                y: isActive ? -6 : 0,
                borderColor: isActive ? "#77777f" : "#1e1e21",
              }
        }
        transition={{ duration: 0.45, ease: EASE }}
      >
        {/* Glow that blooms behind the tile while it holds the readout. */}
        <span
          aria-hidden
          className={`absolute -inset-2 -z-10 rounded-[1.4rem] bg-[radial-gradient(circle_at_center,rgba(250,250,250,0.14),transparent_70%)] transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {path ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={`size-7 transition-colors duration-500 md:size-8 ${
              isActive ? "text-chalk" : "text-smoke"
            }`}
          >
            <path d={path} fill="currentColor" />
          </svg>
        ) : (
          <span
            aria-hidden
            className={`font-mono text-xs tracking-[0.1em] transition-colors duration-500 ${
              isActive ? "text-chalk" : "text-smoke"
            }`}
          >
            {MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase()}
          </span>
        )}

        <span className="sr-only">{name}</span>
      </motion.div>
    </motion.li>
  );
}

function StackGrid() {
  const [active, setActive] = useState<Active>(null);
  const total = STACK_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  // Stagger runs across the whole grid rather than restarting per group, so
  // the tiles arrive as one wave instead of five.
  let tile = 0;

  return (
    <div className="mt-16" onPointerLeave={() => setActive(null)}>
      {/* Museum label: the icons carry the grid, this line names what you touch. */}
      <div className="border-line flex items-baseline justify-between gap-6 border-b pb-4">
        <p className="label">{active ? active.group : "Across five groups"}</p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active?.name ?? "idle"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="font-display text-chalk text-right text-xl leading-none tracking-[-0.03em] uppercase md:text-2xl"
          >
            {active ? active.name : `${total} tools`}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* One full-width row per group: the tiles are a fixed pitch, so any
          column split leaves dead cells at the end of the short groups. */}
      <div className="mt-12 flex flex-col gap-11">
        {STACK_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-4">
              <Reveal>
                <p className="label whitespace-nowrap">{group.title}</p>
              </Reveal>
              <DrawLine />
              <span className="label tabular-nums">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>

            <ul className="mt-6 flex flex-wrap gap-3">
              {group.items.map((item) => (
                <Tile
                  key={item}
                  name={item}
                  group={group.title}
                  order={tile++}
                  active={active}
                  onActivate={setActive}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
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
