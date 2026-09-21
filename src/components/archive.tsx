"use client";

import { motion } from "motion/react";

import { ARCHIVE } from "@/lib/content";

import { EASE, Reveal } from "./scroll-primitives";

/**
 * The work that isn't in the featured six but still earned its place — the
 * hackathon results in particular.
 */
export function Archive() {
  return (
    <section className="border-line/60 border-t py-20 md:py-28">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="label">Also in the archive</p>
          <p className="label">Earlier builds &amp; hackathons</p>
        </Reveal>

        <ul className="mt-10">
          {ARCHIVE.map((item, i) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: Math.min(i * 0.05, 0.25) }}
              className="group border-line/60 border-b"
            >
              <a
                href={item.repo}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-5 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pl-3"
              >
                <span className="text-chalk min-w-[9rem] text-lg font-light tracking-[-0.03em] md:text-xl">
                  {item.name}
                </span>
                <span className="text-ash group-hover:text-smoke flex-1 text-sm transition-colors duration-500">
                  {item.note}
                </span>
                {item.accolade && (
                  <span className="border-line text-smoke group-hover:border-chalk group-hover:text-chalk rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-500">
                    {item.accolade}
                  </span>
                )}
                <span className="label tabular-nums">{item.year}</span>
                <span className="text-ash group-hover:text-chalk inline-block transition-all duration-500 group-hover:translate-x-1.5">
                  &#8599;
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
