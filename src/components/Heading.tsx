type HeadingProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Display heading. Supports a serif-italic accent via <em> children:
 *   <Heading>Your journey,<br /><em>effortlessly guided.</em></Heading>
 */
export function Heading({
  children,
  as: Tag = "h1",
  className = "",
}: HeadingProps) {
  return (
    <Tag
      className={`font-semibold text-[var(--color-text-primary)] text-[34px] leading-[1.05] tracking-[-0.025em] [&_em]:font-normal [&_em]:italic ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
