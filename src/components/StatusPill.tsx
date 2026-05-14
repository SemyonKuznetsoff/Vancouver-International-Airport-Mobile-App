type Tone = "success" | "warning" | "danger" | "info" | "neutral";
type Size = "sm" | "md";
type Surface = "light" | "hero";

type StatusPillProps = {
  tone?: Tone;
  size?: Size;
  /**
   * Surface context. `light` (default) uses the standard status trios
   * (pale fill + dark fg) tuned for the aurora background. `hero` swaps
   * in dark-surface trios so the pill stays legible on a teal hero
   * panel. Currently `success` is the only tone with a hero variant —
   * unsupported (tone, hero) combinations fall back silently to the
   * light trio. Add a hero entry to `toneHeroClasses` when extending.
   */
  surface?: Surface;
  leadingDot?: boolean;
  children: React.ReactNode;
  className?: string;
};

const toneLightClasses: Record<Tone, string> = {
  success:
    "bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-fg)]",
  warning:
    "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning-fg)]",
  danger:
    "bg-[var(--color-danger-bg)] border-[var(--color-danger-border)] text-[var(--color-danger-fg)]",
  info: "bg-[var(--color-info-bg)] border-[var(--color-info-border)] text-[var(--color-info-fg)]",
  neutral:
    "bg-[var(--color-neutral-bg)] border-[var(--color-neutral-border)] text-[var(--color-neutral-fg)]",
};

/**
 * Hero-surface trios. Reuses the parking-flow mint tokens
 * (`--color-map-mint*`) which are already the canonical mint accent on
 * dark teal surfaces. Only `success` is wired today; add other tones
 * here when a use case appears.
 */
const toneHeroClasses: Partial<Record<Tone, string>> = {
  success:
    "bg-[var(--color-map-mint-bg)] border-[var(--color-map-mint-soft)] text-[var(--color-map-mint)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-5 px-2",
  md: "h-7 px-3",
};

/**
 * Status pill — compact pill chrome for live flight / parking / security
 * state. Tone maps to the status surface trio in `globals.css` (bg + border
 * + fg). Text renders via `text-micro` (10px / weight 600 / uppercase /
 * tracking 0.16em) so labels read at a glance even at sm size.
 *
 * Use for: "On time", "Boarding", "Delayed", "Gate changed", "Cancelled",
 * "Open", "Closed". The label content carries the meaning — colour alone
 * is not relied on for accessibility.
 *
 * The pill is **not a live region**. When the underlying status changes,
 * the parent surface (e.g. flight card) owns the `aria-live` announcement.
 */
export function StatusPill({
  tone = "neutral",
  size = "md",
  surface = "light",
  leadingDot = false,
  children,
  className = "",
}: StatusPillProps) {
  const chrome =
    surface === "hero"
      ? toneHeroClasses[tone] ?? toneLightClasses[tone]
      : toneLightClasses[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border text-micro uppercase ${chrome} ${sizeClasses[size]} ${className}`.trim()}
    >
      {leadingDot ? (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}
