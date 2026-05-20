"use client";

import { useEffect, useState } from "react";
import {
  formatVancouverDateAccessible,
  formatVancouverDateLabel,
} from "@/lib/date/vancouver";

type VancouverDateLabelProps = {
  /**
   * When true, the visible label is rendered uppercase to match the
   * eyebrow/tracking rhythm of the surrounding row. Defaults to true
   * because every site of use today (e.g. My Flights header) sits in
   * an uppercase eyebrow slot.
   */
  uppercase?: boolean;
  className?: string;
};

/**
 * Live "current date" label rendered against the `America/Vancouver`
 * time zone. The component is a Client Component so the value is not
 * frozen at build time — the rendered string reflects the user's
 * current date in Vancouver and refreshes every minute while mounted.
 *
 * Hydration: the initial state computes the label from `new Date()` so
 * the DOM has stable text on first paint. Server-rendered HTML (from
 * static prerender at build time) may have been computed at a
 * different moment, so we mark the visible span with
 * `suppressHydrationWarning` and re-set the value on mount.
 */
export function VancouverDateLabel({
  uppercase = true,
  className = "",
}: VancouverDateLabelProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const visible = formatVancouverDateLabel(now);
  const accessible = `Current date in Vancouver: ${formatVancouverDateAccessible(now)}`;

  return (
    <span
      aria-label={accessible}
      suppressHydrationWarning
      className={className}
    >
      {uppercase ? visible.toUpperCase() : visible}
    </span>
  );
}
