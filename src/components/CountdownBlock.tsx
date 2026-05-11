type Tone = "neutral" | "success" | "warning" | "danger" | "info";

type CountdownBlockProps = {
  value: React.ReactNode;
  label: string;
  tone?: Tone;
  className?: string;
};

const valueTone: Record<Tone, string> = {
  neutral: "text-[var(--color-text-primary)]",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-warning)]",
  danger: "text-[var(--color-danger)]",
  info: "text-[var(--color-info)]",
};

/**
 * Countdown / time-relative block — small uppercase label over a large
 * tabular value. The label-first ordering distinguishes a countdown
 * ("BOARDING IN / 42 min") from a static metric ("12 min / SECURITY WAIT")
 * which uses `<MetricBlock>` with value-first ordering.
 *
 * Use for: "Boarding in 42 min" (label "BOARDING IN" + value "42 min"),
 * "8 min walk" (label "WALK" + value "8 min"), "52 min buffer" (label
 * "BUFFER" + value "52 min"), "Time until departure" countdowns.
 *
 * Tone tints the value only. Use `warning` as the value approaches a
 * tight threshold (e.g. "BOARDING IN" / "5 min").
 */
export function CountdownBlock({
  value,
  label,
  tone = "neutral",
  className = "",
}: CountdownBlockProps) {
  return (
    <div className={`inline-flex flex-col gap-1 ${className}`.trim()}>
      <span className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
        {label}
      </span>
      <span className={`text-title tabular-nums ${valueTone[tone]}`}>
        {value}
      </span>
    </div>
  );
}
