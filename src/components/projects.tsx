"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { PROJECTS, type Project } from "@/lib/content";

import { EASE, Reveal, SectionHeading } from "./scroll-primitives";

/** Follows the pointer across the list, naming whatever is under it. */
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

function ProjectRow({ project, order }: { project: Project; order: number }) {
  const href = project.live ?? project.repo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay: Math.min(order * 0.06, 0.3) }}
      className="group border-line/70 relative border-b"
    >
      {/* Sweep that fills the row from the left on hover. */}
      <span
        aria-hidden
        className="bg-coal/70 absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="relative block px-1 py-8 md:py-11"
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <span className="label shrink-0 transition-colors duration-500 group-hover:text-chalk">
            {project.index}
          </span>

          <h3 className="font-display wght-shift text-chalk flex-1 text-[clamp(1.75rem,5.4vw,4rem)] leading-[0.98] tracking-[-0.03em] uppercase">
            {project.name}
          </h3>

          <div className="flex shrink-0 items-baseline gap-5">
            {project.accolade && (
              <span className="border-line text-smoke group-hover:border-chalk group-hover:text-chalk inline-block rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-500">
                {project.accolade}
              </span>
            )}
            <span className="label">{project.kind}</span>
            <span className="label tabular-nums">{project.year}</span>
            <span className="text-chalk inline-block text-xl transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:-translate-y-1">
              &#8599;
            </span>
          </div>
        </div>

        <p className="text-smoke group-hover:text-chalk mt-3 max-w-[70ch] text-sm transition-colors duration-500 md:text-base">
          {project.tagline}
        </p>

        {/* Collapsed on desktop until hover; always open on small screens,
            where there is no hover to reveal it. */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="grid gap-6 pt-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-12">
              <p className="text-ash group-hover:text-smoke max-w-[68ch] text-sm leading-relaxed transition-colors duration-500">
                {project.description}
              </p>

              <ul className="flex flex-wrap content-start gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="border-line/80 text-ash group-hover:border-line group-hover:text-smoke rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-500"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 pb-1">
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
        </div>
      </a>
    </motion.article>
  );
}

export function Projects() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="border-line/60 relative border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="work"
          index="02"
          title="Selected work"
          aside="Six of thirty-six"
        />

        <div
          className="mt-16"
          onPointerLeave={() => setHovered(null)}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.name}
              onPointerEnter={() =>
                setHovered(project.live ? "Open live site" : "Open repository")
              }
            >
              <ProjectRow project={project} order={i} />
            </div>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center" delay={0.1}>
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
      </div>

      <CursorBadge label={hovered} />
    </section>
  );
}
