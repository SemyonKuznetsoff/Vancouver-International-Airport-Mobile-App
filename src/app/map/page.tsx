"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { StatusPill } from "@/components/StatusPill";
import {
  CheckIcon,
  ClockIcon,
  LayersIcon,
  LocationPinIcon,
  NavigationIcon,
  PlaneIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type LevelId = "L1" | "L2" | "L3";

type RouteStep = {
  id: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
  state: "complete" | "current" | "upcoming";
  waitLabel?: string;
  href?: "/map/place-detail" | "/map/accessible-route";
};

const DESTINATION = "Gate D73";
const DESTINATION_META = "International · Level 2 · 8 min · 420 m";
const BOARDING_LINE = "Boarding 14:15 · plenty of time";
const REMAINING_LINE = "52 min remaining";
const BOARDING_TIME = "14:15";

const ROUTE_STEPS: RouteStep[] = [
  {
    id: "current",
    title: "Current Location",
    detail: "Level 2 · Central Hub",
    icon: <LocationPinIcon size={14} />,
    state: "complete",
  },
  {
    id: "security",
    title: "International Security",
    detail: "Checkpoint A · On your way",
    icon: <ShieldCheckIcon size={14} />,
    state: "current",
    waitLabel: "~8 min wait",
    href: "/map/place-detail",
  },
  {
    id: "gate",
    title: DESTINATION,
    detail: "International · Level 2",
    icon: <PlaneIcon size={14} />,
    state: "upcoming",
  },
];

const LEVELS: LevelId[] = ["L3", "L2", "L1"];

export default function MapHomePage() {
  const [level, setLevel] = useState<LevelId>("L2");

  return (
    <AppShellAuthed activeHref="/map">
      <h1 className="sr-only">{`Map route to ${DESTINATION}`}</h1>

      <section
        aria-label={`Indoor map preview, Vancouver International, ${level}. Route from Central Hub through International Security to ${DESTINATION}.`}
        className="relative mx-6 mt-2 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] shadow-[var(--shadow-card)]"
        style={{ height: 360 }}
      >
        <MapCanvasArt />
        <MapSearchBar />
        <MapContextChips />
        <LevelSelector value={level} onChange={setLevel} />
      </section>

      <RouteSheet level={level} />
    </AppShellAuthed>
  );
}

/* ----------------------------------------------- Search bar (floating) */

function MapSearchBar() {
  return (
    <div className="absolute inset-x-3 top-3 z-20 flex items-center gap-2">
      <Link
        href="/map/search-results"
        aria-label="Search gates, shops, and services"
        className="flex h-12 flex-1 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-4 text-body text-[var(--color-text-muted)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
      >
        <span aria-hidden className="inline-flex text-[var(--color-text-secondary)]">
          <SearchIcon size={16} />
        </span>
        <span className="truncate">Search gates, shops, services…</span>
      </Link>
      <button
        type="button"
        aria-label="Toggle map layers"
        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)] shadow-[var(--shadow-card)] transition-opacity duration-150 hover:opacity-90"
      >
        <LayersIcon size={16} />
      </button>
    </div>
  );
}

/* ----------------------------------------- Context chips (YVR / Indoor) */

function MapContextChips() {
  return (
    <div className="absolute left-3 top-[72px] z-20 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] py-1 pl-2 pr-3 shadow-[var(--shadow-card)]">
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2 py-0.5 text-micro uppercase text-[var(--color-action-teal)]">
        <span aria-hidden className="inline-flex">
          <PlaneIcon size={11} />
        </span>
        YVR
      </span>
      <span aria-hidden className="h-3 w-px bg-[var(--color-border)]" />
      <span className="text-micro uppercase text-[var(--color-text-secondary)]">
        Indoor map
      </span>
    </div>
  );
}

/* --------------------------------------------------- Level selector */

function LevelSelector({
  value,
  onChange,
}: {
  value: LevelId;
  onChange: (next: LevelId) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Map level"
      className="absolute right-3 top-[72px] z-20 flex flex-col gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] p-1 shadow-[var(--shadow-card)]"
    >
      {LEVELS.map((id) => {
        const isActive = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Level ${id.slice(1)}`}
            onClick={() => onChange(id)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] text-label transition-colors duration-150 ${
              isActive
                ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span className="font-semibold tabular-nums">{id}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------- Map canvas SVG art */

function MapCanvasArt() {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 360"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <pattern
            id="map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="var(--color-border-soft)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="360" height="360" fill="url(#map-grid)" opacity="0.6" />

        {/* Domestic concourse */}
        <rect
          x="20"
          y="160"
          width="120"
          height="120"
          rx="18"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="80"
          y="218"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          DOMESTIC
        </text>
        <text
          x="80"
          y="234"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.06em"
          fill="var(--color-text-muted)"
        >
          Gates C
        </text>

        {/* Central hub */}
        <rect
          x="148"
          y="184"
          width="76"
          height="72"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="186"
          y="216"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          CENTRAL
        </text>
        <text
          x="186"
          y="232"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.06em"
          fill="var(--color-text-muted)"
        >
          HUB
        </text>

        {/* International concourse */}
        <rect
          x="232"
          y="120"
          width="124"
          height="160"
          rx="18"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="294"
          y="156"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          INTERNATIONAL
        </text>
        <text
          x="294"
          y="172"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.06em"
          fill="var(--color-text-muted)"
        >
          Gates D
        </text>

        {/* Curved route line — soft glow under-stroke */}
        <path
          d="M 64 296 C 130 296 156 256 186 222 C 220 184 248 168 286 156"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="8"
          opacity="0.14"
          strokeLinecap="round"
        />
        {/* Curved route line — crisp dashed */}
        <path
          d="M 64 296 C 130 296 156 256 186 222 C 220 184 248 168 286 156"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2.25"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />

        {/* Security A intermediate marker */}
        <circle
          cx="208"
          cy="208"
          r="5"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
        />

        {/* Destination halo + dot */}
        <circle
          cx="286"
          cy="156"
          r="22"
          fill="var(--color-action-teal)"
          opacity="0.10"
        />
        <circle cx="286" cy="156" r="6" fill="var(--color-action-teal)" />

        {/* Gate label by destination */}
        <text
          x="286"
          y="118"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-action-teal)"
        >
          GATE D73
        </text>
      </svg>

      {/* Security A floating chip */}
      <span className="pointer-events-none absolute left-[58%] top-[58%] -translate-x-1/2 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-2 py-0.5 text-micro uppercase text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
        <ShieldCheckIcon size={11} aria-hidden />
        Security A
      </span>

      {/* Current-location marker — bottom-left, on the Central Hub edge */}
      <span
        className="pointer-events-none absolute inline-flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-action-teal)] ring-4 ring-[var(--color-action-teal-soft)]"
        style={{ left: "18%", top: "82%" }}
      />
    </span>
  );
}

/* ----------------------------------------------------- Bottom sheet */

function RouteSheet({ level }: { level: LevelId }) {
  return (
    <section
      aria-label={`Active route summary, heading to ${DESTINATION}, ${level}.`}
      className="mt-4 flex flex-1 flex-col gap-4 rounded-t-[var(--radius-card)] border-t border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-6 pt-3 pb-4 shadow-[var(--shadow-sheet)]"
    >
      <SheetGrabber />
      <SheetHeader />
      <OnTrackCard />
      <RouteStepList />
    </section>
  );
}

function SheetGrabber() {
  return (
    <span
      aria-hidden
      className="mx-auto inline-block h-1 w-10 rounded-[var(--radius-pill)] bg-[var(--color-border)]"
    />
  );
}

function SheetHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow tone="secondary">Heading to</Eyebrow>
        <StatusPill tone="success" size="sm" leadingDot>
          Live
        </StatusPill>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <Heading as="h2" size="title">
          {DESTINATION}
        </Heading>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          {DESTINATION_META}
        </p>
      </div>
      <Button
        href="/map/accessible-route"
        variant="primary"
        tone="teal"
        leadingIcon={<NavigationIcon size={16} />}
        aria-label={`Resume navigation to ${DESTINATION}`}
      >
        Resume navigation
      </Button>
    </div>
  );
}

/* ------------------------------------------------------- On-track card */

function OnTrackCard() {
  return (
    <Card
      as="section"
      padding="compact"
      aria-label={`On track — ${REMAINING_LINE}, ${BOARDING_LINE}.`}
      className="flex items-center gap-3 border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)]"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-sheet)] text-[var(--color-action-teal)]"
      >
        <CheckIcon size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            On Track
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {REMAINING_LINE}
          </span>
        </div>
        <p className="text-label text-[var(--color-text-secondary)]">
          {BOARDING_LINE}
        </p>
      </div>
      <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
        {BOARDING_TIME}
      </span>
    </Card>
  );
}

/* --------------------------------------------------- Route step list */

function RouteStepList() {
  return (
    <Card as="section" padding="none" aria-label="Route steps">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          Your route
        </span>
        <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-text-secondary)]">
          <span>{ROUTE_STEPS.length} steps</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={12} aria-hidden />
            8 min
          </span>
        </span>
      </div>
      <ol className="flex flex-col">
        {ROUTE_STEPS.map((step, index) => (
          <RouteStepRow
            key={step.id}
            step={step}
            isLast={index === ROUTE_STEPS.length - 1}
          />
        ))}
      </ol>
    </Card>
  );
}

function RouteStepRow({
  step,
  isLast,
}: {
  step: RouteStep;
  isLast: boolean;
}) {
  const dotClass =
    step.state === "complete"
      ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] border-[var(--color-action-teal)]"
      : step.state === "current"
        ? "bg-[var(--color-surface-sheet)] text-[var(--color-action-teal)] border-[var(--color-action-teal)]"
        : "bg-[var(--color-surface-sheet)] text-[var(--color-text-muted)] border-[var(--color-border)]";

  const labelClass =
    step.state === "upcoming"
      ? "text-[var(--color-text-secondary)]"
      : "text-[var(--color-text-primary)]";

  const content = (
    <div className="flex w-full items-start gap-3 px-5 py-3">
      <span className="relative flex flex-col items-center">
        <span
          aria-hidden
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${dotClass}`}
        >
          {step.state === "complete" ? <CheckIcon size={12} /> : step.icon}
        </span>
        {!isLast ? (
          <span
            aria-hidden
            className="absolute top-7 h-6 w-px bg-[var(--color-border)]"
          />
        ) : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
        <span className={`text-body-sm-emphasis ${labelClass}`}>
          {step.title}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {step.detail}
        </span>
      </div>
      {step.waitLabel ? (
        <StatusPill tone="warning" size="sm">
          {step.waitLabel}
        </StatusPill>
      ) : null}
    </div>
  );

  return (
    <li aria-current={step.state === "current" ? "step" : undefined}>
      {step.href ? (
        <Link
          href={step.href}
          aria-label={`${step.title} — ${step.detail}${step.waitLabel ? `, ${step.waitLabel}` : ""}`}
          className="block transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
