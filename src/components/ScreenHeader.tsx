import Link from "next/link";
import type { Route } from "next";
import { ArrowLeftIcon } from "./icons";

type ScreenHeaderProps = {
  backHref?: Route | URL;
  backLabel?: string;
  step?: string;
  right?: React.ReactNode;
};

/**
 * Top row for any non-root screen.
 *
 * - Left: optional circular back button (44×44 tap target).
 * - Right: optional step label (e.g. "Step 2 of 3") or arbitrary content.
 *
 * The header sits inside the page's `px-6` gutter and `pt-2` from `AppShell`.
 */
export function ScreenHeader({
  backHref,
  backLabel = "Go back",
  step,
  right,
}: ScreenHeaderProps) {
  return (
    <header className="flex items-center justify-between pt-2">
      {backHref ? (
        <Link
          href={backHref as Route}
          aria-label={backLabel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-white/70"
        >
          <ArrowLeftIcon size={16} />
        </Link>
      ) : (
        <span aria-hidden className="h-11 w-11" />
      )}

      {right ?? (
        step ? (
          <span className="text-[11px] uppercase leading-[1.5] tracking-[0.22em] text-[var(--color-text-secondary)]">
            {step}
          </span>
        ) : null
      )}
    </header>
  );
}
