type Size = "display" | "title";

type HeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  className?: string;
};

const sizeClasses: Record<Size, string> = {
  display: "text-[34px] leading-[1.05]",
  title: "text-[30px] leading-[1.1]",
};

/**
 * Display heading.
 *
 * - `display` (default, 34px) — hero screens like the welcome page.
 * - `title` (30px) — step screens like sign-in, permissions, settings.
 *
 * Italic accent: wrap the accent phrase in `<em>`. The component styles
 * em as normal-weight italic.
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
      className={`font-semibold text-[var(--color-text-primary)] tracking-[-0.025em] [&_em]:font-normal [&_em]:italic ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
