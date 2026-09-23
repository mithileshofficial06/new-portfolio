"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import { useIntroReady } from "./intro-context";

/**
 * The figure's box. The shell behind him lays out with the same string, so
 * the animation stays centred on him at every width rather than being pinned
 * to coordinates that only hold on one screen — and the two cannot drift
 * apart the way two copies of it would.
 *
 * Below lg he is given a band of his own along the foot of the stage rather
 * than standing behind the type: the column above reserves exactly this height
 * as bottom padding, so the two never meet on a phone the way they do in the
 * desktop two-column split. Sized in svh for that reason — a percentage would
 * resolve against a stage that grows with its own content.
 */
export const FIGURE_BOX =
  "relative h-[34svh] w-[min(80vw,340px)] sm:h-[40svh] sm:w-[min(62vw,400px)] lg:h-[90%] lg:w-[min(40vw,600px)]";

/**
 * The background-removed subject, planted bottom-right on the page gutter.
 *
 * He is looking off to his right, so he sits on the right with the type in
 * the space he is looking into — the figure reads as facing the content
 * instead of away from it. Bottom-anchored and flush to the same gutter as
 * the nav, so he is grounded on the grid rather than floating in it. No
 * pointer tracking — a portrait that drifts with the cursor reads as a
 * sticker, not a subject. He takes no scroll movement of his own either: the
 * stage already carries him, and measuring him for a parallax of his own
 * means measuring an element inside a transformed ancestor, which came back
 * wrong and scaled him off the right edge of the frame. The shell turning
 * behind him is what makes the corner live.
 */
export function Portrait() {
  const ready = useIntroReady();
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center lg:z-30 lg:justify-end lg:pr-10"
    >
      {/* He settles out of a slight oversize as he lands. */}
      <motion.div
        className={FIGURE_BOX}
        initial={reduceMotion ? false : { opacity: 0, y: 38, scale: 1.07 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Rim glow — separates a black suit from a black page. Deliberately
            outside the clip below: run through it, its own rectangle gets a
            hard top edge and the reveal drags a visible seam across the
            frame. The glow just fades with the rest of him. */}
        <div className="absolute inset-0 -z-10 translate-y-[8%] scale-[1.16] bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,255,255,0.15),transparent_64%)] blur-2xl" />

        {/* He is uncovered from the floor up rather than faded in on the
            spot: the clip's top edge climbs him, so he reads as rising into
            the frame behind a curtain leaving it the same way. */}
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Image
            src="/profile-cut.png"
            alt="Mithilesh KS"
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 40vw"
            className="object-contain object-bottom [filter:grayscale(1)_contrast(1.08)_brightness(0.86)] lg:[filter:grayscale(1)_contrast(1.1)_brightness(0.97)]"
            style={{
              maskImage:
                "linear-gradient(to bottom, #000 62%, rgba(0,0,0,0.4) 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 62%, rgba(0,0,0,0.4) 88%, transparent 100%)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
