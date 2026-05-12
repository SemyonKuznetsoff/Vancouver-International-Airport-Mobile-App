type Size = "display" | "title";
type Tone = "primary" | "hero";
type Weight = "default" | "light";

type HeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  /**
   * Surface tone. `primary` (default) renders navy on the aurora
   * background. `hero` renders the inverse foreground for use on the
   * dark teal hero surface — consumes `--color-surface-hero-fg`.
   */
  tone?: Tone;
  /**
   * Weight variant. `default` (semibold, role default) is the standard
   * heading rendering. `light` (300) is the elegant lightweight
   * rendering used on the Home hero ("Where to, today?") per the
   * Figma direction. Reserve `light` for hero contexts.
   */
  weight?: Weight;
  className?: string;
};

const sizeClasses: Record<Size, string> = {
  display: "text-display",
  title: "text-title",
};

const toneClasses: Record<Tone, string> = {
  primary: "text-[var(--color-text-primary)]",
  // Hero tone also tints any inner italic-accent `<em>` with the
  // hero-accent foreground (cyan-teal), so the Figma's "today?" italic
  // phrase renders in the correct accent colour without page-level
  // overrides.
  hero: "text-[var(--color-surface-hero-fg)] [&_em]:text-[var(--color-surface-hero-fg-accent)]",
};

const weightClasses: Record<Weight, string> = {
  default: "",
  light: "font-light",
};

/**
 * Display heading.
 *
 * - `display` (default, 34px) — hero screens like the welcome page.
 * - `title` (30px) — step screens like sign-in, permissions, settings.
 *
 * Italic accent: wrap the accent phrase in `<em>`. The component
 * styles em as normal-weight italic.
 *
 *   <Heading size="display" tone="hero" weight="light">
 *     Where to,
 *     <br />
 *     <em>today?</em>
 *   </Heading>
 *
 * `tone="hero"` on the dark teal surface, `weight="light"` for the
 * elegant hero rendering. Default behaviour is unchanged.
 */
export function Heading({
  children,
  as: Tag = "h1",
  size = "display",
  tone = "primary",
  weight = "default",
  className = "",
}: HeadingProps) {
  return (
    <Tag
      className={`[&_em]:font-normal [&_em]:italic ${toneClasses[tone]} ${sizeClasses[size]} ${weightClasses[weight]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
