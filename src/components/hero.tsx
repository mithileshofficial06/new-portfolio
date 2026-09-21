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
import { HeroAura } from "./hero-aura";
import { useIntroReady } from "./intro-context";
import { MagneticName } from "./magnetic-name";
import { Marquee } from "./marquee";
import { FIGURE_BOX, Portrait } from "./portrait";
import { Rise } from "./reveal-text";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared gutter, so every block closes on the same margin as the nav. */
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

          Three layers, and they have to be siblings to stack: the shell
          turning behind the figure (10), the type in its own column to the
          left (20), the figure himself (30 from lg). */}
      <motion.div
        className="relative flex flex-1 flex-col"
        style={reduceMotion ? undefined : { y: lift, opacity: fade }}
      >
        <Atmosphere />

        {/* ---------- layer 10: the shell ---------- */}
        {/* Laid out exactly like the figure, then the canvas is centred on
            his upper body from inside that box — so it rides out to the right
            gutter with him and scales with him, not with the page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center lg:justify-end lg:pr-10"
        >
          <div className={FIGURE_BOX}>
            <motion.div
              className="absolute top-[38%] left-1/2 aspect-square w-[138%] -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={ready ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 2.4, ease: EASE, delay: 0.55 }}
            >
              <HeroAura className="h-full w-full" />
            </motion.div>
          </div>
        </div>

        <Crosshairs />

        <Rail side="left">Portfolio — Edition 2026</Rail>
        <Rail side="right" delay={1.58}>
          {PROFILE.coordinates}
        </Rail>

        <Portrait />

        {/* ---------- layer 20: the type ---------- */}
        <div
          className={`relative z-20 flex flex-1 flex-col pt-24 pb-9 md:pt-28 ${FRAME}`}
        >
          {/* Held out of the right third on wide screens, so the column sits
              in the space he is looking into rather than behind him. */}
          <motion.div
            className="flex flex-col items-center lg:pr-[36%] xl:pr-[32%]"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
            animate={
              ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined
            }
            transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
          >
            <Rise play={ready} delay={0.3}>
              <span className="border-line/80 bg-void/40 flex items-center gap-3 rounded-full border px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="bg-chalk animate-pulse-ring absolute inset-0 rounded-full" />
                  <span className="bg-chalk relative h-1.5 w-1.5 rounded-full" />
                </span>
                <span className="label">Available for projects</span>
              </span>
            </Rise>

            <h1 className="text-chalk mt-8 flex text-center text-[clamp(2rem,7.2vw,7.25rem)] leading-[0.92] uppercase md:mt-10">
              <MagneticName
                text="Mithilesh KS"
                play={ready}
                delay={0.45}
                stagger={0.038}
                className="tracking-[-0.085em]"
              />
            </h1>

            {/* Role and place, back on one centred line under the name — with
                the figure in his own column there is nothing here to hit. */}
            <div className="mt-6 flex items-center gap-5 md:mt-7">
              <motion.span
                aria-hidden
                className="via-line hidden h-px w-14 bg-gradient-to-r from-transparent to-transparent sm:block"
                initial={{ scaleX: 0 }}
                animate={ready ? { scaleX: 1 } : undefined}
                transition={{ duration: 1.1, ease: EASE, delay: 1.2 }}
              />

              <div className="flex overflow-hidden">
                <motion.p
                  className="flex flex-wrap items-baseline justify-center gap-x-2.5 text-center text-[clamp(0.9rem,1.9vw,1.4rem)] leading-tight tracking-[-0.02em]"
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

              <motion.span
                aria-hidden
                className="via-line hidden h-px w-14 bg-gradient-to-r from-transparent to-transparent sm:block"
                initial={{ scaleX: 0 }}
                animate={ready ? { scaleX: 1 } : undefined}
                transition={{ duration: 1.1, ease: EASE, delay: 1.2 }}
              />
            </div>

            <Rise
              play={ready}
              delay={1.15}
              className="mt-11 flex flex-wrap items-center justify-center gap-4 md:mt-14"
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

              {/* Opens rather than downloads — a click that silently drops a
                  file in someone's downloads folder is a worse first move
                  than showing them the thing. */}
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noreferrer"
                className="group border-line text-chalk hover:border-chalk inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] uppercase backdrop-blur-sm transition-colors duration-500"
              >
                Resume
                <span className="relative transition-transform duration-500 group-hover:translate-y-0.5">
                  &darr;
                </span>
              </a>
            </Rise>

            {/* The numbers close the column. Without them the middle of the
                left half was a hole with the actions floating at the top of
                it — they carry their own weight here, whatever About does
                with the same figures further down. */}
            <div className="mt-14 flex flex-wrap justify-center gap-x-14 gap-y-8 md:mt-20">
              <Stat
                value={String(PROJECTS.length).padStart(2, "0")}
                label="Featured builds"
                delay={1.3}
              />
              <Stat value="36" label="Public repos" delay={1.38} />
              <Stat
                value={"CSE ’28"}
                label={"LICET · Chennai"}
                delay={1.46}
              />
            </div>
          </motion.div>

          {/* ---------- the base line ---------- */}
          {/* Runs the full width: the case and the links stay left of him,
              the scroll cue closes the frame on his side, in front of the
              fade where his legs give out. */}
          <div className="relative z-40 mt-auto flex w-full flex-wrap items-end justify-between gap-8 pt-16">
            <Rise
              play={ready}
              delay={1.45}
              className="flex max-w-[17rem] flex-col gap-5"
            >
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
            </Rise>

            <Rise play={ready} delay={1.7}>
              <a
                href="#work"
                className="group flex items-center gap-3"
                aria-label="Scroll to selected work"
              >
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
        </div>
      </motion.div>

      <div className="relative z-20">
        <Marquee />
      </div>
    </section>
  );
}
