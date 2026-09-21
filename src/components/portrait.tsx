"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { useIntroReady } from "./intro-context";

/**
 * The background-removed subject, planted bottom-right on the page gutter.
 *
 * He is looking off to his right, so he sits on the right with the type in the
 * space he is looking into — the figure reads as facing the content instead of
 * away from it. Bottom-anchored and flush to the same gutter as the nav, so he
 * is grounded on the grid rather than floating in it. No pointer tracking: a
 * portrait that drifts with the cursor reads as a sticker, not a subject.
 */
export function Portrait() {
  const ready = useIntroReady();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center lg:z-30 lg:justify-end lg:pr-10"
    >
      <motion.div
        className="relative h-[46%] w-[min(72vw,380px)] sm:h-[58%] lg:h-[90%] lg:w-[min(43vw,600px)]"
        initial={{ opacity: 0, y: 46, scale: 1.04 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {/* Rim glow — separates a black suit from a black page. */}
        <div className="absolute inset-0 -z-10 translate-y-[8%] scale-[1.16] bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,255,255,0.15),transparent_64%)] blur-2xl" />

        <Image
          src="/profile-cut.png"
          alt="Mithilesh KS"
          fill
          priority
          sizes="(max-width: 1024px) 80vw, 43vw"
          /* Pushed well back on small screens, where he sits behind the type
             instead of beside it. */
          className="object-contain object-bottom [filter:grayscale(1)_contrast(1.05)_brightness(0.3)] lg:[filter:grayscale(1)_contrast(1.1)_brightness(0.97)]"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 68%, rgba(0,0,0,0.45) 91%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 68%, rgba(0,0,0,0.45) 91%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
