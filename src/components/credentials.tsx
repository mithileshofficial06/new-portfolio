"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useMemo, useRef, useState } from "react";

import { TIMELINE, type TimelineKind } from "@/lib/content";

import { EASE, Reveal, SectionHeading } from "./scroll-primitives";

const FILTERS = [
  "All",
  "Education",
  "Certification",
  "Recognition",
  "Event",
] as const;
type Filter = (typeof FILTERS)[number];

/** Each family gets a mark so the badge reads before the words do. */
const GLYPH: Record<TimelineKind, string> = {
  Education: "M12 3 1.5 8.5 12 14l8.5-4.45V16H22V8.5L12 3ZM5 12.2V16c0 1.9 3.1 3.4 7 3.4s7-1.5 7-3.4v-3.8l-7 3.7-7-3.7Z",
  Certification:
    "M12 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm-4 11.9V22l4-2.1 4 2.1v-8.1a7.4 7.4 0 0 1-8 0Z",
  Recognition:
    "M7 2h10v2h4v3a4 4 0 0 1-3.6 4 5.5 5.5 0 0 1-3.4 2.8V17h3v2H7v-2h3v-3.2A5.5 5.5 0 0 1 6.6 11 4 4 0 0 1 3 7V4h4V2Zm0 4H5v1a2 2 0 0 0 2 2V6Zm12 0h-2v3a2 2 0 0 0 2-2V6Z",
  Event:
    "M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7ZM5 10h14v10H5V10Zm2.5 2v2h2v-2h-2Zm4.5 0v2h2v-2h-2Z",
};

/** The whole record by kind, in the order the filters run. */
const TALLY = (FILTERS.filter((f) => f !== "All") as TimelineKind[]).map(
  (kind) => [kind, TIMELINE.filter((entry) => entry.kind === kind).length] as const,
);

function Card({
  entry,
  index,
}: {
  entry: (typeof TIMELINE)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const inView = useInView(card, { once: true, margin: "-14% 0px" });

  // The spotlight tracks the cursor across the card face.
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${px}% ${py}%, rgba(250,250,250,0.09), transparent 68%)`;

  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : reduceMotion
            ? undefined
            : { opacity: 0, y: 34, filter: "blur(6px)" }
      }
      exit={reduceMotion ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" }}
      transition={{ duration: 0.8, ease: EASE, delay: Math.min(index * 0.07, 0.35) }}
      className="group relative"
    >
      <div
        ref={card}
        onPointerMove={
          reduceMotion
            ? undefined
            : (event) => {
                const box = event.currentTarget.getBoundingClientRect();
                px.set(((event.clientX - box.left) / box.width) * 100);
                py.set(((event.clientY - box.top) / box.height) * 100);
              }
        }
        className="border-line bg-coal/50 hover:border-ash/70 relative overflow-hidden rounded-2xl border p-6 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:p-8"
      >
        {/* Cursor spotlight. */}
        <motion.span
          aria-hidden
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {/* Accent rail that grows down the card edge on hover. */}
        <span
          aria-hidden
          className="bg-chalk/70 absolute top-6 bottom-6 left-0 w-px origin-top scale-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <span className="border-line bg-void/60 text-ash group-hover:text-chalk group-hover:border-ash flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500">
            <svg viewBox="0 0 24 24" aria-hidden className="size-3.5">
              <path d={GLYPH[entry.kind]} fill="currentColor" />
            </svg>
            {entry.kind}
          </span>
          <span className="label tabular-nums">{entry.period}</span>
        </div>

        <h3 className="text-chalk wght-shift relative mt-5 text-xl leading-tight font-light tracking-[-0.03em] md:text-[1.75rem]">
          {entry.title}
        </h3>
        <p className="text-smoke relative mt-2 text-sm">{entry.org}</p>
        <p className="text-ash relative mt-3 max-w-[58ch] text-sm leading-relaxed">
          {entry.note}
        </p>

        <span
          aria-hidden
          className="text-line group-hover:text-ash/50 absolute right-6 bottom-5 font-mono text-4xl tabular-nums transition-colors duration-500 md:right-8 md:text-5xl"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.li>
  );
}

export function Credentials() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const list = useRef<HTMLDivElement>(null);

  const entries = useMemo(
    () => (filter === "All" ? TIMELINE : TIMELINE.filter((e) => e.kind === filter)),
    [filter],
  );

  // The years the visible set covers — the head says something the count in
  // the column beside it does not.
  const span = useMemo(() => {
    const years = entries
      .map((entry) => Number(entry.period.slice(0, 4)))
      .filter((year) => Number.isFinite(year));
    if (!years.length) return "—";
    const first = Math.min(...years);
    const last = Math.max(...years);
    return first === last ? `${first}` : `${first} — ${last}`;
  }, [entries]);

  // The rail across the head of the case fills as the case scrolls past.
  // Spring keeps it from snapping when a filter changes the height mid-scroll.
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 85%", "end 60%"],
  });
  const progress = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 140,
    damping: 28,
    mass: 0.5,
  });

  return (
    <section className="border-line/60 border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="credentials"
          index="04"
          title="Credentials"
          aside="Papers, podiums, hack nights"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="label">Sort the record</p>
              <p className="text-smoke mt-5 max-w-[32ch] text-sm leading-relaxed">
                Studying in Chennai, certified in security, and shipping at
                hackathons in between.
              </p>

              {/* Count swaps with the filter rather than sitting still. */}
              <div className="border-line mt-8 flex items-baseline gap-3 border-b pb-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={filter}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="font-display text-chalk text-4xl leading-none tabular-nums md:text-5xl"
                  >
                    {String(entries.length).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="label">
                  {filter === "All" ? "entries" : filter}
                </span>
              </div>

              {/* Filters: one pill slides between the labels. */}
              <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((item) => {
                  const isActive = item === filter;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      aria-pressed={isActive}
                      className={`relative rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-400 ${
                        isActive ? "text-void" : "text-ash hover:text-chalk"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="credential-filter"
                          aria-hidden
                          className="bg-chalk absolute inset-0 -z-10 rounded-full"
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                      <span
                        aria-hidden
                        className={`border-line absolute inset-0 -z-20 rounded-full border transition-opacity duration-400 ${
                          isActive ? "opacity-0" : "opacity-100"
                        }`}
                      />
                      {item}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* The cards live in a case of their own. The read-through is the
              rail across its head, which belongs to the container rather than
              running down the side of the cards. */}
          <motion.div
            ref={list}
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="border-line bg-pit/40 relative overflow-hidden rounded-[28px] border"
          >
            <span aria-hidden className="grid-veil absolute inset-0 opacity-30" />

            {/* Head: what is on show, and how far through it you are. */}
            <div className="border-line relative flex items-baseline justify-between gap-6 border-b px-6 py-5 md:px-8">
              <p className="label">The record</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={filter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="label tabular-nums"
                >
                  {span}
                </motion.p>
              </AnimatePresence>

              <motion.span
                aria-hidden
                className="bg-chalk absolute inset-x-0 bottom-0 h-px origin-left"
                style={reduceMotion ? { scaleX: 1 } : { scaleX: progress }}
              />
            </div>

            <div className="relative p-5 md:p-7">
              <motion.ul layout className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {entries.map((entry, i) => (
                    <Card
                      key={`${entry.title}-${entry.period}`}
                      entry={entry}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>

            {/* Foot: the whole record by kind, whatever is filtered above. */}
            <div className="border-line relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-6 py-5 md:px-8">
              {TALLY.map(([kind, count]) => (
                <span
                  key={kind}
                  className={`font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-500 ${
                    filter === kind || filter === "All" ? "text-smoke" : "text-line"
                  }`}
                >
                  {kind}{" "}
                  <span className="text-ash tabular-nums">
                    {String(count).padStart(2, "0")}
                  </span>
                </span>
              ))}
            </div>

            {/* Corner ticks, so the case reads as an instrument. */}
            {[
              "top-4 left-4 border-t border-l",
              "top-4 right-4 border-t border-r",
              "bottom-4 left-4 border-b border-l",
              "bottom-4 right-4 border-b border-r",
            ].map((corner) => (
              <span
                key={corner}
                aria-hidden
                className={`border-ash/30 pointer-events-none absolute size-3 ${corner}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
