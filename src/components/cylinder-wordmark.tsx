/**
 * The wordmark rides a row of drums. Each letter is a four-faced cylinder
 * carrying the same glyph on every face, so a quarter turn lands on an
 * identical letter and the roll can run forever without a seam. The turns
 * are staggered, so the motion travels across the name as a wave.
 */
export function CylinderWordmark({
  text,
  /** Characters past this index fold away on narrow screens. */
  collapseAfter,
  className = "",
}: {
  text: string;
  collapseAfter?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex ${className}`}>
      <span className="sr-only">{text}</span>

      {text.split("").map((char, index) => {
        const folds = collapseAfter !== undefined && index > collapseAfter;

        if (char === " ") {
          return (
            <span
              key={index}
              aria-hidden
              className={`w-[0.26em] ${folds ? "hidden sm:inline-block" : "inline-block"}`}
            />
          );
        }

        return (
          <span
            key={index}
            aria-hidden
            className={`drum ${folds ? "hidden sm:inline-block" : ""}`}
            style={{ "--drum-index": index } as React.CSSProperties}
          >
            {/* An invisible copy holds the glyph's own width open — the
                turning faces are lifted out of flow. */}
            <span className="drum-ghost">{char}</span>
            <span className="drum-core">
              {[0, 1, 2, 3].map((face) => (
                <span
                  key={face}
                  className="drum-face"
                  style={{ "--drum-face": face } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
