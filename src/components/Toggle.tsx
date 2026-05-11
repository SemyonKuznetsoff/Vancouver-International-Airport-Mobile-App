"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
};

/**
 * Accessible on/off switch. Renders a real <button> with switch semantics
 * so the global focus ring lights it up and screen readers announce the
 * checked state.
 *
 * The visible track is 44×26 to match the documented switch chrome. A
 * transparent `::before` pseudo extends the click/tap area to 44×44 — the
 * required minimum — without changing layout or visuals.
 *
 * Use this for any on/off setting: permissions, notification preferences,
 * accessibility settings. Never roll a bespoke switch.
 */
export function Toggle({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 before:absolute before:inset-x-0 before:-top-[9px] before:-bottom-[9px] before:content-[''] ${
        checked
          ? "bg-[var(--color-action-primary)]"
          : "bg-[var(--color-text-secondary)]/40"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`.trim()}
    >
      <span
        aria-hidden
        className={`block h-5 w-5 rounded-full bg-white shadow-[var(--shadow-toggle)] transition-transform duration-150 ${
          checked ? "translate-x-[21px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
