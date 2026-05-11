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
  className?: string;
};

export function PermissionCard({
  icon,
  title,
  description,
  footerLabel,
  defaultOn = true,
  toggleAriaLabel,
  className = "",
}: PermissionCardProps) {
  const [on, setOn] = useState(defaultOn);

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
              onChange={setOn}
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
