"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";

import { NAV_LINKS, PROFILE } from "@/lib/content";

import { CylinderWordmark } from "./cylinder-wordmark";
import { useIntroReady } from "./intro-context";
import { MobileMenu } from "./mobile-menu";

function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  // Rendered client-only — the server has no business guessing the clock.
  useEffect(() => {
    const read = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: PROFILE.timezone,
        }).format(new Date()),
      );

    read();
    const id = window.setInterval(read, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="label hidden tabular-nums lg:inline-block">
      Chennai {time ?? "--:--:--"}
    </span>
  );
}

/** Tracks which section owns the viewport so the nav can mark it. */
function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function Nav() {
  const ready = useIntroReady();
  const active = useActiveSection();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 40);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-100"
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      <div
        className={`border-line/80 mx-auto flex max-w-[1600px] items-center justify-between border-b px-6 transition-[padding,background-color,backdrop-filter] duration-500 md:px-10 ${
          condensed ? "bg-void/70 py-3 backdrop-blur-xl" : "py-5 backdrop-blur-[2px]"
        }`}
      >
        {/* Wordmark set in the serif — the one voice in the page that isn't
            grotesk or mono. Every letter rides its own drum and rolls
            forever, the turn travelling left to right, so the mark is the
            logo. Below sm only the M is left standing. */}
        <a
          href="#top"
          className="text-chalk font-serif text-xl leading-none tracking-[-0.01em] md:text-2xl"
        >
          <CylinderWordmark text={PROFILE.name} collapseAfter={0} />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`label relative py-1 transition-colors duration-300 ${
                  isActive ? "text-chalk" : "hover:text-chalk"
                }`}
              >
                <span className="relative">
                  {link.label}
                  <span
                    className={`bg-chalk absolute -bottom-1 left-0 h-px transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <LocalClock />
          <a
            href={`mailto:${PROFILE.email}`}
            className="border-line text-chalk hover:bg-chalk hover:text-void hidden rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-400 lg:inline-block"
          >
            Let&rsquo;s talk
          </a>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
