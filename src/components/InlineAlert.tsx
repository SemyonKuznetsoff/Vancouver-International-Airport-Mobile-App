"use client";

import type { Route } from "next";
import { Button } from "./Button";

type Variant = "info" | "success" | "warning" | "danger" | "neutral";
type LiveRole = "status" | "alert";

type Action = {
  label: string;
  href?: Route | URL;
  onClick?: () => void;
};

type InlineAlertProps = {
  variant?: Variant;
  icon?: React.ReactNode;
  title?: string;
  description: string;
  action?: Action;
  /**
   * `status` (default) → polite, announced when AT is free.
   * `alert` → assertive, interrupts. Reserve for urgent live data
   * (gate change while boarding, sudden delay, security closure).
   */
  role?: LiveRole;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  info: "bg-[var(--color-info-bg)] border-[var(--color-info-border)] text-[var(--color-info-fg)]",
  success:
    "bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-fg)]",
  warning:
    "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning-fg)]",
  danger:
    "bg-[var(--color-danger-bg)] border-[var(--color-danger-border)] text-[var(--color-danger-fg)]",
  neutral:
    "bg-[var(--color-neutral-bg)] border-[var(--color-neutral-border)] text-[var(--color-neutral-fg)]",
};

/**
 * Flat status banner for inline live data states. Not a Card — the variant
 * tint *is* the chrome. Use for gate changes, delays, connection risk,
 * parking availability warnings, security wait spikes.
 *
 * For stand-alone "page is broken" framing, use `<ErrorState>` instead —
 * that primitive composes Card and centers itself; InlineAlert is meant
 * to sit inside a content flow.
 */
export function InlineAlert({
  variant = "info",
  icon,
  title,
  description,
  action,
  role = "status",
  className = "",
}: InlineAlertProps) {
  const ariaLive = role === "alert" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`rounded-[var(--radius-panel)] border p-4 ${variantClasses[variant]} ${className}`.trim()}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span aria-hidden className="mt-[2px] inline-flex shrink-0 items-center justify-center">
            {icon}
          </span>
        ) : null}
        <div className="flex flex-1 flex-col gap-1">
          {title ? (
            <p className="text-body-sm font-semibold">{title}</p>
          ) : null}
          <p className="text-body-sm">{description}</p>
          {action ? <InlineAlertAction action={action} /> : null}
        </div>
      </div>
    </div>
  );
}

function InlineAlertAction({ action }: { action: Action }) {
  if (action.href) {
    return (
      <div className="mt-2 self-start">
        <Button variant="ghost" href={action.href} onClick={action.onClick} className="!w-auto">
          {action.label}
        </Button>
      </div>
    );
  }
  return (
    <div className="mt-2 self-start">
      <Button variant="ghost" onClick={action.onClick} className="!w-auto">
        {action.label}
      </Button>
    </div>
  );
}
