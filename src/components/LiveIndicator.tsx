type LiveStatus = "live" | "synced" | "stale";

type LiveIndicatorProps = {
  status?: LiveStatus;
  label: string;
  pulse?: boolean;
  className?: string;
};

const dotClasses: Record<LiveStatus, string> = {
  live: "bg-[var(--color-success)]",
  synced: "bg-[var(--color-text-muted)]",
  stale: "bg-[var(--color-warning)]",
};

/**
 * Live data indicator — a small dot + uppercase label that signals the
 * freshness of the surrounding content. Dot colour maps to status; label
 * carries the meaning so screen readers don't need to interpret colour.
 *
 * `pulse` enables a soft expanding-ring animation on the dot via Tailwind's
 * `animate-ping`. The global `prefers-reduced-motion: reduce` rule
 * collapses the animation duration so the dot stays static in reduced-
 * motion mode — still visible, just not animated.
 *
 * Use for: "LIVE" on a flight status card, "SYNCED" on the home dashboard,
 * "STALE" when an API hasn't refreshed.
 */
export function LiveIndicator({
  status = "live",
  label,
  pulse = false,
  className = "",
}: LiveIndicatorProps) {
  return (
    <span
      aria-label={label}
      className={`inline-flex items-center gap-2 text-micro uppercase text-[var(--color-text-secondary)] ${className}`.trim()}
    >
      <span aria-hidden className="relative inline-flex h-2 w-2 shrink-0">
        {pulse && status === "live" ? (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotClasses[status]}`}
          />
        ) : null}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${dotClasses[status]}`}
        />
      </span>
      <span aria-hidden>{label}</span>
    </span>
  );
}
