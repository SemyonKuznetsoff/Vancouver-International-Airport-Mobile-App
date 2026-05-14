type Padding = "none" | "compact" | "default" | "lg";
type Surface = "card" | "sheet";

type CardProps = {
  children: React.ReactNode;
  padding?: Padding;
  /**
   * Surface fill. `card` (default) is the airy translucent glass over
   * the aurora — the canonical informational card. `sheet` swaps in
   * `--color-surface-sheet` (near-opaque white) for surfaces that must
   * read as solid above scrolling content (e.g. the Reserve Parking
   * details card sitting under a sticky bottom summary). Border, radius,
   * and shadow stay unchanged so chrome remains a single recognisable
   * shape across both surfaces.
   */
  surface?: Surface;
  as?: "div" | "article" | "section";
  className?: string;
};

const paddingClasses: Record<Padding, string> = {
  none: "",
  compact: "p-4",
  default: "p-5",
  lg: "p-6",
};

const surfaceClasses: Record<Surface, string> = {
  card: "bg-[var(--color-surface-card)]",
  sheet: "bg-[var(--color-surface-sheet)]",
};

/**
 * Glass card primitive — the **single source** of the standard elevated
 * glass surface (fill, border, radius, shadow). Compose content inside.
 *
 * - Do not re-author `bg-[var(--color-surface-card)] + border + shadow +
 *   rounded-[var(--radius-panel)]` combinations in page files or other
 *   primitives. If you need card chrome, use Card.
 * - Use `padding="none"` when the children own their own padding
 *   (e.g. a list of rows, an `AuthOptionGroup`).
 * - Use `padding="compact"` (16px) inside dense lists.
 * - Use `padding="default"` (20px) for most informational cards.
 * - Use `padding="lg"` (24px) for hero cards.
 *
 * Extra layout concerns (e.g. `overflow-hidden`, divider selectors) come in
 * via `className`.
 */
export function Card({
  children,
  padding = "default",
  surface = "card",
  as: Tag = "div",
  className = "",
}: CardProps) {
  return (
    <Tag
      className={`rounded-[var(--radius-panel)] border border-[var(--color-border)] ${surfaceClasses[surface]} shadow-[var(--shadow-card)] ${paddingClasses[padding]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
