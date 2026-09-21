"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { WHY } from "@/lib/content";

import { EASE, SectionHeading } from "./scroll-primitives";

/** How long an unattended panel holds before the deck moves on. */
const CYCLE = 5200;

/** Counts up from zero every time it mounts — one panel opening, one run. */
function Tally({ value, suffix = "" }: { value: number; suffix?: string }) {
  const reduceMotion = useReducedMotion();
  // Always starts at zero, on both sides of hydration. Reduced motion jumps
  // to the value on the next frame rather than setting state during render.
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      const jump = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(jump);
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / 900, 1);
      setShown(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  return (
    <span className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}

/** The open panel's body. Mounted on open, so its counters run each time. */
function PanelBody({ item }: { item: (typeof WHY)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      className="flex h-full flex-col justify-between"
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="label text-chalk">{item.index}</span>
        <span className="label tabular-nums">
          {String(WHY.length).padStart(2, "0")}
        </span>
      </div>

      <div>
        {/* The number lands first and gives the claim underneath it a size. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="mb-7 flex items-baseline gap-3"
        >
          <span className="font-display text-chalk text-[clamp(2.4rem,3.4vw,3.6rem)] leading-none tracking-[-0.04em]">
            <Tally value={item.metric.value} suffix={item.metric.suffix} />
          </span>
          <span className="text-ash max-w-[14ch] font-mono text-[10px] leading-snug tracking-[0.14em] uppercase">
            {item.metric.label}
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          className="font-display text-chalk text-[clamp(1.6rem,2.3vw,2.4rem)] leading-[1.02] tracking-[-0.035em] uppercase"
        >
          {item.title}
        </motion.h3>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.22 }}
          className="bg-ash/60 my-6 block h-px origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.26 }}
          className="text-smoke text-sm leading-relaxed"
        >
          {item.body}
        </motion.p>

        {/* Evidence, one chip at a time. */}
        <ul className="mt-7 flex flex-wrap gap-2">
          {item.proof.map((proof, i) => (
            <motion.li
              key={proof}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.34 + i * 0.08 }}
              className="border-line bg-void/50 text-ash rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase"
            >
              {proof}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/**
 * The open panel's right-hand field.
 *
 * The copy column is pinned to a fixed width so it cannot rewrap mid-slide,
 * which leaves everything right of it empty once the panel is at full stretch.
 * This fills that ground without competing with the text: rings, a drifting
 * bloom, the panel's own number cut as an outline, and the short label stood
 * on end along the edge — all of it faint, and none of it clickable.
 */
function PanelField({ item }: { item: (typeof WHY)[number] }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 1, ease: EASE, delay: 0.22 }}
      className="pointer-events-none absolute inset-y-0 right-0 left-[min(30vw,27rem)] overflow-hidden"
    >
      {/* Bloom, drifting on the long loop the atmosphere uses. */}
      <span className="absolute top-1/4 -right-24 size-[28rem] animate-[drift_22s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(250,250,250,0.07),transparent_68%)]" />

      {/* Rings, hung off the top corner and clipped by the panel. */}
      <motion.span
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        className="border-line absolute -top-28 -right-24 size-[27rem] rounded-full border"
      />
      <motion.span
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.38 }}
        className="border-line/60 absolute -top-14 -right-10 size-[17rem] rounded-full border"
      />

      {/* A tick per claim, filled up to this one. */}
      <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
        {WHY.map((tick) => (
          <span
            key={tick.index}
            className={`h-px transition-all duration-700 ${
              tick.index === item.index ? "bg-ash w-9" : "bg-line w-4"
            }`}
          />
        ))}
      </div>

      {/* The short label stood on end, hard against the edge. */}
      <motion.span
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
        className="text-ash/45 absolute right-4 bottom-10 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] tracking-[0.34em] uppercase"
      >
        {item.short}
      </motion.span>

      {/* The panel's own number, cut as an outline and left to hang. */}
      <motion.span
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.34 }}
        className="font-display absolute right-12 -bottom-4 text-[clamp(8rem,13vw,14rem)] leading-[0.72] tracking-[-0.06em] text-transparent opacity-30 select-none [-webkit-text-stroke:1px_var(--color-line)]"
      >
        {item.index}
      </motion.span>
    </motion.div>
  );
}

/**
 * Six panels stood on end. The open one squeezes the rest to their spines, so
 * the section reads as a single object that redistributes rather than six
 * cards competing for attention.
 *
 * The deck advances on its own while it is on screen and nobody is touching
 * it — a visitor who never moves the pointer still sees all six. Any hover,
 * focus or arrow key hands control back and stops the timer.
 *
 * The open panel's copy is held at a fixed width and simply clipped while the
 * panel is narrow — letting it reflow as the flex basis animates made the text
 * rewrap on every frame.
 */
function Panels() {
  const reduceMotion = useReducedMotion();
  const deck = useRef<HTMLDivElement>(null);
  const inView = useInView(deck, { margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  const running = !held && inView && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % WHY.length),
      CYCLE,
    );
    return () => window.clearTimeout(id);
  }, [active, running]);

  return (
    <div className="mt-14 hidden lg:block">
      <div
        ref={deck}
        aria-label="How I work"
        tabIndex={0}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          setHeld(true);
          setActive((i) =>
            event.key === "ArrowRight"
              ? (i + 1) % WHY.length
              : (i - 1 + WHY.length) % WHY.length,
          );
        }}
        className="flex h-[32rem] gap-3 focus-visible:outline-none"
      >
        {WHY.map((item, i) => {
          const isOpen = active === i;

          return (
            <motion.article
              key={item.index}
              aria-expanded={isOpen}
              onPointerEnter={() => setActive(i)}
              onFocus={() => {
                setHeld(true);
                setActive(i);
              }}
              tabIndex={0}
              initial={reduceMotion ? false : { opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.07 }}
              style={{ flexGrow: isOpen ? 4 : 0.6, flexBasis: 0 }}
              className={`group relative cursor-default overflow-hidden rounded-[26px] border transition-[flex-grow,background-color,border-color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none ${
                isOpen
                  ? "border-ash/45 bg-coal"
                  : "border-line bg-pit hover:border-ash/30"
              }`}
            >
              <span aria-hidden className="grid-veil absolute inset-0 opacity-30" />

              <AnimatePresence>
                {isOpen && <PanelField key={`field-${item.index}`} item={item} />}
              </AnimatePresence>

              {/* Light pooled in the corner of whichever panel is open. */}
              <span
                aria-hidden
                className={`absolute -top-24 -left-16 h-64 w-72 rounded-full bg-[radial-gradient(circle,rgba(250,250,250,0.1),transparent_70%)] transition-opacity duration-700 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              />

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
                <span className="bg-line group-hover:bg-ash h-10 w-px transition-colors duration-500" />
              </div>

              {/* Open panel. Width is pinned so the copy never rewraps mid-slide. */}
              <div
                className={`absolute inset-y-0 left-0 flex w-[min(30vw,27rem)] flex-col justify-between p-9 transition-opacity duration-500 ${
                  isOpen ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isOpen && <PanelBody key={item.index} item={item} />}
                </AnimatePresence>
              </div>

              {/* The timer, drawn along the foot of the panel it is counting. */}
              {isOpen && running && (
                <motion.span
                  key={`bar-${active}`}
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: CYCLE / 1000, ease: "linear" }}
                  className="bg-chalk/70 absolute inset-x-0 bottom-0 h-px origin-left"
                />
              )}
            </motion.article>
          );
        })}
      </div>

      {/* Tally and a word on who is driving. */}
      <div className="border-line mt-6 flex items-baseline justify-between border-t pt-4">
        <p className="label">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(WHY.length).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={held ? "held" : "auto"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="label"
          >
            {held ? "Yours — arrow keys work" : "Cycling · hover to hold"}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Small screens get the same six as an accordion, one open at a time. */
function Stacked() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-12 flex flex-col lg:hidden">
      {WHY.map((item, i) => {
        const isOpen = open === i;

        return (
          <motion.article
            key={item.index}
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
            className="border-line border-t first:border-t-0"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-baseline gap-4 py-6 text-left"
            >
              <span className="label shrink-0">{item.index}</span>
              <h3
                className={`font-display flex-1 text-xl leading-tight tracking-[-0.03em] uppercase transition-colors duration-400 ${
                  isOpen ? "text-chalk" : "text-smoke"
                }`}
              >
                {item.title}
              </h3>
              <span
                aria-hidden
                className={`text-ash shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-7">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-chalk text-3xl leading-none tracking-[-0.04em]">
                        <Tally
                          value={item.metric.value}
                          suffix={item.metric.suffix}
                        />
                      </span>
                      <span className="text-ash font-mono text-[10px] tracking-[0.14em] uppercase">
                        {item.metric.label}
                      </span>
                    </div>

                    <p className="text-smoke mt-4 text-sm leading-relaxed">
                      {item.body}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.proof.map((proof) => (
                        <li
                          key={proof}
                          className="border-line text-ash rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase"
                        >
                          {proof}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
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
          title="How I work"
          aside="The short case"
        />
        <Panels />
        <Stacked />
      </div>
    </section>
  );
}
