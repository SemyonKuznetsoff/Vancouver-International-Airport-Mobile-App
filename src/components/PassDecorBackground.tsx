type Variant = "calm" | "tall" | "delay";

type PassDecorBackgroundProps = {
  /**
   * Pre-defined curve / dot envelope. Each variant matches the
   * approximate height of one existing pass card so the decoration
   * doesn't clip or float:
   * - `"calm"` (default) — short pass card (Parking Reserved, Flight
   *   Detail). viewBox 350×360, two curves, no dots.
   * - `"tall"` — taller pass card (My Flights main pass). viewBox
   *   350×480, two curves + two dots.
   * - `"delay"` — tallest pass card (Flight Delay rework). viewBox
   *   350×720, two curves + three dots positioned for the document
   *   metadata + gate-change + footer zones.
   *
   * Variants are visually similar, never identical — each pass card
   * gets a slight individual feel without forking the primitive.
   */
  variant?: Variant;
  className?: string;
};

/**
 * Pass card decorative background — faint curved lines + dots that
 * give the pass body a paper-document texture. Renders inside a
 * `<HeroSurface>` (or other `relative overflow-hidden` dark surface)
 * and uses `--color-surface-hero-fg` at `opacity-[0.05]` so it never
 * competes with the foreground content.
 *
 * - Always `aria-hidden` and `pointer-events-none`.
 * - Uses `currentColor` — the parent surface sets the foreground
 *   token, and `<HeroSurface>` already does this.
 *
 * Use **only** inside official pass-card surfaces. Do not use as a
 * general background for content cards.
 */
export function PassDecorBackground({
  variant = "calm",
  className = "",
}: PassDecorBackgroundProps) {
  const config = VARIANTS[variant];
  return (
    <svg
      aria-hidden
      viewBox={config.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full text-[var(--color-surface-hero-fg)] opacity-[0.05] ${className}`.trim()}
    >
      {config.curves.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === 0 ? 1.25 : 1}
          strokeDasharray={i === 0 ? undefined : "3 5"}
        />
      ))}
      {config.dots.map(([cx, cy, r], i) => (
        <circle key={`${cx}-${cy}-${i}`} cx={cx} cy={cy} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}

const VARIANTS: Record<
  Variant,
  {
    viewBox: string;
    curves: ReadonlyArray<string>;
    dots: ReadonlyArray<readonly [number, number, number]>;
  }
> = {
  calm: {
    viewBox: "0 0 350 360",
    curves: [
      "M -10 280 C 80 240 180 270 360 220",
      "M -10 320 C 100 280 220 310 360 260",
    ],
    dots: [],
  },
  tall: {
    viewBox: "0 0 350 480",
    curves: [
      "M -20 100 C 90 60 220 130 380 80",
      "M -20 360 C 100 320 240 380 380 320",
    ],
    dots: [
      [320, 60, 2],
      [60, 380, 2],
    ],
  },
  delay: {
    viewBox: "0 0 350 720",
    curves: [
      "M -10 120 C 80 80 200 150 360 100",
      "M -10 540 C 100 500 230 570 360 520",
    ],
    dots: [
      [310, 60, 2],
      [40, 600, 2],
      [290, 650, 1.5],
    ],
  },
};
