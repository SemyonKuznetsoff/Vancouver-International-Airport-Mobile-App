type Size = "default" | "compact";

type GateDisplayProps = {
  gate: string;
  terminal?: string;
  helper?: string;
  /**
   * Visual size variant.
   *
   * - `default` (boarding strip, hero trip card, boarding-pass detail) —
   *   eyebrow + value + optional support line, label-first stack.
   * - `compact` (meta rows inside small list cards, e.g. saved-journey
   *   card) — single inline line: `Gate <terminal · gate · helper>` at
   *   `text-label` weight. Use when vertical space is at a premium and
   *   the gate is one fact among others in the row.
   */
  size?: Size;
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
 *
 * Compact (`size="compact"`) collapses the same data onto a single inline
 * line: `Gate Intl · — · Domestic`. Use inside compact list-row meta
 * lines where the default's three-line stack would overwhelm the row.
 * The terminal/gate/helper join uses ` · ` per content-guide.md §6.
 */
export function GateDisplay({
  gate,
  terminal,
  helper,
  size = "default",
  className = "",
}: GateDisplayProps) {
  if (size === "compact") {
    const parts = [terminal, gate, helper].filter(Boolean);
    return (
      <span
        className={`inline-flex items-center text-label tabular-nums text-[var(--color-text-secondary)] ${className}`.trim()}
      >
        Gate {parts.join(" · ")}
      </span>
    );
  }

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
