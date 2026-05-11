import Link from "next/link";
import type { Route } from "next";
import { Heading } from "./Heading";
import { ArrowLeftIcon } from "./icons";

type LargeTitleHeaderProps = {
  /**
   * Title content. Accepts a string or a ReactNode so consumers can
   * include an italic accent (`<em>` inside `<Heading>`).
   */
  title: React.ReactNode;
  subtitle?: string;
  backHref?: Route | URL;
  backLabel?: string;
  /**
   * Optional content rendered at the trailing edge of the top row (e.g.
   * a settings icon, a "Done" button). Rendered only if `backHref` or
   * `trailing` is present.
   */
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * Large title header — iOS-style screen header with an optional back chip,
 * optional trailing slot, and a display-size title with optional subtitle.
 *
 * v1 is **non-collapsing**: the title sits at the top of the screen and
 * doesn't shrink on scroll. The component is structured so a future
 * "collapse on scroll" variant can layer in without API changes — when
 * that lands, it'll use the same props and add scroll-driven opacity
 * crossfade per §12e of design-system.md.
 *
 * Use for: Home, Flights list, Map, Services, Profile — any
 * authenticated-app screen whose title is content-first. For step screens
 * with a back chip + step label, use `<ScreenHeader>` instead — that
 * primitive is for the smaller, role-driven onboarding flow.
 */
export function LargeTitleHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Go back",
  trailing,
  className = "",
}: LargeTitleHeaderProps) {
  const hasTopRow = backHref != null || trailing != null;

  return (
    <header className={`px-6 ${className}`.trim()}>
      {hasTopRow ? (
        <div className="flex items-center justify-between pt-2">
          {backHref ? (
            <Link
              href={backHref as Route}
              aria-label={backLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
            >
              <ArrowLeftIcon size={16} />
            </Link>
          ) : (
            <span aria-hidden className="h-11 w-11" />
          )}
          {trailing ? (
            <div className="inline-flex items-center gap-2">{trailing}</div>
          ) : null}
        </div>
      ) : null}
      <div className={hasTopRow ? "mt-6" : "pt-8"}>
        <Heading size="display">{title}</Heading>
        {subtitle ? (
          <p className="mt-2 text-body text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
