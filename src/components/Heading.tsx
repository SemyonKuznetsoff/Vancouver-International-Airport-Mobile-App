type Size = "display" | "title";
type Tone = "primary" | "hero";

type HeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  /**
   * Surface tone. `primary` (default) renders navy on the aurora background.
   * `hero` renders the inverse foreground for use on the dark teal hero
   * surface (Profile identity card, Saved Trips hero band) — consume the
   * `--color-surface-hero-fg` token. Picks the tone via prop so component
   * authors don't have to force-override the primary colour with an inline
   * className.
   */
  tone?: Tone;
  className?: string;
};

const sizeClasses: Record<Size, string> = {
  display: "text-display",
  title: "text-title",
};

const toneClasses: Record<Tone, string> = {
  primary: "text-[var(--color-text-primary)]",
  hero: "text-[var(--color-surface-hero-fg)]",
};

/**
 * Display heading.
 *
 * - `display` (default, 34px) — hero screens like the welcome page.
 * - `title` (30px) — step screens like sign-in, permissions, settings.
 *
 * Size, line-height, weight, and tracking come from the `--text-display` /
 * `--text-title` role tokens in globals.css. Update those tokens to retune
 * the scale — do not override sizes inline on this component.
 *
 * Italic accent: wrap the accent phrase in `<em>`. The component styles
 * em as normal-weight italic so the role token's 600 weight is reset.
 *
 *   <Heading size="title">
 *     Continue your
 *     <br />
 *     <em>journey.</em>
 *   </Heading>
 *
 * Tone: pass `tone="hero"` when the heading sits on the dark teal hero
 * surface. The `--color-surface-hero-fg` token paints the foreground —
 * do not inline a colour override.
 */
export function Heading({
  children,
  as: Tag = "h1",
  size = "display",
  tone = "primary",
  className = "",
}: HeadingProps) {
  return (
    <Tag
      className={`[&_em]:font-normal [&_em]:italic ${toneClasses[tone]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
