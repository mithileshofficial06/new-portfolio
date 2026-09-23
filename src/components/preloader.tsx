"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { IntroContext } from "./intro-context";

const COUNT_MS = 1100;
const HOLD_MS = 180;
const GREETING_MS = 90;

/** "Hello" — one per language, cycled while the counter runs. */
const HELLOS = [
  "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Привет", "你好",
  "こんにちは", "안녕하세요", "مرحبا", "नमस्ते", "নমস্কার", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "வணக்கம்", "నమస్కారం", "ನಮಸ್ಕಾರ", "നമസ്കാരം", "નમસ્તે", "ଓଡ଼ିଆ ନମସ୍କାର",
  "Xin chào", "สวัสดี", "Halo", "Kumusta", "Habari", "Sawubona",
  "Molo", "Selam", "Sannu", "Bawo", "Ndewo", "Iska warran",
  "Merhaba", "سلام", "שלום", "Γειά σου", "Cześć", "Ahoj",
  "Szia", "Salut", "Здравей", "Привіт", "Bok", "Zdravo",
  "Përshëndetje", "Labas", "Sveiki", "Tere",
  "Hei", "Hej", "Halló", "Dia dhuit", "Shwmae", "Halò",
  "Kaixo", "Ola", "Bongu", "გამარჯობა", "Բարեւ",
  "Sälem", "Salom", "Сайн байна уу", "ආයුබෝවන්", "សួស្តី",
  "ສະບາຍດີ", "မင်္ဂလာပါ", "བཀྲ་ཤིས་བདེ་ལེགས།", "سلام علیکم",
  "Bonjou", "Talofa", "Kia ora", "Aloha", "Bula", "Malo e lelei",
  "Saluton", "Salve", "Moni", "Mhoro", "Dumela",
  "Jambo", "Akwaaba", "Barka", "Yassou", "Konnichiwa",
];

/**
 * Cycles the world's "hello"s in the center for as long as the curtain is up.
 *
 * No AnimatePresence/exit here on purpose — with a change this rapid, an
 * unmount-then-remount pair queues up faster than it can play out, which is
 * what read as flicker. A single element that never drops below half opacity
 * and re-triggers its own fade on every key change stays continuous instead.
 */
function Greeting({ running }: { running: boolean }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running || reduceMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % HELLOS.length),
      GREETING_MS,
    );
    return () => window.clearInterval(id);
  }, [running, reduceMotion]);

  return (
    /* Below lg the greeting is held to the empty band above the counter.
       Centred on the whole curtain it landed on top of the count, which at
       22vw is wide enough on a phone to reach the middle of the screen —
       on a desktop the count sits far enough right that the two clear. */
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 bottom-[18%] flex items-center justify-center px-6 lg:bottom-0"
    >
      <motion.span
        key={reduceMotion ? "static" : index}
        initial={reduceMotion ? false : { opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: GREETING_MS / 1000, ease: "linear" }}
        className="font-sans text-chalk text-center text-[clamp(1.6rem,5vw,3rem)] leading-none font-bold"
      >
        {HELLOS[index]}
      </motion.span>
    </div>
  );
}

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

            <Greeting running={!ready} />

            {/* `mt-auto` below lg swallows the free space above, so the count
                settles onto the rule it is reading out rather than floating in
                the middle of a tall phone with the rule stranded beneath it. */}
            <div className="mt-auto flex items-end justify-between gap-6 lg:mt-0">
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
