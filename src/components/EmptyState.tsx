"use client";

import type { Route } from "next";
import { Button } from "./Button";
import { Card } from "./Card";
import { IconTile } from "./IconTile";

type Action = {
  label: string;
  href?: Route | URL;
  onClick?: () => void;
};

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  className?: string;
};

/**
 * Centered "no content yet" panel. Composes Card with `padding="lg"`.
 *
 * Use for: no trips yet, no notifications, no saved routes, no nearby
 * places. The tone is **invitational, not apologetic** — pair the title
 * with a CTA that gets the user to the next step.
 *
 * Not a live region — empty state is content, not an announcement. If
 * you need to announce "search returned nothing," use `<InlineAlert
 * variant="neutral" role="status">`.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <Card as="section" padding="lg" className={className}>
      <div className="flex flex-col items-center gap-4 text-center">
        {icon ? <IconTile size={40}>{icon}</IconTile> : null}
        <div className="flex flex-col gap-2">
          <h2 className="text-section-title text-[var(--color-text-primary)]">
            {title}
          </h2>
          {description ? (
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {primaryAction || secondaryAction ? (
          <div className="mt-2 flex w-full flex-col gap-3">
            {primaryAction ? renderAction("primary", primaryAction) : null}
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
