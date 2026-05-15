"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayersIcon,
  MapIcon,
  ProfileIcon,
  TicketIcon,
} from "./icons";

type TabKey = "home" | "flights" | "map" | "services" | "profile";

type Tab = {
  key: TabKey;
  href: string;
  label: string;
  icon: React.ReactNode;
};

const TABS: Tab[] = [
  { key: "home", href: "/home", label: "Home", icon: <HomeIcon size={16} /> },
  { key: "flights", href: "/flights", label: "Flights", icon: <TicketIcon size={16} /> },
  { key: "map", href: "/map", label: "Map", icon: <MapIcon size={16} /> },
  { key: "services", href: "/services", label: "Services", icon: <LayersIcon size={16} /> },
  { key: "profile", href: "/profile", label: "Profile", icon: <ProfileIcon size={16} /> },
];

type BottomTabBarProps = {
  /**
   * Optional explicit path used to pick the active tab. Defaults to the
   * route returned by `usePathname()`. Sub-routes that belong under a
   * top tab but don't share its pathname prefix (e.g. `/parking/reserve`
   * belongs under Services) pass `activeHref="/services"`.
   */
  activeHref?: string;
  /**
   * Map of tab key → badge boolean. Renders a small danger-coloured dot
   * over a tab when truthy. Used for unread notifications, flight
   * alerts, etc. Caller owns the data source.
   */
  badges?: Partial<Record<TabKey, boolean>>;
  className?: string;
};

/**
 * Bottom tab navigation for the logged-in YVR app.
 *
 * Renders as a **floating dark dock** centred above the home indicator:
 * a warm near-black rounded-square (`--color-nav-surface`,
 * `--radius-nav` = 28px) containing five tab items. The active tab
 * fills with `--color-nav-active-bg` (dark teal) and shows icon **plus**
 * label inside a compact 32px-tall pill; inactive tabs are 16px
 * icon-only. The "icon + label vs icon-only" treatment is the primary
 * non-colour cue for active state, paired with `aria-current="page"`.
 *
 * - Five fixed tabs: Home, Flights, Map, Services, Profile.
 * - Safe-area aware: the outer wrapper reserves
 *   `env(safe-area-inset-bottom)` so the dock clears the home
 *   indicator on iOS.
 * - Active tab detected from `usePathname()` (or `activeHref` if
 *   passed). Sub-routes can light a parent tab by passing `activeHref`
 *   through `AppShellAuthed` (e.g. /parking, /parking/reserve,
 *   /ground-transport, /lounges-premium all light Services;
 *   /help-support lights Profile).
 * - Optional badge dot per tab via the `badges` prop.
 *
 * **Touch targets.** The visible active capsule is 32px tall (Figma
 * fidelity) but each tab `<Link>` is `h-11` (44px) so the hit area
 * meets WCAG 2.5.5 even when the visible chrome is smaller.
 *
 * Layout assumption: last child of `AppShellAuthed` inside a flex
 * column. Main content scrolls above the dock.
 */
export function BottomTabBar({
  activeHref,
  badges,
  className = "",
}: BottomTabBarProps) {
  const pathname = usePathname();
  const active = activeHref ?? pathname ?? "";

  return (
    <div
      className={`pointer-events-none flex w-full shrink-0 justify-center px-6 ${className}`.trim()}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
    >
      <nav
        aria-label="Main"
        className="pointer-events-auto flex w-full items-center justify-between gap-1 rounded-[var(--radius-nav)] bg-[var(--color-nav-surface)] px-3 py-2 shadow-[var(--shadow-nav)]"
      >
        {TABS.map((tab) => {
          const isActive =
            active === tab.href || active.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.key}
              href={tab.href as Route}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={`relative inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] transition-colors duration-200 focus-visible:[outline:var(--focus-ring-on-dark)] ${
                isActive
                  ? "text-[var(--color-nav-active-fg)]"
                  : "w-12 text-[var(--color-nav-fg-muted)] hover:text-[var(--color-nav-fg)]"
              }`}
            >
              {isActive ? (
                <span className="inline-flex h-8 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-nav-active-bg)] px-4">
                  <span aria-hidden className="inline-flex items-center justify-center">
                    {tab.icon}
                  </span>
                  <span className="text-label font-semibold">{tab.label}</span>
                </span>
              ) : (
                <span aria-hidden className="inline-flex items-center justify-center">
                  {tab.icon}
                </span>
              )}
              {badges?.[tab.key] ? (
                <span
                  aria-hidden
                  className="absolute right-1 top-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
