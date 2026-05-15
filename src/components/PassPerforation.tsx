type Surface = "hero" | "card";
type Inset = "-mx-5" | "-mx-6";

type PassPerforationProps = {
  /**
   * Surface the perforation sits on. Drives the dashed-line colour:
   * - `"hero"` (default) — uses `--color-surface-hero-tile-border` to
   *   read against the dark teal hero pass body.
   * - `"card"` — uses `--color-border-soft` to read against a light
   *   `surface="sheet"` Card.
   */
  surface?: Surface;
  /**
   * How far the notches eat into the card edges. Match the parent
   * card's inner padding:
   * - `"-mx-6"` (default) — for `p-6` pass cards (Parking Reserved,
   *   My Flights main pass).
   * - `"-mx-5"` — for the tighter `p-5` pass cards (Flight Delay).
   */
  inset?: Inset;
  className?: string;
};

const dashedLineClass: Record<Surface, string> = {
  hero: "border-[var(--color-surface-hero-tile-border)]",
  card: "border-[var(--color-border-soft)]",
};

/**
 * Pass card perforation — two notches at the card edges with a
 * dashed line between them, mimicking a torn-ticket / boarding-pass
 * tear strip.
 *
 * - Always `aria-hidden` and `pointer-events-none`.
 * - The notch fill is `--color-bg` so the notches eat into the rounded
 *   card corners and reveal the page background.
 * - The parent must give this primitive a `relative` positioning
 *   context (the standard pass body inside a `<HeroSurface>` already
 *   has `relative`).
 *
 * Use **only** inside official pass-card / boarding-document
 * surfaces — Parking Reserved, My Flights, Flight Detail, Flight
 * Delay. Do not use as a general divider; the notches imply
 * "tear-off ticket".
 */
export function PassPerforation({
  surface = "hero",
  inset = "-mx-6",
  className = "",
}: PassPerforationProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative ${inset} flex items-center gap-1 ${className}`.trim()}
    >
      <span className="block h-6 w-3 rounded-r-[var(--radius-pill)] bg-[var(--color-bg)]" />
      <span
        className={`h-px flex-1 border-t border-dashed ${dashedLineClass[surface]}`}
      />
      <span className="block h-6 w-3 rounded-l-[var(--radius-pill)] bg-[var(--color-bg)]" />
    </div>
  );
}
