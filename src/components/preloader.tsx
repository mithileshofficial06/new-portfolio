"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { IntroContext } from "./intro-context";

const COUNT_MS = 1500;
const HOLD_MS = 260;

export function Preloader({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Count 0 → 100 on rAF, hold a beat, then lift the curtain. Reduced motion
  // collapses both durations to zero rather than taking a separate path.
  useEffect(() => {
    const duration = reduceMotion ? 0 : COUNT_MS;
    const hold = reduceMotion ? 0 : HOLD_MS;
    const start = performance.now();
    let frame = 0;
    let timer = 0;

    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      // ease-out cubic so the last digits crawl — reads deliberate, not fake.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else timer = window.setTimeout(() => setReady(true), hold);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  // Freeze the page behind the curtain.
  useEffect(() => {
    if (ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [ready]);

  return (
    <IntroContext value={ready}>
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="curtain"
            className="bg-void fixed inset-0 z-120 flex flex-col justify-between px-6 py-8 md:px-10 md:py-10"
            exit={{ y: "-101%" }}
            transition={{
              duration: reduceMotion ? 0 : 1,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <motion.span
              className="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Mithilesh&nbsp;KS
            </motion.span>

            <div className="flex items-end justify-between gap-6">
              <motion.p
                className="text-smoke max-w-[22ch] font-mono text-[11px] leading-[1.9] tracking-[0.14em] uppercase"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Developer
                <br />
                &amp; Designer
                <br />
                Chennai, IN
              </motion.p>

              <span className="font-display text-chalk text-[22vw] leading-[0.78] font-black tracking-[-0.05em] tabular-nums md:text-[13vw]">
                {String(progress).padStart(3, "0")}
              </span>
            </div>

            {/* The literal read of progress. */}
            <div className="bg-line mt-8 h-px w-full overflow-hidden">
              <div
                className="bg-chalk h-full origin-left"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </IntroContext>
  );
}
