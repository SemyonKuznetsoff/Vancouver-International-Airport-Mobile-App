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
  { key: "home", href: "/home", label: "Home", icon: <HomeIcon size={22} /> },
  { key: "flights", href: "/flights", label: "Flights", icon: <PlaneIcon size={22} /> },
  { key: "map", href: "/map", label: "Map", icon: <MapIcon size={22} /> },
  { key: "services", href: "/services", label: "Services", icon: <ServicesIcon size={22} /> },
  { key: "profile", href: "/profile", label: "Profile", icon: <ProfileIcon size={22} /> },
];

type BottomTabBarProps = {
  /**
   * Optional explicit path used to pick the active tab. Defaults to the
   * route returned by `usePathname()`.
   */
  activeHref?: string;
  /**
   * Map of tab key → badge boolean. Renders a small danger-coloured dot
   * over a tab when truthy. Used for unread notifications, flight alerts,
   * etc. Caller owns the data source.
   */
  badges?: Partial<Record<TabKey, boolean>>;
  className?: string;
};

/**
 * Bottom tab navigation for the logged-in YVR app.
 *
 * - Five fixed tabs: Home, Flights, Map, Services, Profile.
 * - Safe-area aware: the bar reserves `env(safe-area-inset-bottom)` so it
 *   sits above the home indicator on iOS.
 * - Active tab is detected from `usePathname()` (or `activeHref` if
 *   explicitly passed). Active = `aria-current="page"` + primary colour;
 *   inactive = secondary colour with hover lift.
 * - Optional badge dot per tab via the `badges` prop.
 *
 * Layout assumption: this component is the last child of `AppShellAuthed`
 * inside a flex column. Its height is 56px + safe-area; main content
 * scrolls above it. Do not render it inside onboarding `AppShell`.
 */
export function BottomTabBar({
  activeHref,
  badges,
  className = "",
}: BottomTabBarProps) {
  const pathname = usePathname();
  const active = activeHref ?? pathname ?? "";

  return (
    <nav
      aria-label="Main"
      className={`flex w-full shrink-0 items-stretch justify-around border-t border-[var(--color-border)] bg-[var(--color-surface-card)] ${className}`.trim()}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
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
            className={`relative inline-flex h-14 flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150 ${
              isActive
                ? "text-[var(--color-action-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span aria-hidden className="inline-flex items-center justify-center">
              {tab.icon}
            </span>
            <span aria-hidden className="text-micro uppercase">
              {tab.label}
            </span>
            {badges?.[tab.key] ? (
              <span
                aria-hidden
                className="absolute right-[28%] top-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
