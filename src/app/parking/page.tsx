"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ChipFilter } from "@/components/ChipFilter";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import {
  ArrowLeftIcon,
  InfoIcon,
  NavigationIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "@/components/icons";

type FilterKey = "all" | "covered" | "economy" | "closest";

type Filter = {
  key: FilterKey;
  label: string;
};

type ParkadeTone = "recommended" | "limited" | "full";

type ParkadeChip = {
  id: string;
  label: string;
};

type Parkade = {
  id: string;
  name: string;
  tone: ParkadeTone;
  toneLabel: string;
  pricePerDay: number;
  pricePerHour?: number;
  description: string;
  walkMin: number;
  availabilityLabel: string;
  availabilityPct: number;
  fullPctLabel: string;
  chips: ParkadeChip[];
  reserveHref: Route;
};

const FILTERS: Filter[] = [
  { key: "all", label: "All" },
  { key: "covered", label: "Covered" },
  { key: "economy", label: "Economy" },
  { key: "closest", label: "Closest" },
];

const PARKADES: Parkade[] = [
  {
    id: "p1",
    name: "Parkade P1",
    tone: "recommended",
    toneLabel: "Recommended",
    pricePerDay: 35,
    pricePerHour: 5,
    description: "Covered · International",
    walkMin: 5,
    availabilityLabel: "Available",
    availabilityPct: 40,
    fullPctLabel: "40% full",
    chips: [
      { id: "covered", label: "Covered" },
      { id: "elevator", label: "Elevator" },
    ],
    reserveHref: "/parking/reserve" as Route,
  },
  {
    id: "p2",
    name: "Parkade P2",
    tone: "limited",
    toneLabel: "Limited",
    pricePerDay: 32,
    pricePerHour: 4.5,
    description: "Covered · Domestic",
    walkMin: 7,
    availabilityLabel: "Filling up",
    availabilityPct: 78,
    fullPctLabel: "78% full",
    chips: [
      { id: "covered", label: "Covered" },
      { id: "elevator", label: "Elevator" },
    ],
    reserveHref: "/parking/reserve" as Route,
  },
  {
    id: "p3",
    name: "Parkade P3",
    tone: "recommended",
    toneLabel: "Best value",
    pricePerDay: 24,
    pricePerHour: 3,
    description: "Open-air · Economy",
    walkMin: 12,
    availabilityLabel: "Available",
    availabilityPct: 22,
    fullPctLabel: "22% full",
    chips: [
      { id: "openair", label: "Open-air" },
      { id: "shuttle", label: "Shuttle" },
    ],
    reserveHref: "/parking/reserve" as Route,
  },
  {
    id: "p4",
    name: "Parkade P4",
    tone: "full",
    toneLabel: "Full",
    pricePerDay: 30,
    description: "Covered · Domestic",
    walkMin: 4,
    availabilityLabel: "No spaces",
    availabilityPct: 100,
    fullPctLabel: "100% full",
    chips: [{ id: "covered", label: "Covered" }],
    reserveHref: "/parking/reserve" as Route,
  },
];

export default function ParkingPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  return (
    <AppShellAuthed activeHref="/services">
      <ParkingHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <FilterRow active={filter} onSelect={setFilter} />
        <LiveUpdateCard />
        <PromoCard />
        <LiveAvailabilitySection parkades={PARKADES} />
      </div>
    </AppShellAuthed>
  );
}

function ParkingHeader() {
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
          Parking
        </h1>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
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
      aria-label="Filter parkades"
      className="-mx-6 overflow-x-auto px-6"
    >
      <div className="flex w-max gap-2">
        {FILTERS.map((f) => (
          <ChipFilter
            key={f.key}
            tone="teal"
            selected={f.key === active}
            onToggle={() => onSelect(f.key)}
          >
            {f.label}
          </ChipFilter>
        ))}
      </div>
    </div>
  );
}

function LiveUpdateCard() {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      className="flex items-start gap-3"
    >
      <IconTile
        size={36}
        className="rounded-[var(--radius-tile)] bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]"
      >
        <InfoIcon size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-micro uppercase text-[var(--color-warning-fg)]">
          Live update
        </span>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-text-primary)]">
            P4 Domestic is full.
          </span>{" "}
          P1 has the best availability. P2 is getting limited.
        </p>
      </div>
    </Card>
  );
}

function PromoCard() {
  return (
    <HeroSurface
      as="section"
      aria-label="Reserve parking ahead and save up to 20%"
      angle="157deg"
      className="relative flex flex-col gap-4 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <PromoOrbits />

      <span className="relative inline-flex h-7 items-center gap-2 self-start rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-surface-hero-chip)] px-3 text-micro uppercase text-[var(--color-map-mint)]">
        <SparkleIcon size={12} aria-hidden />
        Reserve ahead
      </span>

      <div className="relative flex flex-col gap-1.5">
        <h2 className="text-title text-[var(--color-surface-hero-fg)]">
          Save up to 20% vs. drive-in
        </h2>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          Guaranteed space. Free cancellation up to 24h before entry.
        </p>
      </div>

      <div className="relative flex items-center justify-between gap-3 pt-1">
        <div className="w-44 shrink-0">
          <Button
            tone="inverse"
            href={"/parking/reserve" as Route}
          >
            Reserve a Space
          </Button>
        </div>
        <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-surface-hero-fg-muted)]">
          <ShieldCheckIcon size={12} aria-hidden />
          Free cancellation
        </span>
      </div>
    </HeroSurface>
  );
}

function PromoOrbits() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 330 220"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-map-mint)] opacity-[0.08]"
    >
      <circle cx="300" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="300" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="300" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function LiveAvailabilitySection({ parkades }: { parkades: Parkade[] }) {
  return (
    <section aria-label="Live parkade availability" className="flex flex-col gap-3 pt-1">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Live Availability
        </h2>
        <p className="text-label text-[var(--color-text-secondary)]">
          {parkades.length} options · Sorted: Best match
        </p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {parkades.map((p) => (
          <li key={p.id}>
            <ParkadeCard parkade={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const TONE_PILL: Record<ParkadeTone, string> = {
  recommended:
    "bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]",
  limited:
    "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  full: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
};

function ParkadeCard({ parkade }: { parkade: Parkade }) {
  const isFull = parkade.tone === "full";
  return (
    <Card as="article" surface="sheet" padding="default" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-section-title text-[var(--color-text-primary)]">
              {parkade.name}
            </h3>
            <span
              className={`inline-flex h-6 items-center rounded-[var(--radius-pill)] px-2.5 text-micro uppercase ${TONE_PILL[parkade.tone]}`}
            >
              {parkade.toneLabel}
            </span>
          </div>
          <p className="inline-flex flex-wrap items-center gap-1.5 text-body-sm text-[var(--color-text-secondary)]">
            <span>{parkade.description}</span>
            <span aria-hidden>·</span>
            <NavigationIcon size={11} aria-hidden />
            <span>{parkade.walkMin} min walk</span>
          </p>
        </div>
        <PriceBlock pricePerDay={parkade.pricePerDay} pricePerHour={parkade.pricePerHour} />
      </div>

      <AvailabilityRow
        label={parkade.availabilityLabel}
        pct={parkade.availabilityPct}
        fullLabel={parkade.fullPctLabel}
        tone={parkade.tone}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {parkade.chips.map((c) => (
            <span
              key={c.id}
              className="inline-flex h-7 items-center rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 text-label text-[var(--color-text-primary)]"
            >
              {c.label}
            </span>
          ))}
        </div>
        <div className="w-28 shrink-0">
          <Button
            tone="teal"
            href={parkade.reserveHref}
            disabled={isFull}
            aria-label={`Reserve ${parkade.name}`}
          >
            Reserve
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PriceBlock({
  pricePerDay,
  pricePerHour,
}: {
  pricePerDay: number;
  pricePerHour?: number;
}) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="inline-flex items-baseline gap-0.5 text-section-title tabular-nums text-[var(--color-text-primary)]">
        ${pricePerDay}
        <span className="text-label text-[var(--color-text-muted)]">/day</span>
      </span>
      {pricePerHour != null ? (
        <span className="text-label tabular-nums text-[var(--color-text-muted)]">
          ${pricePerHour}/hr
        </span>
      ) : null}
    </div>
  );
}

const AVAILABILITY_BAR: Record<ParkadeTone, string> = {
  recommended: "bg-[var(--color-map-mint)]",
  limited: "bg-[var(--color-warning)]",
  full: "bg-[var(--color-danger)]",
};

const AVAILABILITY_LABEL: Record<ParkadeTone, string> = {
  recommended: "text-[var(--color-success)]",
  limited: "text-[var(--color-warning)]",
  full: "text-[var(--color-danger)]",
};

function AvailabilityRow({
  label,
  pct,
  fullLabel,
  tone,
}: {
  label: string;
  pct: number;
  fullLabel: string;
  tone: ParkadeTone;
}) {
  const safe = Math.min(100, Math.max(0, pct));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className={`text-body-sm-emphasis ${AVAILABILITY_LABEL[tone]}`}>
          {label}
        </span>
        <span className="text-label tabular-nums text-[var(--color-text-secondary)]">
          {fullLabel}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}, ${fullLabel}`}
        className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)]"
      >
        <div
          aria-hidden
          className={`h-full rounded-[var(--radius-pill)] ${AVAILABILITY_BAR[tone]}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
