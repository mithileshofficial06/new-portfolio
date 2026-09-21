"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { NAV_LINKS, PROFILE, SOCIALS } from "@/lib/content";

const EASE = [0.76, 0, 0.24, 1] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // The portal target only exists in the browser. Safe against hydration
  // mismatch because the panel is always closed on first paint, so both
  // renders emit nothing.
  const canPortal = typeof document !== "undefined";

  // Lock the page and allow Escape out.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="text-chalk relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
      >
        <motion.span
          className="bg-chalk block h-px w-5"
          animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.span
          className="bg-chalk block h-px w-5"
          animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </button>

      {/* Portalled to the body: the nav animates a transform, and a
          transformed ancestor makes `position: fixed` resolve against itself,
          which trapped this panel inside the 85px-tall header. */}
      {canPortal &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="bg-void fixed inset-0 z-90 flex flex-col justify-between px-6 pt-28 pb-10 md:hidden"
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link, i) => (
                    <div key={link.href} className="overflow-hidden">
                      <motion.a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-chalk block py-2 text-[clamp(2.5rem,13vw,4.5rem)] leading-[1.05] font-extralight tracking-[-0.06em] uppercase"
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.12 + i * 0.07,
                        }}
                      >
                        {link.label}
                      </motion.a>
                    </div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-line mb-6 h-px w-full" />
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={
                          social.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noreferrer"
                        className="label"
                      >
                        {social.label} &#8599;
                      </a>
                    ))}
                  </div>
                  <p className="label mt-6">{PROFILE.email}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
