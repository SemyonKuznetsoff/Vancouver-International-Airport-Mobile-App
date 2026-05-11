type GateDisplayProps = {
  gate: string;
  terminal?: string;
  helper?: string;
  className?: string;
};

/**
 * Gate display — "GATE / D73" rendering with an optional terminal + helper
 * support line. Eyebrow label sits above the value so the user's eye lands
 * on the gate identifier first while still scanning the column for "is
 * this a gate?".
 *
 * Use for: flight cards, boarding pass detail, journey timeline steps.
 * Pass the bare identifier (`"D73"`, `"A1"`) without the word "Gate" —
 * the component renders the "GATE" eyebrow itself.
 *
 * Terminal is rendered as "Terminal M" when provided; helper appends after
 * a middle-dot separator ("Terminal M · Domestic") per content-guide.md §6.
 */
export function GateDisplay({
  gate,
  terminal,
  helper,
  className = "",
}: GateDisplayProps) {
  const support = [
    terminal ? `Terminal ${terminal}` : null,
    helper,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`.trim()}>
      <span className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
        Gate
      </span>
      <span className="text-title tabular-nums uppercase text-[var(--color-text-primary)]">
        {gate}
      </span>
      {support ? (
        <span className="text-label text-[var(--color-text-secondary)]">
          {support}
        </span>
      ) : null}
    </div>
  );
}
