# mithilesh-ks.portfolio

Personal portfolio for **Mithilesh KS** — developer and designer, Chennai.
Monochrome, dark, and animation-led: a Dock-style magnifying wordmark, a
background-removed portrait, and scroll-driven reveals throughout.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lenis

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run lint
npx tsc --noEmit             # typecheck
```

---

## How it is put together

```
src/
  app/
    layout.tsx             fonts, metadata
    page.tsx               section order
    globals.css            design tokens, keyframes, utilities
    icon.svg               serif M mark
    opengraph-image.tsx    generated share card
  components/
    preloader.tsx          counter curtain; gates every entry animation
    intro-context.tsx      broadcasts "the curtain is up"
    nav.tsx                active-section tracking, live Chennai clock
    mobile-menu.tsx        full-screen panel, portalled to body
    hero.tsx               the opening composition
    magnetic-name.tsx      the Dock magnifier
    portrait.tsx           the cut-out figure
    atmosphere.tsx         grid, drifting light, vignette
    about.tsx projects.tsx archive.tsx stack.tsx contact.tsx
    scroll-primitives.tsx  the shared motion vocabulary
    velocity-marquee.tsx   band that tracks scroll speed and direction
    smooth-scroll.tsx      Lenis + progress bar
  lib/
    content.ts             every fact the site renders
```

**All copy and data live in `src/lib/content.ts`.** Projects, stack, timeline,
links and stats are edited there; the sections are presentational.

### The name magnifier

`magnetic-name.tsx` is the one genuinely fiddly piece. Archivo is loaded as a
**variable** font, so each character can be driven along `wght` (140 → 780) and
`wdth` independently.

The Dock feel comes from three things:

1. A **cosine bell** falloff over ~3 character widths, so neighbours taper
   rather than snap.
2. `transform-origin: 50% 100%` — letters grow **up off the baseline**.
3. The row **spreads**: each glyph is pushed past the accumulated growth of
   everything before it, then the run is recentred by half the total, so
   magnifying near one end does not drag the name sideways.

Each character's box width is **frozen to its resting measure** after the
webfont loads, so changing `wght` inside a box never reflows the row. That
keeps the spread arithmetic exact and lets the whole thing run as transforms
in one `requestAnimationFrame` loop — reads batched ahead of writes, zero
React renders while the cursor moves.

### The portrait

`public/profile-cut.png` was cut from `Profile.jpeg` with
[rembg](https://github.com/danielgatis/rembg) using the `BiRefNet-portrait`
model, cropped to its alpha bounds and capped at 1900px. It is graded to
monochrome in CSS and carries a bottom mask so it dissolves into the page.

### Reduced motion

`prefers-reduced-motion` is honoured throughout: Lenis does not initialise,
every CSS animation is disabled, the preloader collapses to zero duration, the
magnifier stops tracking, and count-ups jump to their final value.

---

## Notes

- There is no `/resume` route. Drop a PDF in `public/` and add it to `SOCIALS`
  in `content.ts` to bring the link back.
- The hero photo and the cut-out are the only images; everything else is type,
  hairlines and CSS.
