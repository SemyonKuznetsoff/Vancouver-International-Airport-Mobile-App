"use client";

import { useState } from "react";
import { Card } from "./Card";
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
        <span
          aria-hidden
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
        >
          {icon}
        </span>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="max-w-[160px] text-[15px] font-semibold leading-[1.4] text-[var(--color-text-primary)]">
              {title}
            </h2>
            <Toggle
              checked={on}
              onChange={setOn}
              ariaLabel={toggleAriaLabel}
            />
          </div>

          <p className="text-[13px] font-medium leading-[1.55] text-[var(--color-text-secondary)]">
            {description}
          </p>

          <p className="mt-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.16em] text-[var(--color-text-secondary)]">
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
