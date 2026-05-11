type Size = "display" | "title";

type HeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  className?: string;
};

const sizeClasses: Record<Size, string> = {
  display: "text-display",
  title: "text-title",
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
 */
export function Heading({
  children,
  as: Tag = "h1",
  size = "display",
  className = "",
}: HeadingProps) {
  return (
    <Tag
      className={`text-[var(--color-text-primary)] [&_em]:font-normal [&_em]:italic ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
