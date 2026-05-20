import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LocationPinIcon,
  PlaneIcon,
} from "@/components/icons";

type ArrivingFlight = {
  date: string;
  flightCode: string;
  airline: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  landingTime: string;
};

type PickupArea = {
  primary: string;
  detail: string;
};

type JourneyStage = {
  id: string;
  title: string;
  detail?: string;
  state: "earlier" | "active";
};

const PASSENGER_FIRST_NAME = "Sarah";

const FLIGHT: ArrivingFlight = {
  date: "Sat · May 9",
  flightCode: "CX838",
  airline: "Cathay Pacific",
  origin: { code: "HKG", city: "Hong Kong" },
  destination: { code: "YVR", city: "Vancouver" },
  landingTime: "09:22",
};

const PICKUP_AREA: PickupArea = {
  primary: "Level 2 · International Arrivals",
  detail: "Curbside pickup lane",
};

const STAGES: JourneyStage[] = [
  { id: "in-flight", title: "In Flight", state: "earlier" },
  { id: "customs", title: "Customs", state: "earlier" },
  { id: "baggage", title: "Baggage · Carousel 6", state: "earlier" },
  {
    id: "exit",
    title: "Exit · Level 2 Arrivals",
    detail: "Pickup point ready",
    state: "active",
  },
];

export default function PickupReadyPage() {
  return (
    <AppShellAuthed activeHref="/home">
      <PickupReadyHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <PickupReadyHero
          flight={FLIGHT}
          area={PICKUP_AREA}
          passenger={PASSENGER_FIRST_NAME}
        />
        <ReadyJourneyCard
          passenger={PASSENGER_FIRST_NAME}
          stages={STAGES}
        />
      </div>
    </AppShellAuthed>
  );
}

function PickupReadyHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to pickup tracker"
        href={"/home/pickup-waiting" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          Pickup Ready
        </span>
        <span className="text-section-title text-[var(--color-text-primary)]">
          {PASSENGER_FIRST_NAME}&rsquo;s arrival
        </span>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}

function PickupReadyHero({
  flight,
  area,
  passenger,
}: {
  flight: ArrivingFlight;
  area: PickupArea;
  passenger: string;
}) {
  const accessibleName = `Pickup ready for ${passenger}: head to ${area.primary}. ${flight.airline} ${flight.flightCode} from ${flight.origin.city} landed at ${flight.landingTime}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        <PickupReadyIdentity passenger={passenger} area={area} />
        <PickupFlightStrip flight={flight} />
        <PassPerforation inset="-mx-5" />
        <PickupPointBlock area={area} />
        <Button
          href={"/map" as Route}
          tone="inverse"
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label="Open airport map"
        >
          Open airport map
        </Button>
      </div>
    </HeroSurface>
  );
}

function PickupReadyIdentity({
  passenger,
  area,
}: {
  passenger: string;
  area: PickupArea;
}) {
  return (
    <div className="flex flex-col gap-3">
      <StatusPill
        tone="success"
        surface="hero"
        leadingDot
        size="sm"
        className="self-start"
      >
        Ready now
      </StatusPill>
      <h1 className="text-display text-[var(--color-surface-hero-fg)] [&_em]:font-normal [&_em]:italic">
        {passenger} is <em>ready.</em>
      </h1>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        Head to {area.primary}.
      </p>
    </div>
  );
}

function PickupFlightStrip({ flight }: { flight: ArrivingFlight }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {flight.date} · {flight.flightCode}
        </span>
        <StatusPill tone="success" surface="hero" leadingDot size="sm">
          Landed
        </StatusPill>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
            {flight.origin.city}
          </span>
          <span className="text-section-title tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
            {flight.origin.code}
          </span>
        </div>
        <PickupArrivedArrow />
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
            {flight.destination.city}
          </span>
          <span className="text-section-title tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
            {flight.destination.code}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          {flight.airline} · {flight.flightCode}
        </span>
        <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-soft)]">
          Landed {flight.landingTime}
        </span>
      </div>
    </div>
  );
}

function PickupArrivedArrow() {
  return (
    <span aria-hidden className="flex items-center gap-1.5">
      <span className="block h-px w-6 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
        <PlaneIcon size={14} />
      </span>
    </span>
  );
}

function PickupPointBlock({ area }: { area: PickupArea }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3">
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <LocationPinIcon size={14} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Pickup point
        </span>
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {area.primary}
        </span>
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {area.detail}
        </span>
      </div>
    </div>
  );
}

function ReadyJourneyCard({
  passenger,
  stages,
}: {
  passenger: string;
  stages: JourneyStage[];
}) {
  const activeIndex = stages.findIndex((s) => s.state === "active");
  const stageCount = stages.length;
  const currentStage = activeIndex >= 0 ? activeIndex + 1 : stageCount;
  return (
    <section
      aria-labelledby="ready-journey-heading"
      className="flex flex-col gap-3 pt-2"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-action-teal)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
            />
            Pickup Ready
          </span>
          <h2
            id="ready-journey-heading"
            className="text-section-title text-[var(--color-text-primary)]"
          >
            {passenger}&rsquo;s journey
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2.5 py-1 text-micro uppercase tabular-nums text-[var(--color-action-teal)]">
          Stage {currentStage} of {stageCount}
        </span>
      </div>

      <Card as="article" surface="sheet">
        <ol className="flex flex-col">
          {stages.map((stage, i) => (
            <ReadyStageRow
              key={stage.id}
              stage={stage}
              isLast={i === stages.length - 1}
            />
          ))}
        </ol>
      </Card>
    </section>
  );
}

function ReadyStageRow({
  stage,
  isLast,
}: {
  stage: JourneyStage;
  isLast: boolean;
}) {
  const active = stage.state === "active";
  return (
    <li
      className="relative flex gap-4"
      aria-current={active ? "step" : undefined}
    >
      <ReadyStageSpine state={stage.state} isLast={isLast} />
      <div
        className={`flex min-w-0 flex-1 items-center justify-between gap-3 ${
          isLast ? "pb-0" : "pb-3"
        }`}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className={
              active
                ? "text-body-sm-emphasis text-[var(--color-text-primary)]"
                : "text-body-sm-emphasis text-[var(--color-text-secondary)]"
            }
          >
            {stage.title}
          </span>
          {stage.detail ? (
            <span className="text-label text-[var(--color-text-muted)]">
              {stage.detail}
            </span>
          ) : null}
        </div>
        <ReadyStageChip state={stage.state} />
      </div>
    </li>
  );
}

/**
 * Stage spine for the ready-state journey. "earlier" stages render as
 * quiet hollow rings (no completion claim) sitting on a mint-filled
 * spine that shows the path leading to the current pickup point.
 * "active" gets the soft teal halo + filled dot at the final stage.
 */
function ReadyStageSpine({
  state,
  isLast,
}: {
  state: JourneyStage["state"];
  isLast: boolean;
}) {
  const active = state === "active";
  return (
    <span
      aria-hidden
      className="relative flex w-5 shrink-0 flex-col items-center"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {active ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-action-teal)]" />
          </span>
        ) : (
          <span className="h-2.5 w-2.5 rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-surface-elevated)]" />
        )}
      </span>
      {isLast ? null : (
        <span className="mt-1 w-px flex-1 bg-[var(--color-map-mint)]" />
      )}
    </span>
  );
}

function ReadyStageChip({ state }: { state: JourneyStage["state"] }) {
  if (state !== "active") return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-primary-fg)]">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
      />
      Here
    </span>
  );
}
