type HeroSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  /**
   * Semantic element. Defaults to `"section"` since hero surfaces are
   * typically content regions; use `"div"` when wrapping inside an
   * interactive `<Link>` so the section landmark sits on the link instead.
   */
  as?: "section" | "div" | "article";
  /**
   * Gradient angle override. Defaults to `135deg` (used by the Home
   * screen). Profile main (`167deg`) and Saved Trips (`180deg`) can pass
   * their own angle when migrated onto this primitive.
   */
  angle?: string;
  className?: string;
};

/**
 * Hero surface — the dark teal gradient panel used for the Profile
 * identity card, Saved Trips header, Home hero ("Where to, today?"),
 * and the Departing CTA card on Home.
 *
 * The surface bakes in the canonical chrome:
 * - `rounded-[var(--radius-card)]` (24px) corner radius
 * - `overflow-hidden` so child gradients / patterns don't leak
 * - `relative` positioning context for absolutely positioned glyphs
 * - `text-[var(--color-surface-hero-fg)]` foreground so `text-*`
 *   utilities resolve to the hero foreground colour
 * - `linear-gradient(<angle>, --color-surface-hero-start 0%,
 *   --color-surface-hero-end 100%)` background image
 *
 * Consumers own padding and layout via `className` — there is no
 * `padding` prop because hero surfaces vary widely in inner spacing
 * (Profile identity card uses `p-5`, Home hero uses `p-6`, Departing
 * CTA uses `p-5` with `flex h-full min-h-[196px] flex-col`).
 *
 * **Use only on a hero context.** Pair with `<Heading tone="hero">` and
 * `<Eyebrow tone="hero">` for typography on the surface; do not nest
 * `<Card>` (glass chrome) inside a HeroSurface.
 */
export function HeroSurface({
  children,
  as: Tag = "section",
  angle = "135deg",
  className = "",
  style,
  ...rest
}: HeroSurfaceProps) {
  return (
    <Tag
      {...rest}
      className={`relative overflow-hidden rounded-[var(--radius-card)] text-[var(--color-surface-hero-fg)] ${className}`.trim()}
      style={{
        backgroundImage: `linear-gradient(${angle}, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
