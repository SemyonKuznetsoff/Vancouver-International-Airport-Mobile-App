"use client";

import { useState } from "react";
import { Card } from "./Card";
import { IconTile } from "./IconTile";
import { Toggle } from "./Toggle";

type PermissionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  footerLabel: string;
  defaultOn?: boolean;
  toggleAriaLabel: string;
  /**
   * Fires whenever the toggle changes, with the new value. The toggle
   * only records a preference — it does **not** request the underlying
   * OS permission. Callers can use this hook to persist the preference
   * (e.g. localStorage) so the user's intent survives a reload.
   */
  onChange?: (next: boolean) => void;
  className?: string;
};

export function PermissionCard({
  icon,
  title,
  description,
  footerLabel,
  defaultOn = true,
  toggleAriaLabel,
  onChange,
  className = "",
}: PermissionCardProps) {
  const [on, setOn] = useState(defaultOn);

  const handleChange = (next: boolean) => {
    setOn(next);
    onChange?.(next);
  };

  return (
    <Card as="article" className={className}>
      <div className="flex items-start gap-4">
        <IconTile size={40}>{icon}</IconTile>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="max-w-[160px] text-section-title text-[var(--color-text-primary)]">
              {title}
            </h2>
            <Toggle
              checked={on}
              onChange={handleChange}
              ariaLabel={toggleAriaLabel}
            />
          </div>

          <p className="text-body-sm text-[var(--color-text-secondary)]">
            {description}
          </p>

          <p className="mt-2 inline-flex items-center gap-2 text-micro uppercase text-[var(--color-text-secondary)]">
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-[var(--color-aurora-mint)]"
            />
            {footerLabel}
          </p>
        </div>
      </div>
    </Card>
  );
}
