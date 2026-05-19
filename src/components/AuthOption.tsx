"use client";

import { Card } from "./Card";
import { ChevronRightIcon } from "./icons";

type AuthOptionProps = {
  leading: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
};

/**
 * A single row inside the stacked sign-in options card. Renders a real
 * <button> so it's keyboard-focusable and exposes the global focus ring.
 * Used inside <AuthOptionGroup> which paints the card chrome + dividers.
 *
 * Pass `disabled` for a preview/unavailable provider — the row stays in
 * the layout (so the design intent is communicated) but stops behaving
 * like a CTA. Pair with `badge="Soon"` to label *why*.
 */
export function AuthOption({
  leading,
  label,
  badge,
  onClick,
  ariaLabel,
  disabled = false,
}: AuthOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className="flex h-[58px] w-full items-center justify-between gap-3 px-5 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-pressed)] disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed disabled:pointer-events-none"
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex w-[22px] shrink-0 items-center justify-center text-[var(--color-text-primary)]">
          {leading}
        </span>
        <span className="text-body font-medium text-[var(--color-text-primary)]">
          {label}
        </span>
      </span>
      <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        {badge ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
            {badge}
          </span>
        ) : null}
        <ChevronRightIcon size={16} />
      </span>
    </button>
  );
}

type AuthOptionGroupProps = {
  children: React.ReactNode;
};

/**
 * Glassy card that groups AuthOption rows with hairline dividers between
 * them. Composes `<Card padding="none">` for the standard card chrome
 * (fill, border, radius, shadow) and layers on `overflow-hidden` (so
 * hover backgrounds stay inside the rounded edge) plus a sibling-divider
 * selector.
 */
export function AuthOptionGroup({ children }: AuthOptionGroupProps) {
  return (
    <Card
      padding="none"
      className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border)]"
    >
      {children}
    </Card>
  );
}
