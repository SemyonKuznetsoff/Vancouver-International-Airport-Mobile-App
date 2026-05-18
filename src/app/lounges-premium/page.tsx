"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { ChipFilter } from "@/components/ChipFilter";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  BriefcaseIcon,
  CheckIcon,
  DiningIcon,
  FootstepsIcon,
  LocationPinIcon,
  MoonIcon,
  SearchIcon,
  ShowerIcon,
  StarIcon,
  UsersIcon,
  WifiIcon,
} from "@/components/icons";

type FilterKey = "all" | "my-access" | "walk-in" | "priority-pass";

type Filter = {
  key: FilterKey;
  label: string;
  count?: number;
};

const FILTERS: Filter[] = [
  { key: "all", label: "All Lounges", count: 4 },
  { key: "my-access", label: "My Access" },
  { key: "walk-in", label: "Walk-in" },
  { key: "priority-pass", label: "Priority Pass" },
];

type Amenity = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const FEATURED_AMENITIES: Amenity[] = [
  { id: "food", label: "Food & Bar", icon: <DiningIcon size={12} /> },
  { id: "showers", label: "Showers", icon: <ShowerIcon size={12} /> },
  { id: "quiet", label: "Quiet Zone", icon: <MoonIcon size={12} /> },
  { id: "business", label: "Business", icon: <BriefcaseIcon size={12} /> },
  { id: "wifi", label: "Wi-Fi", icon: <WifiIcon size={12} /> },
];

const PACIFIC_AMENITIES: Amenity[] = [
  { id: "food", label: "Food & Bar", icon: <DiningIcon size={12} /> },
  { id: "showers", label: "Showers", icon: <ShowerIcon size={12} /> },
  { id: "wifi", label: "Wi-Fi", icon: <WifiIcon size={12} /> },
  { id: "family", label: "Family", icon: <UsersIcon size={12} /> },
];

export default function LoungesPremiumPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  return (
    <AppShellAuthed activeHref="/services">
      <LoungesHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-2 pb-6">
        <MembershipHero />
        <FilterRow active={filter} onSelect={setFilter} />
        <FeaturedLoungeCard />
        <MoreLoungesHeader />
        <PacificGatewayCard />
        <PlazaPremiumCard />
      </div>
    </AppShellAuthed>
  );
}

function LoungesHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to services"
        href={"/services" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Lounges &amp; Premium
        </h1>
        <p className="text-label text-[var(--color-text-secondary)]">
          International departures
        </p>
      </div>

      <HeaderIconButton aria-label="Search lounges">
        <SearchIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function MembershipHero() {
  return (
    <HeroSurface
      as="section"
      aria-label="Aeroplan Gold lounge access"
      angle="163deg"
      className="relative flex flex-col gap-4 overflow-hidden p-5 shadow-[var(--shadow-hero-card)]"
    >
      <HeroGlow />

      <div className="relative flex items-start justify-between gap-3">
        <AccessIncludedBadge />
        <TierBadge>Gold</TierBadge>
      </div>

      <div className="relative flex flex-col gap-1">
        <h2 className="text-title text-[var(--color-surface-hero-fg)]">
          Aeroplan Gold
        </h2>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          Valid for domestic and international departures
        </p>
      </div>

      <span
        aria-hidden
        className="relative block h-px w-full bg-gradient-to-r from-transparent via-[var(--color-surface-hero-tile-border)] to-transparent"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
            Eligible lounges
          </span>
          <ul className="flex flex-col gap-1">
            <EligibleLounge>Air Canada Maple Leaf</EligibleLounge>
            <EligibleLounge>Pacific Gateway Lounge</EligibleLounge>
          </ul>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Member · YVR
          </span>
          <span className="font-mono text-label text-[var(--color-hero-tier-gold-fg)]">
            AC · 4471 · 8829
          </span>
        </div>
      </div>
    </HeroSurface>
  );
}

function HeroGlow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-[-60px] top-[-60px] h-[180px] w-[180px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, var(--color-map-mint-bg) 0%, transparent 70%)",
      }}
    />
  );
}

function AccessIncludedBadge() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <CheckIcon size={10} />
      </span>
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        Access included
      </span>
    </span>
  );
}

function TierBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-[var(--radius-pill)] border border-[var(--color-hero-tier-gold-border)] bg-[var(--color-hero-tier-gold-bg)] px-3 text-micro uppercase text-[var(--color-hero-tier-gold-fg)]">
      {children}
    </span>
  );
}

function EligibleLounge({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-body-sm text-[var(--color-surface-hero-fg)]">
      <span
        aria-hidden
        className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-tier-gold-dot)]"
      />
      {children}
    </li>
  );
}

function FilterRow({
  active,
  onSelect,
}: {
  active: FilterKey;
  onSelect: (key: FilterKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter lounges"
      className="-mx-6 overflow-x-auto px-6"
    >
      <div className="flex w-max gap-2">
        {FILTERS.map((f) => {
          const selected = f.key === active;
          return (
            <ChipFilter
              key={f.key}
              tone="teal"
              selected={selected}
              onToggle={() => onSelect(f.key)}
            >
              <span className="inline-flex items-center gap-1.5">
                {f.label}
                {f.count !== undefined ? (
                  <span
                    className={
                      selected
                        ? "text-[var(--color-map-mint)]"
                        : "text-[var(--color-text-muted)]"
                    }
                  >
                    {f.count}
                  </span>
                ) : null}
              </span>
            </ChipFilter>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedLoungeCard() {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="none"
      className="flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <BestMatchBadge />
        <RatingPill rating="4.7" reviews={842} />
      </div>

      <div className="flex flex-col gap-1.5 px-5 pt-3.5">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Air Canada Maple Leaf Lounge
        </h2>
        <p className="inline-flex items-center gap-2 text-body-sm text-[var(--color-text-secondary)]">
          <LocationPinIcon size={12} aria-hidden />
          International · Level 3 · near Gate E
        </p>
      </div>

      <MetricsStrip />

      <div className="flex flex-wrap gap-2 px-5 pt-4 pb-5">
        {FEATURED_AMENITIES.map((a) => (
          <AmenityChip key={a.id} icon={a.icon}>
            {a.label}
          </AmenityChip>
        ))}
      </div>
    </Card>
  );
}

function BestMatchBadge() {
  return (
    <span className="inline-flex h-6 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-tier-gold-border)] bg-[var(--color-tier-gold-bg)] px-2.5 text-micro uppercase text-[var(--color-tier-gold-fg)]">
      <span
        aria-hidden
        className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-tier-gold-dot)]"
      />
      Best match near your gate
    </span>
  );
}

function RatingPill({ rating, reviews }: { rating: string; reviews: number }) {
  return (
    <span
      aria-label={`Rated ${rating} out of 5, ${reviews} reviews`}
      className="inline-flex items-center gap-1 text-body-sm text-[var(--color-text-primary)]"
    >
      <span aria-hidden className="text-[var(--color-tier-gold-dot)]">
        <StarIcon size={12} />
      </span>
      <span className="tabular-nums">{rating}</span>
      <span className="text-[var(--color-text-muted)]">· {reviews}</span>
    </span>
  );
}

function MetricsStrip() {
  return (
    <div className="mt-4 grid grid-cols-3 border-t border-[var(--color-border-soft)] px-5">
      <MetricCell label="Walk">
        <span className="inline-flex items-center gap-1.5 text-section-title text-[var(--color-text-primary)]">
          <FootstepsIcon size={14} aria-hidden />
          6 min
        </span>
      </MetricCell>
      <MetricCell label="Access" divider>
        <span className="inline-flex items-center gap-1.5 text-body text-[var(--color-text-primary)]">
          <span aria-hidden className="text-[var(--color-success)]">
            <CheckIcon size={12} />
          </span>
          Included
        </span>
      </MetricCell>
      <MetricCell label="Crowd" divider>
        <span className="inline-flex items-center gap-1.5 text-body text-[var(--color-text-primary)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
          />
          Quiet now
        </span>
      </MetricCell>
    </div>
  );
}

function MetricCell({
  label,
  divider = false,
  children,
}: {
  label: string;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-1 py-3 ${
        divider ? "border-l border-[var(--color-border-soft)] pl-3" : ""
      }`}
    >
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
      {children}
    </div>
  );
}

function AmenityChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] px-2.5 text-label text-[var(--color-text-primary)]">
      <span aria-hidden className="inline-flex text-[var(--color-text-muted)]">
        {icon}
      </span>
      {children}
    </span>
  );
}

function MoreLoungesHeader() {
  return (
    <div className="flex items-center justify-between pt-2">
      <h2 className="text-eyebrow uppercase text-[var(--color-text-muted)]">
        More lounges
      </h2>
      <button
        type="button"
        className="inline-flex h-11 items-center text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
      >
        Compare all
      </button>
    </div>
  );
}

function PacificGatewayCard() {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="none"
      className="overflow-hidden"
    >
      <button
        type="button"
        aria-label="Open Pacific Gateway Lounge details"
        className="flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex flex-col gap-1">
            <h2 className="text-section-title text-[var(--color-text-primary)]">
              Pacific Gateway Lounge
            </h2>
            <span className="text-body-sm text-[var(--color-text-secondary)]">
              International · Level 3
            </span>
          </span>

          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <DotLabel dotClassName="bg-[var(--color-tier-gold-dot)]">
              Walk-in $55
            </DotLabel>
            <DotLabel dotClassName="bg-[var(--color-warning)]">
              Moderate
            </DotLabel>
            <span className="inline-flex items-center gap-1 text-label text-[var(--color-text-secondary)]">
              <FootstepsIcon size={10} aria-hidden />
              8 min
            </span>
          </span>

          <span className="flex flex-wrap gap-2 pt-1">
            {PACIFIC_AMENITIES.map((a) => (
              <AmenityChip key={a.id} icon={a.icon}>
                {a.label}
              </AmenityChip>
            ))}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-text-primary)]">
            <span aria-hidden className="text-[var(--color-tier-gold-dot)]">
              <StarIcon size={10} />
            </span>
            <span className="tabular-nums">4.4</span>
          </span>
          <span className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] px-3 text-body-sm-emphasis text-[var(--color-action-teal)]">
            Reserve
            <ArrowRightIcon size={12} aria-hidden />
          </span>
        </span>
      </button>
    </Card>
  );
}

function PlazaPremiumCard() {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="none"
      className="overflow-hidden"
    >
      <button
        type="button"
        aria-label="Open Plaza Premium Lounge details"
        className="flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 className="text-section-title text-[var(--color-text-primary)]">
            Plaza Premium Lounge
          </h2>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <DotLabel dotClassName="bg-[var(--color-action-teal)]">
              Priority Pass
            </DotLabel>
            <DotLabel dotClassName="bg-[var(--color-warning)]">
              Limited
            </DotLabel>
            <span className="inline-flex items-center gap-1 text-label text-[var(--color-text-secondary)]">
              <FootstepsIcon size={10} aria-hidden />
              10 min
            </span>
          </span>
        </span>

        <span
          aria-hidden
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] text-[var(--color-text-primary)]"
        >
          <BookmarkIcon size={14} />
        </span>
      </button>
    </Card>
  );
}

function DotLabel({
  dotClassName,
  children,
}: {
  dotClassName: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-text-secondary)]">
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`}
      />
      {children}
    </span>
  );
}
