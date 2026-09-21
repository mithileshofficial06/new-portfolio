"use client";

/**
 * Everything behind the content: hairline grid, a slow drifting light and a
 * vignette (the film grain is applied globally, one layer up). Pure CSS so it costs nothing on the main thread.
 */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Hairline grid, faded out toward the edges. */}
      <div
        className="grid-veil absolute inset-0 opacity-70"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 50% 40%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 40%, #000 20%, transparent 78%)",
        }}
      />

      {/* A single cold light source, drifting. */}
      <div className="animate-drift absolute -top-1/3 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.09),transparent_62%)] blur-3xl" />


      {/* Vignette — pulls focus to the center, hides the seams. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_35%,#050505_100%)]" />
    </div>
  );
}
