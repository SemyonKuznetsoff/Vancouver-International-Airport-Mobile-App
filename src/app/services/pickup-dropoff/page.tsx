"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { IconTile } from "@/components/IconTile";
import { StatusPill } from "@/components/StatusPill";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  LocationPinIcon,
  MapIcon,
  SignpostIcon,
} from "@/components/icons";

type Mode = "pickup" | "dropoff";
type Terminal = "international" | "domestic";
type ZoneId = "A" | "B" | "C";

type Recommendation = {
  zone: ZoneId;
  eyebrow: string;
  title: string;
  level: string;
  description: string;
  features: string[];
  ariaSummary: string;
};

const ZONES: ZoneId[] = ["A", "B", "C"];

const RECOMMENDATIONS: Record<Mode, Record<Terminal, Recommendation>> = {
  pickup: {
    international: {
      zone: "A",
      eyebrow: "International Arrivals",
      title: "Zone A",
      level: "Level 2 · Curbside",
      description:
        "Suggested for rideshare, taxi, and private pickups from International Arrivals. Covered waiting area nearby.",
      features: ["Rideshare", "Taxi", "Private pickup", "Covered waiting"],
      ariaSummary:
        "Recommended zone A on Level 2 curbside for International Arrivals pickup.",
    },
    domestic: {
      zone: "B",
      eyebrow: "Domestic Arrivals",
      title: "Zone B",
      level: "Level 2 · Curbside",
      description:
        "Suggested for rideshare, taxi, and private pickups from Domestic Arrivals. Close to the Domestic Arrivals exits.",
      features: ["Rideshare", "Taxi", "Private pickup"],
      ariaSummary:
        "Recommended zone B on Level 2 curbside for Domestic Arrivals pickup.",
    },
  },
  dropoff: {
    international: {
      zone: "A",
      eyebrow: "International Departures",
      title: "Zone A",
      level: "Departures Level · Curbside",
      description:
        "Quick unload at International Departures. Follow Departures signs for your airline.",
      features: ["Quick unload", "Curbside lane"],
      ariaSummary:
        "Recommended drop-off at International Departures, zone A curbside.",
    },
    domestic: {
      zone: "B",
      eyebrow: "Domestic Departures",
      title: "Zone B",
      level: "Departures Level · Curbside",
      description:
        "Quick unload at Domestic Departures. Follow Departures signs for your airline.",
      features: ["Quick unload", "Curbside lane"],
      ariaSummary:
        "Recommended drop-off at Domestic Departures, zone B curbside.",
    },
  },
};

const TERMINAL_LABEL: Record<Terminal, { eyebrow: string; helper: string }> = {
  international: { eyebrow: "Terminal", helper: "International" },
  domestic: { eyebrow: "Terminal", helper: "Domestic" },
};

const PRACTICAL_TIPS: { id: string; icon: React.ReactNode; title: string; description: string }[] = [
  {
    id: "before-you-go",
    icon: <InfoIcon size={14} />,
    title: "Before you go",
    description: "Confirm the terminal and arrival type with your traveller.",
  },
  {
    id: "share-zone",
    icon: <SignpostIcon size={14} />,
    title: "Share the zone",
    description: "Send them the zone letter before they exit the terminal.",
  },
  {
    id: "accessibility",
    icon: <AccessibilityIcon size={14} />,
    title: "Accessibility",
    description: "Marked accessible pickup areas are available curbside.",
  },
];

export default function PickupDropoffPage() {
  const [mode, setMode] = useState<Mode>("pickup");
  const [terminal, setTerminal] = useState<Terminal>("international");

  const recommendation = useMemo(
    () => RECOMMENDATIONS[mode][terminal],
    [mode, terminal],
  );

  return (
    <AppShellAuthed activeHref="/services">
      <PickupDropoffHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pb-8">
        <Intro />
        <ModeSegmented mode={mode} onChange={setMode} />
        <TerminalSegmented terminal={terminal} onChange={setTerminal} />
        <ZoneDiagram terminal={terminal} activeZone={recommendation.zone} />
        <RecommendationCard mode={mode} recommendation={recommendation} />
        <PracticalTipsCard />
      </div>
    </AppShellAuthed>
  );
}

function PickupDropoffHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to services"
        href={"/services" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Pickup &amp; Drop-off
        </h1>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}

function Intro() {
  return (
    <section className="flex flex-col gap-2 pt-1">
      <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
        YVR · Curbside
      </span>
      <h2 className="text-title text-[var(--color-text-primary)]">
        Where are you meeting them?
      </h2>
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        Choose a terminal and we&rsquo;ll point you to the clearest curbside zone.
      </p>
    </section>
  );
}

function ModeSegmented({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (next: Mode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Trip type"
      className="grid grid-cols-2 gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1"
    >
      <SegmentButton
        selected={mode === "pickup"}
        onClick={() => onChange("pickup")}
        aria-label="Pickup"
      >
        Pickup
      </SegmentButton>
      <SegmentButton
        selected={mode === "dropoff"}
        onClick={() => onChange("dropoff")}
        aria-label="Drop-off"
      >
        Drop-off
      </SegmentButton>
    </div>
  );
}

function TerminalSegmented({
  terminal,
  onChange,
}: {
  terminal: Terminal;
  onChange: (next: Terminal) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Terminal"
      className="grid grid-cols-2 gap-2"
    >
      <TerminalCard
        selected={terminal === "international"}
        onClick={() => onChange("international")}
        eyebrow={TERMINAL_LABEL.international.eyebrow}
        label={TERMINAL_LABEL.international.helper}
      />
      <TerminalCard
        selected={terminal === "domestic"}
        onClick={() => onChange("domestic")}
        eyebrow={TERMINAL_LABEL.domestic.eyebrow}
        label={TERMINAL_LABEL.domestic.helper}
      />
    </div>
  );
}

function SegmentButton({
  selected,
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] text-body-sm font-medium transition-colors duration-150 ${
        selected
          ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      }`}
    >
      {selected ? (
        <span aria-hidden className="inline-flex shrink-0">
          <CheckIcon size={13} />
        </span>
      ) : null}
      {children}
    </button>
  );
}

function TerminalCard({
  selected,
  onClick,
  eyebrow,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  eyebrow: string;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${eyebrow} ${label}`}
      onClick={onClick}
      className={`flex min-h-[64px] flex-col items-start gap-1 rounded-[var(--radius-tile)] border px-4 py-3 text-left transition-colors duration-150 ${
        selected
          ? "border-[var(--color-action-teal)] bg-[var(--color-action-teal-soft)] text-[var(--color-text-primary)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated-hover)]"
      }`}
    >
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-text-muted)]">
        {selected ? (
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-action-teal)]"
          />
        ) : null}
        {eyebrow}
      </span>
      <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
        {label}
      </span>
    </button>
  );
}

function ZoneDiagram({
  terminal,
  activeZone,
}: {
  terminal: Terminal;
  activeZone: ZoneId;
}) {
  const terminalLabel =
    terminal === "international" ? "International" : "Domestic";
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label={`Curbside layout for ${terminalLabel} terminal. Zone ${activeZone} is recommended.`}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-text-muted)]">
          <MapIcon size={11} aria-hidden />
          Curbside layout
        </span>
        <StatusPill tone="info" size="sm">
          YVR guide
        </StatusPill>
      </div>

      <div
        aria-hidden
        className="relative grid grid-cols-3 items-end gap-3"
      >
        <div className="col-span-3 flex items-center justify-between rounded-[var(--radius-tile)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] px-4 py-3">
          <span className="inline-flex items-center gap-2 text-body-sm-emphasis text-[var(--color-text-primary)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]">
              <LocationPinIcon size={12} />
            </span>
            Terminal · {terminalLabel}
          </span>
          <span className="text-micro uppercase text-[var(--color-text-muted)]">
            Curbside
          </span>
        </div>

        {ZONES.map((zone) => (
          <ZoneConnector key={`connector-${zone}`} active={zone === activeZone} />
        ))}

        {ZONES.map((zone) => (
          <ZoneChip
            key={zone}
            zone={zone}
            active={zone === activeZone}
          />
        ))}
      </div>

      <p className="text-label text-[var(--color-text-muted)]">
        Static guide based on YVR signage. No live curbside traffic.
      </p>
    </Card>
  );
}

function ZoneConnector({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex flex-col items-center">
      <span
        className={`h-4 w-px ${
          active
            ? "bg-[var(--color-action-teal)]"
            : "border-l border-dashed border-[var(--color-border)]"
        }`}
      />
    </span>
  );
}

function ZoneChip({ zone, active }: { zone: ZoneId; active: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex flex-col items-center gap-1 rounded-[var(--radius-tile)] border px-3 py-2 ${
        active
          ? "border-[var(--color-action-teal)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]"
      }`}
    >
      <span className="text-section-title leading-none tabular-nums">
        {zone}
      </span>
      <span
        className={`text-micro uppercase ${
          active
            ? "text-[var(--color-action-primary-fg)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        Zone
      </span>
    </span>
  );
}

function RecommendationCard({
  mode,
  recommendation,
}: {
  mode: Mode;
  recommendation: Recommendation;
}) {
  const modeLabel = mode === "pickup" ? "Pickup" : "Drop-off";
  return (
    <Card
      as="article"
      surface="sheet"
      padding="default"
      aria-label={recommendation.ariaSummary}
      aria-live="polite"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 text-micro uppercase text-[var(--color-action-primary-fg)]">
          <CheckIcon size={11} aria-hidden />
          Recommended
        </span>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 text-micro uppercase text-[var(--color-text-secondary)]">
          <ClockIcon size={11} aria-hidden />
          {modeLabel} · {recommendation.eyebrow}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <IconTile
          size={44}
          className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
        >
          <CarIcon size={20} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-title text-[var(--color-text-primary)]">
            {recommendation.title}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-body-sm text-[var(--color-text-secondary)]">
            <LocationPinIcon size={12} aria-hidden />
            {recommendation.level}
          </span>
        </div>
      </div>

      <p className="text-body-sm text-[var(--color-text-secondary)]">
        {recommendation.description}
      </p>

      <ul
        aria-label="Zone features"
        className="flex flex-wrap gap-1.5"
      >
        {recommendation.features.map((feature) => (
          <li key={feature}>
            <span className="inline-flex h-7 items-center rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] px-2.5 text-micro uppercase text-[var(--color-text-secondary)]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        tone="teal"
        href={"/map" as Route}
        trailingIcon={<ArrowRightIcon size={16} />}
        aria-label={`Open airport map to find ${recommendation.title}`}
      >
        Open airport map
      </Button>
    </Card>
  );
}

function PracticalTipsCard() {
  return (
    <section
      aria-labelledby="pickup-dropoff-tips"
      className="flex flex-col gap-3 pt-1"
    >
      <h3
        id="pickup-dropoff-tips"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Helpful to know
      </h3>
      <Card
        as="div"
        surface="sheet"
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        {PRACTICAL_TIPS.map((tip) => (
          <div
            key={tip.id}
            className="flex items-start gap-3 px-4 py-3.5"
          >
            <IconTile
              size={32}
              className="rounded-[var(--radius-chip)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
            >
              {tip.icon}
            </IconTile>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
                {tip.title}
              </span>
              <span className="text-label text-[var(--color-text-secondary)]">
                {tip.description}
              </span>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
