import Link from "next/link";
import type { Route } from "next";
import { ArrowLeftIcon } from "./icons";

type ScreenHeaderProps = {
  backHref?: Route | URL;
  backLabel?: string;
  step?: string;
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * Top row for any non-root screen.
 *
 * - Left: optional circular back button (44×44 tap target).
 * - Right: optional step label (e.g. "Step 2 of 3") or arbitrary `trailing`
 *   content.
 *
 * The header sits inside the page's `px-6` gutter and `pt-2` from `AppShell`.
 */
export function ScreenHeader({
  backHref,
  backLabel = "Go back",
  step,
  trailing,
  className = "",
}: ScreenHeaderProps) {
  return (
    <header className={`flex items-center justify-between pt-2 ${className}`.trim()}>
      {backHref ? (
        <Link
          href={backHref as Route}
          aria-label={backLabel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated-hover)]"
        >
          <ArrowLeftIcon size={16} />
        </Link>
      ) : (
        <span aria-hidden className="h-11 w-11" />
      )}

      {trailing ?? (
        step ? (
          <span className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
            {step}
          </span>
        ) : null
      )}
    </header>
  );
}
