type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
};

/**
 * Calm content placeholder for async-loading regions. Renders a glass-tinted
 * block that pulses opacity 1 → 0.5 → 1 via Tailwind's `animate-pulse`.
 *
 * Reduced-motion: the global `prefers-reduced-motion: reduce` rule collapses
 * the animation to ~0ms, so the block renders as a static placeholder
 * instead of pulsing. Still visible, still announces "this region is busy"
 * via the parent's `aria-busy`.
 *
 * `aria-hidden` on each block — the parent region owns the announcement.
 */
export function Skeleton({
  width = "100%",
  height = "1rem",
  radius = "var(--radius-chip)",
  className = "",
}: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse bg-[var(--color-surface-card)] ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: typeof radius === "number" ? `${radius}px` : radius,
      }}
    />
  );
}
