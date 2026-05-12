type Tone = "neutral" | "success" | "warning" | "danger" | "info";
type Align = "left" | "center" | "right";

type MetricBlockProps = {
  value: React.ReactNode;
  label: string;
  helper?: string;
  tone?: Tone;
  align?: Align;
  /**
   * Hide the rendered label. Use when the surrounding context already
   * carries the label (e.g. the Live At YVR strip on Home renders the
   * label inline with an icon row above the value). The `label` prop is
   * still required and is set as `aria-label` on the wrapper.
   */
  hideLabel?: boolean;
  className?: string;
};

const valueTone: Record<Tone, string> = {
  neutral: "text-[var(--color-text-primary)]",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-warning)]",
  danger: "text-[var(--color-danger)]",
  info: "text-[var(--color-info)]",
};

const alignClasses: Record<Align, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

/**
 * Single-metric block — large value over a small uppercase label, with
 * an optional helper line beneath. Numeric output uses `tabular-nums`
 * so adjacent metrics align on the digit grid.
 *
 * Use for: security wait, walking time, parking availability, distance
 * to gate. Pair multiple blocks in a row with consistent `align` for a
 * clean metric strip.
 *
 * Tone tints the value only — label and helper stay neutral. Reserve
 * non-neutral tones for live data signals.
 *
 * `hideLabel` collapses the rendered label when the surrounding row
 * already carries it. The accessible name moves to the wrapper.
 */
export function MetricBlock({
  value,
  label,
  helper,
  tone = "neutral",
  align = "left",
  hideLabel = false,
  className = "",
}: MetricBlockProps) {
  return (
    <div
      aria-label={hideLabel ? label : undefined}
      className={`inline-flex flex-col gap-1 ${alignClasses[align]} ${className}`.trim()}
    >
      <span className={`text-title tabular-nums ${valueTone[tone]}`}>
        {value}
      </span>
      {hideLabel ? null : (
        <span className="text-micro uppercase text-[var(--color-text-secondary)]">
          {label}
        </span>
      )}
      {helper ? (
        <span className="text-label text-[var(--color-text-muted)]">
          {helper}
        </span>
      ) : null}
    </div>
  );
}
