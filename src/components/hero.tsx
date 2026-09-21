"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { PROFILE, PROJECTS, SOCIALS } from "@/lib/content";

import { Atmosphere } from "./atmosphere";
import { Crosshairs, Rail, Stat } from "./hero-furniture";
import { useIntroReady } from "./intro-context";
import { MagneticName } from "./magnetic-name";
import { Marquee } from "./marquee";
import { Portrait } from "./portrait";
import { Rise } from "./reveal-text";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared gutter, so the two flow blocks close on the same margin as the nav. */
const FRAME = "mx-auto w-full max-w-[1500px] px-6 md:px-10";

export function Hero() {
  const ready = useIntroReady();
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={section}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* The stage stops at the marquee, so the figure stands on it rather
          than hanging over it. The whole stage sinks and dims together as the
          next section climbs over it — fading the type but not the figure
          left him hanging in an empty frame.

          Three layers, and they have to be siblings to stack: the type (20),
          the figure through it (30 from lg), the ground band in front of his
          fade (40). Nesting the band inside the type block would trap it in
          that block's stacking context and bury it behind him. */}
      <motion.div
        className="relative flex flex-1 flex-col"
        style={reduceMotion ? undefined : { y: lift, opacity: fade }}
      >
        <Atmosphere />
        <Crosshairs />

        <Rail side="left">Portfolio — Edition 2026</Rail>
        <Rail side="right" delay={1.58}>
          {PROFILE.coordinates}
        </Rail>

        <Portrait />

        {/* ---------- layer 20: the type ---------- */}
        {/* flex-1 so it holds the band down against the marquee. */}
        <motion.div
          className={`relative z-20 flex flex-1 flex-col pt-24 md:pt-28 ${FRAME}`}
          initial={{ opacity: 0, scale: 0.965, filter: "blur(10px)" }}
          animate={
            ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined
          }
          transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
        >
          <Rise play={ready} delay={0.3} className="flex justify-center">
            <span className="border-line/80 bg-void/40 flex items-center gap-3 rounded-full border px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="bg-chalk animate-pulse-ring absolute inset-0 rounded-full" />
                <span className="bg-chalk relative h-1.5 w-1.5 rounded-full" />
              </span>
              <span className="label">Available for projects</span>
            </span>
          </Rise>

          {/* The name, set as wide as the frame allows so the figure standing
              in front of it crosses the letters rather than covering them. */}
          <h1 className="text-chalk mt-8 flex justify-center text-center text-[clamp(2rem,8.6vw,8.75rem)] leading-[0.92] uppercase md:mt-10">
            <MagneticName
              text="Mithilesh KS"
              play={ready}
              delay={0.45}
              stagger={0.038}
              className="tracking-[-0.085em]"
            />
          </h1>

          <div className="mt-5 flex justify-center overflow-hidden md:mt-6">
            <motion.p
              className="text-smoke flex flex-wrap items-baseline justify-center gap-x-2.5 text-center text-[clamp(0.95rem,2.1vw,1.6rem)] leading-tight tracking-[-0.03em]"
              initial={{ y: "115%" }}
              animate={ready ? { y: "0%" } : undefined}
              transition={{
                duration: reduceMotion ? 0 : 1.1,
                ease: EASE,
                delay: reduceMotion ? 0 : 1.0,
              }}
            >
              <span className="text-chalk font-light uppercase">Developer</span>
              <span className="text-ash font-serif italic">&amp;</span>
              <span className="text-chalk font-light uppercase">Designer</span>
              <span className="bg-line mx-2 hidden h-4 w-px sm:inline-block" />
              <span className="text-ash font-serif italic">Chennai, India</span>
            </motion.p>
          </div>
        </motion.div>

        {/* ---------- layer 40: the ground band ---------- */}
        {/* Three columns across the base with the figure standing between
            them. A scrim lifts the text off whatever is left of him at that
            height — without it the blurb sat on his jacket. */}
        <div className={`relative z-40 pt-16 pb-10 ${FRAME}`}>
          <div
            aria-hidden
            className="from-void via-void/85 pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[190%] bg-gradient-to-t to-transparent"
          />

          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            {/* Left: the one-line case, and where to find the rest. */}
            <Rise
              play={ready}
              delay={1.5}
              className="order-2 flex max-w-[30ch] flex-col gap-5 text-center lg:order-1 lg:w-[26%] lg:text-left"
            >
              <p className="label leading-relaxed">
                Full stack development with a cybersecurity habit — Python,
                FastAPI, Next.js, PostgreSQL.
              </p>

              <div className="flex items-center justify-center gap-6 lg:justify-start">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="label hover:text-chalk transition-colors duration-300"
                  >
                    <span className="after:bg-chalk relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-[width] after:duration-400 hover:after:w-full">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </Rise>

            {/* Centre: the actions, floating in front of the fade. */}
            <div className="order-1 flex flex-col items-center gap-8 lg:order-2">
              <Rise
                play={ready}
                delay={1.15}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <a
                  href="#work"
                  className="group text-void relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase"
                >
                  <span className="bg-chalk absolute inset-0 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-[1.7]" />
                  <span className="relative">Selected work</span>
                  <span className="relative transition-transform duration-500 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </a>

                <a
                  href={`mailto:${PROFILE.email}`}
                  className="group border-line text-chalk hover:border-chalk inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase backdrop-blur-sm transition-colors duration-500"
                >
                  Get in touch
                  <span className="bg-ash group-hover:bg-chalk h-1 w-1 rounded-full transition-colors duration-500" />
                </a>
              </Rise>

              {/* Scroll cue on the centre line, under the actions. */}
              <Rise play={ready} delay={1.7}>
                <a href="#work" className="group flex flex-col items-center gap-3">
                  <span className="label group-hover:text-chalk transition-colors duration-300">
                    Scroll
                  </span>
                  <span className="bg-line relative h-10 w-px overflow-hidden">
                    <motion.span
                      className="bg-chalk absolute inset-x-0 h-1/2"
                      animate={{ y: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.3,
                      }}
                    />
                  </span>
                </a>
              </Rise>
            </div>

            {/* Right: the numbers, stacked so the band closes on the gutter. */}
            <div className="order-3 flex flex-wrap justify-center gap-x-12 gap-y-7 lg:w-[26%] lg:flex-col lg:items-end lg:gap-y-6">
              <Stat
                value={String(PROJECTS.length).padStart(2, "0")}
                label="Featured builds"
                align="right"
                delay={1.3}
              />
              <Stat value="36" label="Public repos" align="right" delay={1.38} />
              <Stat
                value={"CSE ’28"}
                label={"LICET · Chennai"}
                align="right"
                delay={1.46}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-20">
        <Marquee />
      </div>
    </section>
  );
}
