type Tone = "primary" | "secondary" | "hero";

type EyebrowProps = {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  primary: "text-[var(--color-text-primary)]",
  secondary: "text-[var(--color-text-secondary)]",
  hero: "text-[var(--color-surface-hero-fg-muted)]",
};

/**
 * Small uppercase label that sits above a Heading or in a screen step row.
 *
 * Size, line-height, and tracking come from the `--text-eyebrow` role token
 * in globals.css.
 *
 * Tone: pass `tone="hero"` when the eyebrow sits on the dark teal hero
 * surface (e.g. Saved Trips hero band) — uses
 * `--color-surface-hero-fg-muted` for legible-but-quiet on-dark contrast.
 */
export function Eyebrow({
  children,
  tone = "primary",
  className = "",
}: EyebrowProps) {
  return (
    <p
      className={`text-eyebrow uppercase ${toneClasses[tone]} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
