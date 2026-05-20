import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LocationPinIcon,
  LuggageIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SignpostIcon,
} from "@/components/icons";

type ApproachSnapshot = {
  airline: string;
  flightCode: string;
  date: string;
  origin: { code: string; city: string; departedAt: string };
  destination: { code: string; city: string; arrivesAt: string };
  gate: string;
  facility: string;
  minutesToTouchdown: number;
  /** Static 0–100 value driving the route-progress dot position. Not live. */
  progressPercent: number;
};

type UpcomingStage = {
  id: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
};

const APPROACH: ApproachSnapshot = {
  airline: "Cathay Pacific",
  flightCode: "CX838",
  date: "Sat · May 9",
  origin: { code: "HKG", city: "Hong Kong", departedAt: "23:55" },
  destination: { code: "YVR", city: "Vancouver", arrivesAt: "10:03" },
  gate: "E75",
  facility: "Intl Arrivals",
  minutesToTouchdown: 42,
  progressPercent: 88,
};

const UPCOMING_STAGES: UpcomingStage[] = [
  {
    id: "landed",
    title: "Landed",
    detail: `Gate ${APPROACH.gate}`,
    icon: <PlaneIcon size={14} />,
  },
  {
    id: "customs",
    title: "Customs",
    detail: "Level 2 · International Terminal",
    icon: <ShieldCheckIcon size={14} />,
  },
  {
    id: "baggage",
    title: "Baggage",
    detail: "Carousel · assigned on arrival",
    icon: <LuggageIcon size={14} />,
  },
  {
    id: "exit",
    title: "Exit",
    detail: "Curbside · Ground transport",
    icon: <SignpostIcon size={14} />,
  },
];

export default function ArrivingApproachPage() {
  return (
    <AppShellAuthed activeHref="/home">
      <ArrivingHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pb-12">
        <WelcomeIntro />
        <ApproachPass approach={APPROACH} />
        <PrepareCard />
        <AfterYouLandCard stages={UPCOMING_STAGES} />
      </div>
    </AppShellAuthed>
  );
}

function ArrivingHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton aria-label="Back to home" href={"/home" as Route}>
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          Arriving
        </span>
        <span className="text-section-title text-[var(--color-text-primary)]">
          Approach
        </span>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}

function WelcomeIntro() {
  return (
    <section
      aria-label="Welcome back to Vancouver"
      className="flex flex-col gap-3 pt-1"
    >
      <Heading as="h1" size="title">
        Welcome back to <em>Vancouver.</em>
      </Heading>
      <p className="text-body text-[var(--color-text-secondary)]">
        A calm path from gate to curbside.
      </p>
    </section>
  );
}

function ApproachPass({ approach }: { approach: ApproachSnapshot }) {
  const accessibleName = `Approach pass — ${approach.airline} ${approach.flightCode} from ${approach.origin.city} arrives at ${approach.destination.city} at ${approach.destination.arrivesAt}, ${approach.minutesToTouchdown} minutes to touchdown, gate ${approach.gate}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <StatusPill tone="success" surface="hero" leadingDot size="sm">
            Arriving
          </StatusPill>
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {approach.destination.code} · INTL
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
              {approach.date} · {approach.airline}
            </span>
            <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
              {approach.flightCode}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
              Landing
            </span>
            <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
              {approach.destination.arrivesAt}
            </span>
          </div>
        </div>

        <ApproachPassRoute
          origin={approach.origin}
          destination={approach.destination}
          progressPercent={approach.progressPercent}
        />

        <ApproachCountdown minutes={approach.minutesToTouchdown} />

        <ApproachLegStrip origin={approach.origin} destination={approach.destination} />

        <ApproachGateNote gate={approach.gate} facility={approach.facility} />

        <PassPerforation inset="-mx-5" />

        <ApproachPassFooter
          airline={approach.airline}
          flightCode={approach.flightCode}
          facility={approach.facility}
        />
      </div>
    </HeroSurface>
  );
}

function ApproachPassRoute({
  origin,
  destination,
  progressPercent,
}: {
  origin: ApproachSnapshot["origin"];
  destination: ApproachSnapshot["destination"];
  progressPercent: number;
}) {
  const safe = Math.max(0, Math.min(100, progressPercent));
  const beforeFlex = safe;
  const afterFlex = 100 - safe;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <span aria-hidden className="relative flex w-full items-center">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
          <span
            className="h-px border-t border-dashed border-[var(--color-surface-hero-tile-border)]"
            style={{ flexGrow: beforeFlex }}
          />
          <span className="inline-flex shrink-0 text-[var(--color-map-mint)]">
            <PlaneIcon size={14} />
          </span>
          <span
            className="h-px border-t border-dashed border-[var(--color-surface-hero-tile-border)]"
            style={{ flexGrow: afterFlex }}
          />
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {destination.code}
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {origin.city}
        </span>
        <span aria-hidden />
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {destination.city}
        </span>
      </div>
    </div>
  );
}

function ApproachCountdown({ minutes }: { minutes: number }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3"
      aria-label={`${minutes} minutes to touchdown`}
    >
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        Until landing
      </span>
      <span className="inline-flex items-baseline gap-2">
        <span className="text-display tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
          {minutes}
        </span>
        <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          minutes to touchdown
        </span>
      </span>
    </div>
  );
}

function ApproachLegStrip({
  origin,
  destination,
}: {
  origin: ApproachSnapshot["origin"];
  destination: ApproachSnapshot["destination"];
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        Departed {origin.departedAt} {origin.code}
      </span>
      <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        Arrives {destination.arrivesAt} {destination.code}
      </span>
    </div>
  );
}

function ApproachGateNote({
  gate,
  facility,
}: {
  gate: string;
  facility: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3">
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <LocationPinIcon size={14} />
      </span>
      <p className="min-w-0 flex-1 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        <span className="text-[var(--color-surface-hero-fg)]">
          Gate {gate} · {facility}.
        </span>{" "}
        We&rsquo;ll prepare your exit path as you land.
      </p>
    </div>
  );
}

function ApproachPassFooter({
  airline,
  flightCode,
  facility,
}: {
  airline: string;
  flightCode: string;
  facility: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
        >
          <PlaneIcon size={12} />
        </span>
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          {airline} · {flightCode} · {facility}
        </span>
      </div>
      <ApproachPassBarcodeMarks />
    </div>
  );
}

function ApproachPassBarcodeMarks() {
  const widths = [10, 16, 8, 14, 12, 18, 10];
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-end gap-[3px]"
      style={{ height: 18 }}
    >
      {widths.map((h, i) => (
        <span
          key={i}
          className="inline-block w-0.5 rounded-full bg-[var(--color-surface-hero-fg-soft)]"
          style={{ height: h }}
        />
      ))}
    </span>
  );
}

function PrepareCard() {
  return (
    <Card as="section" aria-labelledby="prepare-heading">
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Eyebrow tone="secondary">Get ready</Eyebrow>
          <h2
            id="prepare-heading"
            className="text-section-title text-[var(--color-text-primary)]"
          >
            Prepare for arrival
          </h2>
        </div>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Review what to expect at the gate, customs, and baggage so you can
          step off the plane and keep moving.
        </p>
        <Button
          href={"/services/arrival-assistant" as Route}
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label="Open arrival assistant"
        >
          Prepare for arrival
        </Button>
      </div>
    </Card>
  );
}

function AfterYouLandCard({ stages }: { stages: UpcomingStage[] }) {
  return (
    <section
      aria-labelledby="after-you-land-heading"
      className="flex flex-col gap-3"
    >
      <Eyebrow tone="primary">
        <span id="after-you-land-heading">After you land</span>
      </Eyebrow>

      <Card as="article" surface="sheet">
        <ol className="flex flex-col">
          {stages.map((stage, i) => (
            <UpcomingStageRow
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

function UpcomingStageRow({
  stage,
  isLast,
}: {
  stage: UpcomingStage;
  isLast: boolean;
}) {
  return (
    <li className="relative flex gap-4">
      <UpcomingStageSpine icon={stage.icon} isLast={isLast} />
      <div
        className={`flex min-w-0 flex-1 flex-col gap-0.5 ${
          isLast ? "pb-0" : "pb-4"
        }`}
      >
        <span className="text-body-sm-emphasis text-[var(--color-text-secondary)]">
          {stage.title}
        </span>
        <span className="text-label text-[var(--color-text-muted)]">
          {stage.detail}
        </span>
      </div>
    </li>
  );
}

function UpcomingStageSpine({
  icon,
  isLast,
}: {
  icon: React.ReactNode;
  isLast: boolean;
}) {
  return (
    <span
      aria-hidden
      className="relative flex w-8 shrink-0 flex-col items-center"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
        {icon}
      </span>
      {isLast ? null : (
        <span className="mt-1 w-px flex-1 bg-[var(--color-border)]" />
      )}
    </span>
  );
}
