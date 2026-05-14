"use client";

type Tone = "primary" | "teal";

type ChipFilterProps = {
  selected: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  /**
   * Tone of the selected fill. `primary` (default) renders the canonical
   * navy fill matched to `--color-action-primary`. `teal` swaps in
   * `--color-action-teal` for chip rows inside teal-themed flows
   * (Ground Transport transport filter). Unselected chrome is identical
   * across tones — only the selected pill changes colour.
   */
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
};

const selectedToneClasses: Record<Tone, string> = {
  primary:
    "border-[var(--color-action-primary)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]",
  teal:
    "border-[var(--color-action-teal)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]",
};

/**
 * Toggleable filter chip — a pill that flips between selected (navy fill,
 * inverse text) and unselected (elevated surface, primary text with a
 * hairline border).
 *
 * Use for: filter rows above search results, segmented filter strips
 * ("Departures / Arrivals", "Food / Shops / Services", "Standard /
 * Accessible / Family"). Multi-select is the default expectation; the
 * caller manages state per chip.
 *
 * Accessibility: rendered as a real `<button>` with `aria-pressed` so
 * screen readers announce on/off state. Disabled chips are not focusable.
 *
 * Tap target: the visible chip is 44px tall to meet the documented
 * minimum (CLAUDE.md §12). Adjacent chips should sit on a row with
 * `gap-2` (8px) at minimum to prevent accidental adjacent-chip taps.
 */
export function ChipFilter({
  selected,
  onToggle,
  disabled = false,
  tone = "primary",
  children,
  className = "",
}: ChipFilterProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onToggle(!selected)}
      className={`inline-flex h-11 shrink-0 items-center rounded-[var(--radius-pill)] border px-4 text-body-sm font-medium transition-colors duration-150 ${
        selected
          ? selectedToneClasses[tone]
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated-hover)]"
      } ${disabled ? "opacity-[var(--opacity-disabled)] pointer-events-none" : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
