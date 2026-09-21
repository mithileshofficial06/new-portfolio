"use client";

/**
 * Film grain over the entire document, not just the hero, so the lower
 * sections don't fall back to flat black. Sits above the content but below
 * the nav, and never takes a pointer event.
 */
export function GlobalTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-45 overflow-hidden"
    >
      <div
        className="animate-grain absolute -inset-1/2 opacity-[0.11] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
