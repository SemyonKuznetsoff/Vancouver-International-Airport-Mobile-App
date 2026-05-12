<<<<<<< HEAD
type Radius = "card" | "hero" | "panel" | "none";

type HeroSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  /**
   * Semantic element. Defaults to `"section"`; use `"div"` when wrapping
   * inside an interactive `<Link>` so the link owns the landmark.
   */
  as?: "section" | "div" | "article";
  /**
   * Gradient angle override. Defaults to `135deg` (Home hero + Departing
   * CTA). Profile main (`167deg`) and Saved Trips header (`180deg`) can
   * pass their own angle when migrated.
   */
  angle?: string;
  /**
   * Border-radius token. `hero` (36px) reads premium and is the Figma
   * default for the Home hero. `card` (24px) reads tighter and suits
   * nested hero cards (the Departing CTA). `none` for full-bleed bands.
   * Defaults to `hero`.
   */
  radius?: Radius;
  className?: string;
};

const radiusClasses: Record<Radius, string> = {
  card: "rounded-[var(--radius-card)]",
  hero: "rounded-[var(--radius-hero)]",
  panel: "rounded-[var(--radius-panel)]",
  none: "",
};

/**
 * Hero surface — dark teal gradient panel used for the Profile identity
 * card, Saved Trips header, Home hero ("Where to, today?"), and the
 * Departing CTA card on Home.
 *
 * Bakes the canonical chrome:
 * - Configurable radius (`hero` / `card` / `panel` / `none`).
 * - `overflow-hidden` so child decorations don't leak.
 * - `relative` positioning context.
 * - `text-[var(--color-surface-hero-fg)]` foreground.
 * - Linear-gradient background from `--color-surface-hero-start` to
 *   `--color-surface-hero-end` at the configured angle.
 *
 * Consumer owns padding and layout via `className`. Pair with
 * `<Heading tone="hero">` and `<Eyebrow tone="hero">`. Do not nest a
 * `<Card>` (any tone) inside a HeroSurface.
=======
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
>>>>>>> origin/main
 */
export function HeroSurface({
  children,
  as: Tag = "section",
  angle = "135deg",
<<<<<<< HEAD
  radius = "hero",
=======
>>>>>>> origin/main
  className = "",
  style,
  ...rest
}: HeroSurfaceProps) {
<<<<<<< HEAD
  // Multi-stop gradient ramp tuned to the No-Trip Home Figma — a soft
  // brighter teal at the top-left, a held mid-stop near the centre, and
  // a deeper teal at the bottom-right. The three semantic stops keep
  // the surface atmospheric without baking raw hex into components.
  const heroGradient = `linear-gradient(${angle}, var(--color-surface-hero-start) 0%, var(--color-surface-hero-mid) 55%, var(--color-surface-hero-end) 100%)`;
  return (
    <Tag
      {...rest}
      className={`relative overflow-hidden text-[var(--color-surface-hero-fg)] ${radiusClasses[radius]} ${className}`.trim()}
      style={{
        backgroundImage: heroGradient,
=======
  return (
    <Tag
      {...rest}
      className={`relative overflow-hidden rounded-[var(--radius-card)] text-[var(--color-surface-hero-fg)] ${className}`.trim()}
      style={{
        backgroundImage: `linear-gradient(${angle}, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)`,
>>>>>>> origin/main
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
