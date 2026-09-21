"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { WHY } from "@/lib/content";

import { EASE, SectionHeading } from "./scroll-primitives";

/**
 * Six panels stood on end. Hovering one opens it and squeezes the rest to
 * their spines, so the section reads as a single object that redistributes
 * rather than six cards competing for attention.
 *
 * The open panel's copy is held at a fixed width and simply clipped while the
 * panel is narrow — letting it reflow as the flex basis animates made the text
 * rewrap on every frame.
 */
function Panels() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div className="mt-14 hidden gap-3 lg:flex lg:h-[30rem]">
      {WHY.map((item, i) => {
        const isOpen = active === i;

        return (
          <motion.article
            key={item.index}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={0}
            aria-expanded={isOpen}
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
            style={{ flexGrow: isOpen ? 4 : 0.6, flexBasis: 0 }}
            className={`group relative cursor-default overflow-hidden rounded-[26px] border transition-[flex-grow,background-color,border-color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none ${
              isOpen
                ? "border-ash/45 bg-coal"
                : "border-line bg-pit hover:border-ash/30"
            }`}
          >
            <span aria-hidden className="grid-veil absolute inset-0 opacity-30" />

            {/* Spine: what a closed panel shows. */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-between py-8 transition-opacity duration-500 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="label">{item.index}</span>
              {/* The spine carries a short label, not the headline — a full
                  title set vertically runs past the panel and clips. */}
              <h3 className="font-display text-smoke group-hover:text-chalk [writing-mode:vertical-rl] rotate-180 text-base tracking-[-0.01em] whitespace-nowrap uppercase transition-colors duration-500">
                {item.short}
              </h3>
              <span className="bg-line h-10 w-px" />
            </div>

            {/* Open panel. Width is pinned so the copy never rewraps mid-slide. */}
            <div
              className={`absolute inset-y-0 left-0 flex w-[min(30vw,27rem)] flex-col justify-between p-9 transition-opacity duration-500 ${
                isOpen ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="label text-chalk">{item.index}</span>
                <span className="label tabular-nums">
                  {String(WHY.length).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="font-display text-chalk text-[clamp(1.6rem,2.3vw,2.4rem)] leading-[1.02] tracking-[-0.035em] uppercase">
                  {item.title}
                </h3>

                {/* Rule that draws itself once the panel is open. */}
                <span
                  className={`bg-ash/60 my-6 block h-px origin-left transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "scale-x-100 delay-200" : "scale-x-0"
                  }`}
                />

                <p className="text-smoke text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

/** Small screens get the same six, opened, in plain order. */
function Stacked() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 flex flex-col lg:hidden">
      {WHY.map((item, i) => (
        <motion.article
          key={item.index}
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
          className="border-line border-t py-7 first:border-t-0 first:pt-0"
        >
          <div className="flex items-baseline gap-4">
            <span className="label">{item.index}</span>
            <h3 className="font-display text-chalk text-xl leading-tight tracking-[-0.03em] uppercase">
              {item.title}
            </h3>
          </div>
          <p className="text-smoke mt-3 text-sm leading-relaxed">{item.body}</p>
        </motion.article>
      ))}
    </div>
  );
}

export function Why() {
  return (
    <section className="border-line/60 border-t py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHeading
          id="why"
          index="05"
          title="Why choose me"
          aside="The short case"
          variant="center"
        />
        <Panels />
        <Stacked />
      </div>
    </section>
  );
}
