"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsVerticalIcon,
  CalendarIcon,
  CarIcon,
  ChevronRightIcon,
  ClockIcon,
  FootstepsIcon,
  LocationPinIcon,
  PlaneIcon,
  UmbrellaIcon,
} from "@/components/icons";

type DurationOption = {
  id: string;
  label: string;
  days: number;
  pricePerDay: number;
};

type JourneyStop = {
  id: string;
  label: string;
  icon: React.ReactNode;
  highlighted: boolean;
};

const DURATIONS: DurationOption[] = [
  { id: "1d", label: "1 Day", days: 1, pricePerDay: 36 },
  { id: "2d", label: "2 Days", days: 2, pricePerDay: 32 },
  { id: "3d", label: "3 Days", days: 3, pricePerDay: 30 },
  { id: "4d", label: "4+ Days", days: 4, pricePerDay: 28 },
];

const JOURNEY: JourneyStop[] = [
  { id: "p1", label: "P1", icon: <CarIcon size={14} />, highlighted: true },
  {
    id: "walkway",
    label: "Walkway",
    icon: <ArrowsVerticalIcon size={14} />,
    highlighted: false,
  },
  { id: "intl", label: "Intl", icon: <PlaneIcon size={14} />, highlighted: true },
];

export default function ReserveParkingPage() {
  const [durationId, setDurationId] = useState<string>(DURATIONS[0].id);
  const selected =
    DURATIONS.find((d) => d.id === durationId) ?? DURATIONS[0];
  const total = selected.pricePerDay * selected.days;
  const totalLabel = total.toFixed(2);
  const supportLabel = `${selected.days} day${selected.days === 1 ? "" : "s"} · taxes included`;

  return (
    <AppShellAuthed activeHref="/services">
      <ReserveHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-2 pb-2">
        <HeroParkadeCard />
        <AvailabilityLine />
        <ReservationDetailsCard
          durationId={durationId}
          onDurationChange={setDurationId}
        />
      </div>
      <SummarySheet total={totalLabel} support={supportLabel} />
    </AppShellAuthed>
  );
}

function ReserveHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pb-4 pt-2">
      <Link
        href={"/services" as Route}
        aria-label="Back to services"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
      >
        <ArrowLeftIcon size={16} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Reserve Parking
        </h1>
        <p className="text-label text-[var(--color-text-secondary)]">
          Parkade P1 · International
        </p>
      </div>

      <Link
        href={"/parking" as Route}
        aria-label="Open parkade location on map"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
      >
        <LocationPinIcon size={16} />
      </Link>
    </header>
  );
}

function HeroParkadeCard() {
  return (
    <HeroSurface
      as="section"
      aria-label="Parkade P1 International"
      className="relative flex flex-col gap-5 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <HeroRouteLines />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <StatusPill tone="success" surface="hero" leadingDot>
            Available
          </StatusPill>

          <div className="flex flex-col items-end gap-0.5 text-right">
            <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
              82
            </span>
            <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
              Spaces
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-eyebrow uppercase text-[var(--color-map-mint)]">
            Parkade
          </p>
          <p className="text-display text-[var(--color-surface-hero-fg)]">
            P1 · International
          </p>
          <p className="inline-flex flex-wrap items-center gap-2 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
            <span aria-hidden className="text-[var(--color-surface-hero-fg)]">
              <UmbrellaIcon size={14} />
            </span>
            <span>Covered Parking</span>
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-[var(--color-surface-hero-fg-soft)]"
            />
            <span aria-hidden className="text-[var(--color-surface-hero-fg)]">
              <FootstepsIcon size={14} />
            </span>
            <span>5 min walk</span>
          </p>
        </div>

        <JourneyStrip />
      </div>
    </HeroSurface>
  );
}

function HeroRouteLines() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 330 284"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-surface-hero-fg)] opacity-[0.06]"
    >
      <path
        d="M -20 200 L 120 80 L 240 130 L 360 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M -20 240 L 100 150 L 200 200 L 360 130"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle cx="120" cy="80" r="2.5" fill="currentColor" />
      <circle cx="240" cy="130" r="2.5" fill="currentColor" />
    </svg>
  );
}

function JourneyStrip() {
  return (
    <div
      aria-label="Walking route from Parkade P1 to International terminal"
      className="rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3 py-3"
    >
      <div className="flex items-center gap-2">
        {JOURNEY.map((stop, index) => (
          <Fragment key={stop.id}>
            <JourneyDot stop={stop} />
            {index < JOURNEY.length - 1 ? <JourneyConnector /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function JourneyDot({ stop }: { stop: JourneyStop }) {
  const tile = stop.highlighted
    ? "border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
    : "border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-chip)] text-[var(--color-surface-hero-fg)]";
  return (
    <div className="flex w-7 shrink-0 flex-col items-center gap-1">
      <span
        aria-hidden
        className={`inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-pill)] border ${tile}`}
      >
        {stop.icon}
      </span>
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        {stop.label}
      </span>
    </div>
  );
}

function JourneyConnector() {
  return (
    <span
      aria-hidden
      className="flex h-1 flex-1 items-center gap-1 px-1"
    >
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      <span className="h-px flex-1 bg-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
    </span>
  );
}

function AvailabilityLine() {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <p className="text-label text-[var(--color-text-secondary)]">
        Live availability · updated 1 min ago
      </p>
      <button
        type="button"
        aria-label="Change parkade"
        className="text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
      >
        Change
      </button>
    </div>
  );
}

function ReservationDetailsCard({
  durationId,
  onDurationChange,
}: {
  durationId: string;
  onDurationChange: (id: string) => void;
}) {
  return (
    <Card
      as="section"
      padding="none"
      surface="sheet"
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-3 px-5 pb-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Duration
          </p>
          <p className="text-label text-[var(--color-text-secondary)]">
            Days · Hourly
          </p>
        </div>
        <DurationSelector
          durationId={durationId}
          onDurationChange={onDurationChange}
        />
      </div>

      <DetailRow
        eyebrow="Entry"
        title="Today, Apr 20"
        helper="10:30 AM"
        icon={<CalendarIcon size={18} />}
        iconTone="teal"
        ariaLabel="Change entry date and time"
      />
      <DetailRow
        eyebrow="Exit"
        title="Tomorrow, Apr 21"
        helper="Anytime · by midnight"
        icon={<ClockIcon size={18} />}
        iconTone="teal"
        ariaLabel="Change exit date and time"
      />
      <DetailRow
        eyebrow="Vehicle"
        eyebrowBadge="Saved"
        title="BC · 7YKR 492"
        helper="Honda Civic · Silver"
        icon={<CarIcon size={18} />}
        iconTone="primary"
        ariaLabel="Change vehicle for this reservation"
      />
    </Card>
  );
}

function DurationSelector({
  durationId,
  onDurationChange,
}: {
  durationId: string;
  onDurationChange: (id: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Parking duration"
      className="flex items-stretch gap-1 rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] p-1"
    >
      {DURATIONS.map((option) => {
        const active = option.id === durationId;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onDurationChange(option.id)}
            className={`flex h-10 flex-1 items-center justify-center rounded-[var(--radius-tile)] text-body-sm-emphasis transition-colors duration-150 ${
              active
                ? "bg-[var(--color-surface-sheet)] text-[var(--color-text-primary)] shadow-[var(--shadow-segment)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type DetailRowProps = {
  eyebrow: string;
  eyebrowBadge?: string;
  title: string;
  helper: string;
  icon: React.ReactNode;
  iconTone: "teal" | "primary";
  ariaLabel: string;
};

function DetailRow({
  eyebrow,
  eyebrowBadge,
  title,
  helper,
  icon,
  iconTone,
  ariaLabel,
}: DetailRowProps) {
  const tileClass =
    iconTone === "primary"
      ? "bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]"
      : "bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]";
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex w-full items-center gap-4 border-t border-[var(--color-border-soft)] px-5 py-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
    >
      <IconTile size={40} className={`rounded-[var(--radius-tile)] ${tileClass}`}>
        {icon}
      </IconTile>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="inline-flex items-center gap-2">
          <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            {eyebrow}
          </span>
          {eyebrowBadge ? (
            <span className="rounded-[var(--radius-chip)] bg-[var(--color-action-teal-soft)] px-1.5 py-0.5 text-micro uppercase text-[var(--color-action-teal)]">
              {eyebrowBadge}
            </span>
          ) : null}
        </span>
        <span className="truncate text-section-title text-[var(--color-text-primary)]">
          {title}
        </span>
        <span className="truncate text-body-sm text-[var(--color-text-secondary)]">
          {helper}
        </span>
      </span>
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center text-[var(--color-text-muted)]"
      >
        <ChevronRightIcon size={16} />
      </span>
    </button>
  );
}

function SummarySheet({
  total,
  support,
}: {
  total: string;
  support: string;
}) {
  return (
    <section
      aria-label="Reservation summary"
      className="sticky bottom-0 z-10 flex flex-col gap-4 border-t border-[var(--color-border-soft)] bg-[var(--color-surface-sheet)] px-6 pt-5 shadow-[var(--shadow-sheet)] backdrop-blur-md"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Estimated total
          </p>
          <p className="inline-flex items-baseline gap-1.5 text-display tabular-nums text-[var(--color-text-primary)]">
            <span>${total}</span>
            <span className="text-label text-[var(--color-text-secondary)]">
              CAD
            </span>
          </p>
          <p className="text-label text-[var(--color-text-secondary)]">
            {support}
          </p>
        </div>
        <button
          type="button"
          aria-label="View price breakdown"
          className="text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
        >
          View breakdown
        </button>
      </div>

      <Button tone="teal" trailingIcon={<ArrowRightIcon size={16} />}>
        Reserve Parking
      </Button>
    </section>
  );
}
