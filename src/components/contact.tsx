"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { PROFILE, SOCIALS } from "@/lib/content";

import { MagneticName } from "./magnetic-name";
import { DrawLine, EASE, Magnetic, Reveal } from "./scroll-primitives";

/**
 * The dial standing beside the invitation. It is a beacon, not wallpaper:
 * a sweep going round, pings leaving it, a dot on orbit and the standing
 * offer set around the rim. Every part is hairline and monochrome, so it
 * holds the empty half of the section without pulling against the
 * headline lying over it.
 *
 * Entrance and rotation are split across nested elements on purpose — one
 * element cannot both settle once and turn forever on the same transform.
 */
function SignalField({ play }: { play: boolean }) {
  const reduceMotion = useReducedMotion();
  const turn = (duration: number, direction = 1) =>
    reduceMotion
      ? {}
      : {
          animate: { rotate: 360 * direction },
          transition: {
            duration,
            ease: "linear" as const,
            repeat: Infinity,
          },
        };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
      animate={play ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.6, ease: EASE }}
      className="relative size-[24rem] lg:size-[30rem]"
    >
      {/* The beam. Masked hollow so it reads as a sweep over the dial
          rather than a slice of pie. */}
      <motion.div
        {...turn(14)}
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(250,250,250,0.16)_46deg,transparent_92deg)]"
        style={{
          maskImage:
            "radial-gradient(closest-side, transparent 26%, #000 62%, #000 99%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent 26%, #000 62%, #000 99%, transparent 100%)",
        }}
      />

      {/* Pings, leaving on a stagger. The keyframe is already switched off
          under reduced motion in globals.css. */}
      {[0, 1].map((i) => (
        <span
          key={i}
          className="border-ash/40 animate-pulse-ring absolute inset-[34%] rounded-full border"
          style={{ animationDelay: `${i * 1.3}s` }}
        />
      ))}

      <span className="border-ash/30 absolute inset-0 rounded-full border" />
      <span className="border-ash/15 absolute inset-[26%] rounded-full border" />
      <span className="border-ash/25 absolute inset-[42%] rounded-full border" />

      {/* Ticks on the rim, every sixth one long enough to read as a bearing.
          Each one turns inside a box the size of the dial, so the pivot is
          the dial's centre at any breakpoint — a radius in rem would have
          to be restated every time the dial changes size. */}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${i * 15}deg)` }}
        >
          <span
            className={`absolute top-0 left-1/2 w-px -translate-x-1/2 ${
              i % 6 === 0 ? "bg-ash/70 h-4" : "bg-ash/30 h-2"
            }`}
          />
        </div>
      ))}

      {/* The dot on orbit, with the light it carries. */}
      <motion.div {...turn(11)} className="absolute inset-0">
        <span className="bg-chalk/25 absolute top-0 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md" />
        <span className="bg-chalk absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </motion.div>

      {/* The standing offer, set round the rim and turning against the beam. */}
      <motion.div {...turn(48, -1)} className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="size-full">
          <defs>
            <path
              id="contact-rim"
              fill="none"
              d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0"
            />
          </defs>
          <text
            className="fill-ash/70 font-mono"
            fontSize="4.1"
            letterSpacing="2.05"
          >
            <textPath href="#contact-rim">
              OPEN TO WORK · AVAILABLE FOR COLLABORATION · LET&apos;S BUILD ·
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Centre mark. */}
      <span className="bg-ash/40 absolute top-1/2 left-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2" />
      <span className="bg-ash/40 absolute top-1/2 left-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2" />
      <span className="bg-chalk absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </motion.div>
  );
}

export function Contact() {
  const anchor = useRef<HTMLDivElement>(null);
  const inView = useInView(anchor, { once: true, margin: "-25% 0px" });

  return (
    <section
      id="contact"
      className="border-line/60 relative scroll-mt-28 overflow-hidden border-t"
    >
      <div className="mx-auto max-w-[1500px] px-6 pt-24 pb-14 md:px-10 md:pt-36">
        <Reveal className="flex items-baseline gap-4">
          <span className="label shrink-0">06</span>
          <DrawLine className="translate-y-[-0.35em]" />
          <span className="label shrink-0">Open to work &amp; collaboration</span>
        </Reveal>

        {/* ---------- the invitation ---------- */}
        {/* Backdrop first, headline second — plain DOM order carries the
            stacking here (no z-index tug of war), so the field always
            paints under the type regardless of what else on the page is
            positioned. A negative z-index here previously let the layer
            escape behind the section's own background and vanish. */}
        <div ref={anchor} className="relative mt-14 md:mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-48 right-0 -bottom-48 left-0"
          >
            <span
              className="grid-veil absolute inset-0 opacity-80"
              style={{
                maskImage:
                  "radial-gradient(38% 62% at 20% 50%, #000 18%, transparent 76%)",
                WebkitMaskImage:
                  "radial-gradient(38% 62% at 20% 50%, #000 18%, transparent 76%)",
              }}
            />

            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1.4, ease: EASE }}
              className="animate-drift absolute top-1/2 left-[20%] h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_65%)] blur-3xl"
            />

            {/* Held back on phones — at that width the dial lands on top of
                the headline instead of beside it. */}
            <div className="absolute top-1/2 left-[20%] hidden -translate-x-1/2 -translate-y-1/2 md:block">
              <SignalField play={inView} />
            </div>
          </div>

          <h2 className="text-chalk relative flex justify-center text-center text-[clamp(2.4rem,13vw,12rem)] leading-[0.9] uppercase">
            <MagneticName
              text="Let's talk"
              play={inView}
              delay={0.05}
              stagger={0.03}
              className="tracking-[-0.075em]"
            />
          </h2>
        </div>

        <Reveal className="mt-14 flex justify-center md:mt-20" delay={0.1}>
          <Magnetic strength={0.28}>
            <a
              href={`mailto:${PROFILE.email}`}
              className="group text-void relative inline-flex max-w-full items-center gap-3 overflow-hidden rounded-full px-6 py-4 font-mono text-[10px] tracking-[0.1em] break-all uppercase sm:gap-4 sm:px-9 sm:py-5 sm:text-[11px] sm:tracking-[0.22em] md:text-xs"
            >
              <span className="bg-chalk absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-[1.5]" />
              <span className="relative">{PROFILE.email}</span>
              <span className="relative transition-transform duration-500 group-hover:translate-x-2">
                &rarr;
              </span>
            </a>
          </Magnetic>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={0.15}>
          <p className="text-smoke mx-auto max-w-[52ch] text-center text-sm leading-relaxed md:text-base">
            Currently a third-year CSE undergraduate in Chennai, open to
            internships, freelance builds and anything where the problem is real.
            The fastest way to reach me is email.
          </p>
        </Reveal>

        {/* ---------- the résumé ---------- */}
        {/* The hero button opens the file; this one hands it over. Same PDF,
            served straight out of /public, so the download is same-origin and
            needs no third-party viewer. */}
        <Reveal className="mt-10 flex justify-center" delay={0.2}>
          <a
            href={PROFILE.resume}
            download="Mithilesh-KS-Resume.pdf"
            className="group border-line hover:border-ash bg-coal/40 inline-flex items-center gap-4 rounded-full border py-3 pr-4 pl-6 transition-colors duration-500"
          >
            <span className="text-chalk font-mono text-[11px] tracking-[0.2em] uppercase">
              Download r&eacute;sum&eacute;
            </span>
            <span className="text-ash group-hover:text-chalk font-mono text-[10px] tracking-[0.16em] transition-colors duration-500">
              PDF
            </span>
            <span className="border-line bg-void group-hover:border-ash flex size-8 items-center justify-center rounded-full border transition-colors duration-500">
              <span
                aria-hidden
                className="text-chalk transition-transform duration-500 group-hover:translate-y-0.5"
              >
                &darr;
              </span>
            </span>
          </a>
        </Reveal>

        {/* ---------- links ---------- */}
        {/* One per row on phones; the columned rank only from md, which is
            also where the dividers below switch from top rules to left ones. */}
        <div
          className="mt-16 grid grid-cols-1 gap-px md:mt-24 md:[grid-template-columns:repeat(var(--social-columns),minmax(0,1fr))]"
          style={
            { "--social-columns": SOCIALS.length } as React.CSSProperties
          }
        >
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
              className="group border-line/70 hover:bg-coal/60 relative border-t px-1 py-8 transition-colors duration-500 md:border-t-0 md:border-l md:px-6 md:first:border-l-0"
            >
              <span className="label group-hover:text-chalk transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-chalk mt-3 flex items-center justify-between text-xl font-light tracking-[-0.03em] md:text-2xl">
                {social.label}
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1">
                  &#8599;
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ---------- footer ---------- */}
      <footer className="border-line/70 border-t">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-5 px-6 py-7 md:px-10">
          <p className="label">
            &copy; {new Date().getFullYear()} {PROFILE.name}
          </p>
          <p className="label">{PROFILE.location}</p>
          <p className="label hidden sm:block">Built with Next.js &amp; Motion</p>
          <a href="#top" className="label hover:text-chalk transition-colors duration-300">
            Back to top &uarr;
          </a>
        </div>
      </footer>

      {/* The name, enormous and half-sunk off the bottom edge. */}
      <div aria-hidden className="pointer-events-none overflow-hidden">
        <p className="text-coal translate-y-[20%] text-center text-[13.5vw] leading-[0.8] font-black tracking-[-0.055em] whitespace-nowrap uppercase select-none">
          Mithilesh KS
        </p>
      </div>
    </section>
  );
}
