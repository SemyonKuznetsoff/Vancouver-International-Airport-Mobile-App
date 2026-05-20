import Link from "next/link";
import type { Route } from "next";
import { HeaderIconButton } from "./HeaderIconButton";
import { ArrowLeftIcon } from "./icons";

type OnboardingStepHeaderProps = {
  /** 1-indexed current step (e.g. 2 of 4). */
  current: number;
  /** Total number of step screens — always 4 in today's flow. */
  total: number;
  /** Where the back chip routes to. The welcome screen has no header. */
  backHref: Route | URL;
  /** Aria label for the back chip. Defaults to "Go back". */
  backLabel?: string;
  /** Optional "Skip" link routed to the next step's destination. */
  skipHref?: Route | URL;
  /** Visible label for the skip link. Defaults to "Skip". */
  skipLabel?: string;
};

/**
 * Shared chrome for non-root onboarding screens — `/onboarding/sign-in`,
 * `/onboarding/preferences`, `/onboarding/permissions`. Renders:
 *
 *   ┌──┐                STEP N OF 4                Skip
 *   │← │                                            ↑ optional
 *   └──┘
 *   ─────  ─────  ─────  ─────  (progress segments)
 *
 * Centering is absolute so the step label stays optically centered
 * between the back chip and the (optional) skip link regardless of
 * the skip label's width. The progress track underneath is the same
 * 4-segment bar used previously in `/onboarding/preferences` —
 * extracted so all three step screens share identical chrome.
 */
export function OnboardingStepHeader({
  current,
  total,
  backHref,
  backLabel = "Go back",
  skipHref,
  skipLabel = "Skip",
}: OnboardingStepHeaderProps) {
  const stepLabel = `Step ${current} of ${total}`;

  return (
    <div className="pt-2">
      <div className="relative">
        <div className="flex items-center justify-between">
          <HeaderIconButton aria-label={backLabel} href={backHref as Route}>
            <ArrowLeftIcon size={16} />
          </HeaderIconButton>
          {skipHref ? (
            <Link
              href={skipHref as Route}
              className="inline-flex h-11 items-center px-2 text-body-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              {skipLabel}
            </Link>
          ) : (
            <span aria-hidden className="h-11 w-11" />
          )}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 inline-flex h-11 items-center justify-center text-eyebrow uppercase text-[var(--color-text-secondary)]"
        >
          {stepLabel}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Onboarding ${stepLabel.toLowerCase()}`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        className="mt-4 flex items-center gap-1.5"
      >
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < current;
          return (
            <span
              key={i}
              aria-hidden
              className={`h-1 flex-1 rounded-[var(--radius-pill)] ${
                filled
                  ? "bg-[var(--color-action-primary)]"
                  : "bg-[var(--color-border-soft)]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
