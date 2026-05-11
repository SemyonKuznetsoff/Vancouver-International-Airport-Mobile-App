"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
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
 *
 * States:
 * - `checked` / unchecked — standard on/off.
 * - `disabled` — configured non-interactive. Native `disabled` + opacity-disabled.
 * - `busy` — transient async (e.g. waiting for OS permission). Keeps current
 *   `checked` value, blocks input, sets `aria-busy="true"`. Layout unchanged;
 *   the only visual cue is a subtle opacity dim + `cursor: wait` so the state
 *   reads in both motion and reduced-motion environments.
 */
export function Toggle({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
  busy = false,
  className = "",
}: ToggleProps) {
  const inactive = disabled || busy;
  const busyOnly = busy && !disabled;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      disabled={disabled}
      onClick={() => {
        if (inactive) return;
        onChange(!checked);
      }}
      className={`relative inline-flex h-[26px] w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 before:absolute before:inset-x-0 before:-top-[9px] before:-bottom-[9px] before:content-[''] ${
        checked
          ? "bg-[var(--color-action-primary)]"
          : "bg-[var(--color-track-off)]"
      } ${disabled ? "pointer-events-none opacity-[var(--opacity-disabled)]" : ""} ${busyOnly ? "pointer-events-none cursor-wait opacity-80" : ""} ${className}`.trim()}
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
