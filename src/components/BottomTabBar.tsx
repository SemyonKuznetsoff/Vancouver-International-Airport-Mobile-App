"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MapIcon,
  ProfileIcon,
  ServicesIcon,
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
  { key: "services", href: "/services", label: "Services", icon: <ServicesIcon size={16} /> },
  { key: "profile", href: "/profile", label: "Profile", icon: <ProfileIcon size={16} /> },
];

type BottomTabBarProps = {
  /**
   * Optional explicit path used to pick the active tab. Defaults to the
   * route returned by `usePathname()`.
   */
  activeHref?: string;
  /**
   * Map of tab key → badge boolean. Renders a small danger-coloured dot
   * over a tab when truthy.
   */
  badges?: Partial<Record<TabKey, boolean>>;
  className?: string;
};

/**
 * Bottom tab navigation — floating dark pill per the Figma direction.
 * Five fixed tabs: Home, Flights, Map, Services, Profile.
 *
 * The active tab renders as a teal pill (`--color-nav-active-bg`) with
 * icon + label inline. Inactive tabs render the icon only at the muted
 * nav foreground. A gradient fade above the pill (consuming
 * `--color-bg-page`) lets scrolling content fade cleanly under the bar.
 *
 * The component positions itself absolutely at `bottom-0` inside the
 * shell column; `<AppShellAuthed>` reserves the corresponding bottom
 * padding inside `<main>` so the last content block clears the nav.
 *
 * A11y: each `<Link>` carries `aria-current="page"` when active and
 * `aria-label={label}` so inactive (icon-only) tabs still announce.
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
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pt-6 ${className}`.trim()}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
        paddingLeft: "max(env(safe-area-inset-left), 20px)",
        paddingRight: "max(env(safe-area-inset-right), 20px)",
        backgroundImage:
          "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-bg-page, var(--color-bg)) 60%, transparent) 40%, var(--color-bg-page, var(--color-bg)) 100%)",
      }}
    >
      <nav
        aria-label="Main"
        className="pointer-events-auto flex w-full max-w-[390px] items-center justify-between rounded-[var(--radius-pill)] bg-[var(--color-nav-surface)] px-3 py-3 shadow-[var(--shadow-nav)]"
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
                  ? "relative inline-flex h-10 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-nav-active-bg)] px-4 text-[var(--color-nav-surface-fg-active)] transition-opacity duration-150 hover:opacity-90"
                  : "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-nav-surface-fg)] transition-colors duration-150 hover:text-[var(--color-nav-surface-fg-active)]"
              }
            >
              <span aria-hidden className="inline-flex items-center justify-center">
                {tab.icon}
              </span>
              {isActive ? (
                <span aria-hidden className="text-body-sm-emphasis">
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
