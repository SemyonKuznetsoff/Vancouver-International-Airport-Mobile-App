"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MapIcon,
  PlaneIcon,
  ProfileIcon,
  ServicesIcon,
} from "./icons";

type TabKey = "home" | "flights" | "map" | "services" | "profile";

type Tab = {
  key: TabKey;
  href: string;
  label: string;
  icon: React.ReactNode;
};

const TABS: Tab[] = [
  { key: "home", href: "/home", label: "Home", icon: <HomeIcon size={18} /> },
  { key: "flights", href: "/flights", label: "Flights", icon: <PlaneIcon size={18} /> },
  { key: "map", href: "/map", label: "Map", icon: <MapIcon size={18} /> },
  { key: "services", href: "/services", label: "Services", icon: <ServicesIcon size={18} /> },
  { key: "profile", href: "/profile", label: "Profile", icon: <ProfileIcon size={18} /> },
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
 * Renders as a **floating dark dock pill** centred above the home
 * indicator: a near-black charcoal capsule (`--color-nav-surface`)
 * containing five tab items. The active tab fills with
 * `--color-nav-active-bg` (dark teal) and shows its icon **plus**
 * label; inactive tabs render icon-only. The "icon + label vs
 * icon-only" treatment is the primary non-colour cue for active
 * state, paired with `aria-current="page"`.
 *
 * - Five fixed tabs: Home, Flights, Map, Services, Profile.
 * - Safe-area aware: the outer wrapper reserves
 *   `env(safe-area-inset-bottom)` so the pill clears the home
 *   indicator on iOS.
 * - Active tab is detected from `usePathname()` (or `activeHref` if
 *   explicitly passed). Sub-routes can light a parent tab by passing
 *   `activeHref` through `AppShellAuthed` (e.g. /parking,
 *   /parking/reserve, /ground-transport, /lounges-premium all light
 *   Services; /help-support lights Profile).
 * - Optional badge dot per tab via the `badges` prop.
 *
 * Layout assumption: this component is the last child of
 * `AppShellAuthed` inside a flex column. The wrapper occupies a small
 * footer region so main content scrolls **above** the pill, not
 * underneath it.
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
        className="pointer-events-auto flex h-14 w-full items-center justify-around rounded-[var(--radius-pill)] bg-[var(--color-nav-surface)] px-2 shadow-[var(--shadow-nav)]"
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
              className={
                isActive
                  ? "relative inline-flex h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-nav-active-bg)] px-4 text-[var(--color-nav-active-fg)] transition-colors duration-200 focus-visible:[outline:var(--focus-ring-on-dark)]"
                  : "relative inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-nav-fg-muted)] transition-colors duration-200 hover:text-[var(--color-nav-fg)] focus-visible:[outline:var(--focus-ring-on-dark)]"
              }
            >
              <span aria-hidden className="inline-flex items-center justify-center">
                {tab.icon}
              </span>
              {isActive ? (
                <span className="text-label text-[var(--color-nav-active-fg)]">
                  {tab.label}
                </span>
              ) : null}
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
