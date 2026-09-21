"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { STACK_GROUPS } from "@/lib/content";
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
      className={`relative ${isActive ? "z-10" : ""}`}
    >
      <motion.div
        title={name}
        className="border-line bg-coal relative flex size-16 items-center justify-center rounded-2xl border md:size-[4.5rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: isMuted ? 0.36 : 1,
                y: isActive ? -8 : 0,
                borderColor: isActive ? "#77777f" : "#1e1e21",
              }
        }
        transition={
          isActive
            ? { type: "spring", stiffness: 420, damping: 18, mass: 0.6 }
            : { duration: 0.45, ease: EASE }
        }
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
            className={`size-7 transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:size-8 ${
              isActive ? "text-chalk scale-[1.18]" : "text-smoke scale-100"
            }`}
          >
            <path d={path} fill="currentColor" />
          </svg>
        ) : (
          <span
            aria-hidden
            className={`font-mono text-xs tracking-[0.1em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive ? "text-chalk scale-[1.18]" : "text-smoke scale-100"
            }`}
          >
            {MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase()}
          </span>
        )}

        <span className="sr-only">{name}</span>
      </motion.div>

      {/* The name rides under the tile it belongs to, rather than in a readout
          somewhere else on the page. Absolute, so it never reflows the row. */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="bg-chalk text-void pointer-events-none absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase"
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
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
      {/* The tile names the tool; this line names the family it belongs to. */}
      <div className="border-line flex items-baseline justify-between gap-6 border-b pb-4">
        <p className="label">Across five groups</p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active?.group ?? "idle"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="font-display text-chalk text-right text-xl leading-none tracking-[-0.03em] uppercase md:text-2xl"
          >
            {active ? active.group : `${total} tools`}
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

export function Stack() {
  return (
    <section className="border-line/60 border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="stack"
          index="03"
          title="Toolkit"
          aside="What I reach for"
          variant="outline"
        />
        <StackGrid />
      </div>
    </section>
  );
}
