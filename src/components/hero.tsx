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
          left him hanging in an empty frame. */}
      <motion.div
        className="relative flex flex-1 flex-col"
        style={reduceMotion ? undefined : { y: lift, opacity: fade }}
      >
        <Atmosphere />
        <Portrait />
        <Crosshairs />

        <Rail side="left">Portfolio — Edition 2026</Rail>
        <Rail side="right" delay={1.58}>
          {PROFILE.coordinates}
        </Rail>

        <div className="relative z-20 flex flex-1 flex-col justify-center px-6 pt-28 pb-10 md:px-10">
          {/* The whole block eases forward once the curtain lifts. */}
          {/* Padded off the right edge on wide screens so the composition sits
            left of the figure rather than behind him. */}
          <motion.div
            className="mx-auto w-full max-w-[1500px] lg:pr-[30%]"
            initial={{ opacity: 0, scale: 0.965, filter: "blur(10px)" }}
            animate={
              ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined
            }
            transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
          >
            <Rise
              play={ready}
              delay={0.3}
              className="mb-9 flex justify-center md:mb-12"
            >
              <span className="border-line/80 bg-void/40 flex items-center gap-3 rounded-full border px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="bg-chalk animate-pulse-ring absolute inset-0 rounded-full" />
                  <span className="bg-chalk relative h-1.5 w-1.5 rounded-full" />
                </span>
                <span className="label">Available for projects</span>
              </span>
            </Rise>

            {/* ---------- the name ---------- */}
            <h1 className="text-chalk flex justify-center text-center text-[clamp(1.9rem,7.4vw,7.25rem)] leading-[0.95] uppercase">
              <MagneticName
                text="Mithilesh KS"
                play={ready}
                delay={0.45}
                stagger={0.038}
                className="tracking-[-0.085em]"
              />
            </h1>

            {/* ---------- the role ---------- */}
            <div className="mt-5 flex justify-center overflow-hidden md:mt-7">
              <motion.p
                className="text-smoke flex flex-wrap items-baseline justify-center gap-x-2.5 text-center text-[clamp(1rem,2.5vw,1.85rem)] leading-tight tracking-[-0.03em]"
                initial={{ y: "115%" }}
                animate={ready ? { y: "0%" } : undefined}
                transition={{
                  duration: reduceMotion ? 0 : 1.1,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 1.0,
                }}
              >
                <span className="text-chalk font-light uppercase">
                  Developer
                </span>
                <span className="text-ash font-serif italic">&amp;</span>
                <span className="text-chalk font-light uppercase">
                  Designer
                </span>
                <span className="bg-line mx-2 hidden h-4 w-px sm:inline-block" />
                <span className="text-ash font-serif italic">
                  Chennai, India
                </span>
              </motion.p>
            </div>

            {/* ---------- actions ---------- */}
            <div className="mt-12 md:mt-14">
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
            </div>

            {/* Stats sit inside the left column rather than flanking the
                headline — as a three-up they ran straight under the figure. */}
            <div className="mt-14 flex flex-wrap justify-center gap-x-14 gap-y-8 md:mt-20">
              <Stat
                value={String(PROJECTS.length).padStart(2, "0")}
                label="Featured builds"
                delay={1.3}
              />
              <Stat value="36" label="Public repos" delay={1.38} />
              <Stat value="CSE ’28" label="LICET · Chennai" delay={1.46} />
            </div>
          </motion.div>

          {/* ---------- bottom rail ---------- */}
          <Rise
            play={ready}
            delay={1.55}
            className="relative z-40 mx-auto mt-auto flex w-full max-w-[1500px] flex-wrap items-end justify-between gap-6 pt-14"
          >
            {/* Both stacked on the left, clear of the figure — laid out
                across the full width the blurb ran under his jacket. */}
            <div className="flex max-w-[34ch] flex-col gap-5">
              <p className="label leading-relaxed">
                Full stack development with a cybersecurity habit — Python,
                FastAPI, Next.js, PostgreSQL.
              </p>

              <div className="flex items-center gap-6">
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
            </div>

            <a href="#work" className="group flex items-center gap-3">
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
      </motion.div>

      <div className="relative z-20">
        <Marquee />
      </div>
    </section>
  );
}
