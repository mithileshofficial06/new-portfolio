"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { PROFILE, SOCIALS } from "@/lib/content";

import { MagneticName } from "./magnetic-name";
import { DrawLine, EASE, Magnetic, Reveal } from "./scroll-primitives";

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
          <span className="label shrink-0">04</span>
          <DrawLine className="translate-y-[-0.35em]" />
          <span className="label shrink-0">Open to work &amp; collaboration</span>
        </Reveal>

        {/* ---------- the invitation ---------- */}
        <div ref={anchor} className="mt-14 md:mt-20">
          <h2 className="text-chalk flex justify-center text-center text-[clamp(2.4rem,13vw,12rem)] leading-[0.9] uppercase">
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
              className="group text-void relative inline-flex items-center gap-4 overflow-hidden rounded-full px-9 py-5 font-mono text-[11px] tracking-[0.22em] uppercase md:text-xs"
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

        {/* ---------- links ---------- */}
        <div
          className="mt-16 grid gap-px md:mt-24"
          style={{
            gridTemplateColumns: `repeat(${SOCIALS.length}, minmax(0, 1fr))`,
          }}
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
