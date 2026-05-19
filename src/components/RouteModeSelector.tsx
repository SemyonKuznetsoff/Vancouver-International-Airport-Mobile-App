import Link from "next/link";
import type { Route } from "next";
import {
  AccessibilityIcon,
  FootstepsIcon,
  UsersIcon,
} from "./icons";

export type ModeId = "standard" | "accessible" | "family";

type Mode = {
  id: ModeId;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  href: Route;
};

const MODES: Mode[] = [
  {
    id: "standard",
    label: "Standard",
    ariaLabel: "Standard route — 8 minutes",
    icon: <FootstepsIcon size={14} />,
    href: "/map/standard-route",
  },
  {
    id: "accessible",
    label: "Accessible",
    ariaLabel: "Accessible route — 12 minutes",
    icon: <AccessibilityIcon size={14} />,
    href: "/map/accessible-route",
  },
  {
    id: "family",
    label: "Family",
    ariaLabel: "Family route — 14 minutes",
    icon: <UsersIcon size={14} />,
    href: "/map/family-route",
  },
];

/**
 * Shared segmented control for switching between the three route mode
 * screens (`/map/standard-route`, `/map/accessible-route`,
 * `/map/family-route`). The active mode renders as a non-interactive
 * `<span aria-current="page">` — never a fake-clickable link — and the
 * other two render as `<Link>` to their canonical routes. Visual chrome
 * (pill track, active sheet fill, hover) is intentionally preserved
 * byte-for-byte from the three page-local copies that preceded this.
 */
export function RouteModeSelector({ active }: { active: ModeId }) {
  return (
    <nav
      aria-label="Route mode"
      className="flex items-stretch gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] p-1"
    >
      {MODES.map((m) => {
        const isActive = m.id === active;
        const ariaLabel = isActive
          ? `${m.ariaLabel}, currently selected`
          : m.ariaLabel;
        const content = (
          <>
            <span aria-hidden>{m.icon}</span>
            <span>{m.label}</span>
          </>
        );
        const className = `flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] text-body-sm-emphasis transition-colors duration-150 ${
          isActive
            ? "bg-[var(--color-surface-sheet)] text-[var(--color-text-primary)] shadow-[var(--shadow-segment)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`;
        if (isActive) {
          return (
            <span
              key={m.id}
              aria-current="page"
              aria-label={ariaLabel}
              className={className}
            >
              {content}
            </span>
          );
        }
        return (
          <Link
            key={m.id}
            href={m.href}
            aria-label={ariaLabel}
            className={className}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
