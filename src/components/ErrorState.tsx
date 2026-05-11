"use client";

import type { Route } from "next";
import { Button } from "./Button";
import { Card } from "./Card";

type Action = {
  label: string;
  href?: Route | URL;
  onClick?: () => void;
};

type ErrorStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  retryAction?: Action;
  secondaryAction?: Action;
  /**
   * `status` (default) → polite live region. Use for non-urgent failures
   * the user already expected to see (search failed, no signal).
   * `alert` → assertive live region. Reserve for urgent, time-sensitive
   * errors (boarding pass failed to load while at the gate).
   */
  role?: "status" | "alert";
  className?: string;
};

/**
 * Centered "something is wrong" panel. Composes Card and accents the
 * icon with `--color-danger` while keeping the card chrome neutral — the
 * tone is calm, not red-everywhere. Pair with a retry action whenever the
 * underlying work can be retried client-side.
 *
 * Copy guidance:
 * - Title: state the fact, not the blame ("We can't reach Vancouver right
 *   now"), never the technical reason ("HTTP 503: Service Unavailable").
 * - Description: one short line on what's happening and what the user
 *   can do next.
 * - Retry label: an active verb, not "Retry" alone — "Try again",
 *   "Reload flights", "Check connection".
 */
export function ErrorState({
  icon,
  title,
  description,
  retryAction,
  secondaryAction,
  role = "status",
  className = "",
}: ErrorStateProps) {
  const ariaLive = role === "alert" ? "assertive" : "polite";

  return (
    <Card as="section" padding="lg" className={className}>
      <div
        role={role}
        aria-live={ariaLive}
        className="flex flex-col items-center gap-4 text-center"
      >
        {icon ? (
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-[var(--color-surface-elevated)] text-[var(--color-danger)]"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex flex-col gap-2">
          <h2 className="text-[15px] font-semibold leading-[1.4] text-[var(--color-text-primary)]">
            {title}
          </h2>
          {description ? (
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {retryAction || secondaryAction ? (
          <div className="mt-2 flex w-full flex-col gap-3">
            {retryAction ? renderAction("primary", retryAction) : null}
            {secondaryAction ? renderAction("ghost", secondaryAction) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function renderAction(variant: "primary" | "ghost", action: Action) {
  if (action.href) {
    return (
      <Button variant={variant} href={action.href} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}
