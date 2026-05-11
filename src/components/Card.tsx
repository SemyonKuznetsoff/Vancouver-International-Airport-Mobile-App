type Padding = "default" | "compact" | "lg";

type CardProps = {
  children: React.ReactNode;
  padding?: Padding;
  as?: "div" | "article" | "section";
  className?: string;
};

const paddingClasses: Record<Padding, string> = {
  default: "p-5",
  compact: "p-4",
  lg: "p-6",
};

/**
 * Glass card primitive. Standard chrome for any panel-style card across the
 * app. Compose content inside; do not reauthor `bg-white/40 + border + shadow`
 * combinations in page files.
 */
export function Card({
  children,
  padding = "default",
  as: Tag = "div",
  className = "",
}: CardProps) {
  return (
    <Tag
      className={`rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-card)] ${paddingClasses[padding]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
