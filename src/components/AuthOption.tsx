"use client";

import { ChevronRightIcon } from "./icons";

type AuthOptionProps = {
  leading: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

/**
 * A single row inside the stacked sign-in options card. Renders a real
 * <button> so it's keyboard-focusable and exposes the global focus ring.
 * Used inside <AuthOptionGroup> which paints the card chrome + dividers.
 */
export function AuthOption({
  leading,
  label,
  badge,
  onClick,
  ariaLabel,
}: AuthOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className="flex h-[58px] w-full items-center justify-between gap-3 px-5 text-left transition-colors duration-150 hover:bg-white/30 active:bg-white/40"
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex w-[22px] shrink-0 items-center justify-center text-[var(--color-text-primary)]">
          {leading}
        </span>
        <span className="text-[14px] font-medium leading-[1.5] text-[var(--color-text-primary)]">
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
 * Glassy card that groups AuthOption rows with hairline dividers between them.
 */
export function AuthOptionGroup({ children }: AuthOptionGroupProps) {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-white/40 shadow-[var(--shadow-card)] [&>*+*]:border-t [&>*+*]:border-[var(--color-border)]"
    >
      {children}
    </div>
  );
}
