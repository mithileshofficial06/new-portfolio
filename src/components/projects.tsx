"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PROJECTS, type Project } from "@/lib/content";

import { EASE, Magnetic, Reveal, SectionHeading } from "./scroll-primitives";

/** Follows the pointer across the deck, naming whatever is under it. */
function CursorBadge({ label }: { label: string | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.35 });

  // Only listen while something is actually hovered.
  useEffect(() => {
    if (!label) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [label, x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            className="bg-chalk text-void block -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap uppercase"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CHIPS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
};

const CHIP = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * The plate on the right of each card. There is no screenshot for any of these
 * builds, so the artwork is generated: a drifting bloom, the hairline grid and
 * a travelling scanline, rotated by index so no two plates read the same.
 */
function Plate({ project, order }: { project: Project; order: number }) {
  return (
    <div className="border-line/70 bg-void relative overflow-hidden rounded-2xl border lg:h-full">
      <span aria-hidden className="grid-veil absolute inset-0 opacity-40" />

      <span
        aria-hidden
        className="animate-drift absolute -inset-1/4 opacity-70"
        style={{
          background: `radial-gradient(40% 40% at ${28 + order * 11}% ${
            34 + ((order * 17) % 40)
          }%, rgba(250,250,250,0.16), transparent 70%)`,
          animationDelay: `${order * -3.4}s`,
        }}
      />

      <span
        aria-hidden
        className="animate-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        style={{ animationDelay: `${order * -1.1}s` }}
      />

      {/* The index, oversized and set flush — the plate's only real subject. */}
      <span
        aria-hidden
        className="font-display text-chalk/[0.07] group-hover:text-chalk/[0.12] absolute -bottom-[0.28em] left-[0.06em] text-[13rem] leading-none tracking-[-0.05em] transition-colors duration-700 select-none lg:text-[17rem]"
      >
        {project.index}
      </span>

      <div className="relative flex h-full flex-col justify-between gap-10 p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="label">{project.kind}</span>
          {project.accolade && (
            <span className="border-line text-smoke group-hover:border-chalk group-hover:text-chalk rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-500">
              {project.accolade}
            </span>
          )}
        </div>

        <Magnetic className="self-end" strength={0.25}>
          <span className="border-line text-chalk group-hover:bg-chalk group-hover:text-void flex size-16 items-center justify-center rounded-full border text-xl transition-colors duration-500 lg:size-20">
            <span className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
              &#8599;
            </span>
          </span>
        </Magnetic>
      </div>
    </div>
  );
}

/**
 * One card in the deck. Each sits in a slot taller than itself and sticks at a
 * top offset stepped by index, so the card that follows slides over it while
 * this one scales back and dims — the earlier headers stay peeking above.
 */
function ProjectCard({
  project,
  order,
  onHover,
}: {
  project: Project;
  order: number;
  onHover: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const slot = useRef<HTMLDivElement>(null);

  // 0 while the card is pinned, 1 by the time the next one has covered it.
  const { scrollYProgress } = useScroll({
    target: slot,
    offset: ["start 0.12", "end 0.12"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  // Stops well short of invisible — the stepped top edges of the cards already
  // covered are what make the pile read as a pile.
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const href = project.live ?? project.repo;

  return (
    <div
      ref={slot}
      className="px-6 md:px-10 lg:h-[102svh]"
      style={{ zIndex: order + 1 }}
      onPointerEnter={onHover}
    >
      <motion.article
        className="group mx-auto max-w-[1400px] lg:sticky"
        style={{
          top: `${96 + order * 16}px`,
          transformOrigin: "50% 0%",
          ...(reduceMotion ? {} : { scale, opacity }),
        }}
        initial={reduceMotion ? false : { opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px -12% 0px" }}
        transition={{ duration: 1, ease: EASE }}
      >
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="border-line bg-coal hover:border-ash/40 relative block overflow-hidden rounded-[28px] border transition-colors duration-500"
        >
          {/* Sweep that washes the card from the left on hover. */}
          <span
            aria-hidden
            className="bg-line/50 absolute inset-0 origin-left scale-x-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          />

          <div className="relative grid gap-8 p-6 md:p-10 lg:min-h-[72svh] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
            <div className="flex flex-col">
              <div className="border-line/70 flex items-baseline justify-between gap-4 border-b pb-5">
                <span className="label group-hover:text-chalk transition-colors duration-500">
                  {project.index} — {project.kind}
                </span>
                <span className="label tabular-nums">{project.year}</span>
              </div>

              <h3 className="font-display wght-shift text-chalk mt-7 text-[clamp(2.1rem,5.6vw,4.6rem)] leading-[0.94] tracking-[-0.035em] uppercase">
                {project.name}
              </h3>

              <p className="text-smoke group-hover:text-chalk mt-4 font-serif text-xl leading-snug transition-colors duration-500 md:text-2xl">
                {project.tagline}
              </p>

              <p className="text-ash group-hover:text-smoke mt-6 max-w-[62ch] text-sm leading-relaxed transition-colors duration-500">
                {project.description}
              </p>

              <motion.ul
                className="mt-8 flex flex-wrap gap-2"
                variants={CHIPS}
                initial={reduceMotion ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-10% 0px" }}
              >
                {project.stack.map((tech) => (
                  <motion.li
                    key={tech}
                    variants={CHIP}
                    className="border-line/80 text-ash group-hover:border-line group-hover:text-smoke rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-500"
                  >
                    {tech}
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-auto flex flex-wrap items-center gap-6 pt-9">
                <span className="label group-hover:text-chalk transition-colors duration-500">
                  Source ↗
                </span>
                {project.live && (
                  <span className="label group-hover:text-chalk transition-colors duration-500">
                    Live site ↗
                  </span>
                )}
              </div>
            </div>

            <div className="min-h-[15rem] lg:min-h-0">
              <Plate project={project} order={order} />
            </div>
          </div>
        </a>
      </motion.article>
    </div>
  );
}

export function Projects() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="border-line/60 relative border-t pt-24 md:pt-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="work"
          index="01"
          title="Selected work"
          aside="Six of thirty-six"
        />
      </div>

      <div
        className="mt-14 flex flex-col gap-6 md:mt-20 lg:gap-0"
        onPointerLeave={() => setHovered(null)}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            order={i}
            onHover={() =>
              setHovered(project.live ? "Open live site" : "Open repository")
            }
          />
        ))}
      </div>

      <Reveal className="flex justify-center pt-20 pb-24 md:pt-28 md:pb-36" delay={0.1}>
        <a
          href="https://github.com/mithileshofficial06?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="group border-line text-chalk hover:border-chalk inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-500"
        >
          All 36 repositories
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
            &rarr;
          </span>
        </a>
      </Reveal>

      <CursorBadge label={hovered} />
    </section>
  );
}
