type EyebrowProps = {
  children: React.ReactNode;
  tone?: "primary" | "secondary";
  className?: string;
};

/**
 * Small uppercase label that sits above a Heading or in a screen step row.
 *
 * Size, line-height, and tracking come from the `--text-eyebrow` role token
 * in globals.css.
 */
export function Eyebrow({
  children,
  tone = "primary",
  className = "",
}: EyebrowProps) {
  const color =
    tone === "primary"
      ? "text-[var(--color-text-primary)]"
      : "text-[var(--color-text-secondary)]";

  return (
    <p
      className={`text-eyebrow uppercase ${color} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
