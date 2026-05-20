import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LuggageIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SignpostIcon,
} from "@/components/icons";

type ArrivalSnapshot = {
  airline: string;
  flightCode: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  landedAt: string;
  gate: string;
  carousel: number;
};

type ExitStage = {
  id: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
  state: "done" | "active" | "upcoming";
};

const ARRIVAL: ArrivalSnapshot = {
  airline: "Cathay Pacific",
  flightCode: "CX838",
  origin: { code: "HKG", city: "Hong Kong" },
  destination: { code: "YVR", city: "Vancouver" },
  landedAt: "09:22",
  gate: "E75",
  carousel: 6,
};

const EXIT_STAGES: ExitStage[] = [
  {
    id: "landed",
    title: "Landed",
    detail: `Gate ${ARRIVAL.gate} · ${ARRIVAL.landedAt}`,
    icon: <PlaneIcon size={14} />,
    state: "done",
  },
  {
    id: "customs",
    title: "Customs",
    detail: "Level 2 · International Terminal",
    icon: <ShieldCheckIcon size={14} />,
    state: "active",
  },
  {
    id: "baggage",
    title: "Baggage",
    detail: `Carousel ${ARRIVAL.carousel}`,
    icon: <LuggageIcon size={14} />,
    state: "upcoming",
  },
  {
    id: "exit",
    title: "Exit",
    detail: "Curbside · Ground transport",
    icon: <SignpostIcon size={14} />,
    state: "upcoming",
  },
];

export default function ArrivingLandedPage() {
  return (
    <AppShellAuthed activeHref="/home">
      <ArrivingHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pb-8">
        <WelcomeIntro />
        <ArrivalPass arrival={ARRIVAL} />
        <NextStepCard arrival={ARRIVAL} />
        <ExitPathCard stages={EXIT_STAGES} />
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
          Concierge
        </span>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}

function WelcomeIntro() {
  return (
    <section aria-label="Welcome to Vancouver" className="flex flex-col gap-3 pt-1">
      <Heading as="h1" size="title">
        Welcome to <em>Vancouver.</em>
      </Heading>
      <p className="text-body text-[var(--color-text-secondary)]">
        We&rsquo;ll guide you from gate to curbside.
      </p>
    </section>
  );
}

function ArrivalPass({ arrival }: { arrival: ArrivalSnapshot }) {
  const accessibleName = `Arrival pass — ${arrival.airline} ${arrival.flightCode} from ${arrival.origin.city} landed at ${arrival.landedAt}, gate ${arrival.gate}, carousel ${arrival.carousel}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="calm" />
      <div className="relative flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <StatusPill tone="success" surface="hero" leadingDot size="sm">
            Landed
          </StatusPill>
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {arrival.destination.code} · INTL
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
              {arrival.airline}
            </span>
            <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
              {arrival.flightCode}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
              Landed
            </span>
            <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
              {arrival.landedAt}
            </span>
          </div>
        </div>

        <ArrivalPassRoute origin={arrival.origin} destination={arrival.destination} />

        <div className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
          <PassInfoCell label="Gate" value={arrival.gate} />
          <PassInfoCell label="Carousel" value={String(arrival.carousel)} divider />
        </div>

        <PassPerforation inset="-mx-5" />

        <ArrivalPassFooter
          airline={arrival.airline}
          flightCode={arrival.flightCode}
        />
      </div>
    </HeroSurface>
  );
}

function ArrivalPassFooter({
  airline,
  flightCode,
}: {
  airline: string;
  flightCode: string;
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
          {airline} · {flightCode} · Intl Arrivals
        </span>
      </div>
      <ArrivalPassBarcodeMarks />
    </div>
  );
}

function ArrivalPassBarcodeMarks() {
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

function ArrivalPassRoute({
  origin,
  destination,
}: {
  origin: ArrivalSnapshot["origin"];
  destination: ArrivalSnapshot["destination"];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <span aria-hidden className="relative flex w-full items-center">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
          <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
          <span className="inline-flex shrink-0 text-[var(--color-map-mint)]">
            <PlaneIcon size={12} />
          </span>
          <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
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

function PassInfoCell({
  label,
  value,
  divider = false,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-3 ${
        divider ? "border-l border-[var(--color-surface-hero-tile-border)]" : ""
      }`}
    >
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        {label}
      </span>
      <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
        {value}
      </span>
    </div>
  );
}

function NextStepCard({ arrival }: { arrival: ArrivalSnapshot }) {
  return (
    <Card as="section" aria-labelledby="next-step-heading">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <IconTile
            size={44}
            className="rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
          >
            <ShieldCheckIcon size={20} />
          </IconTile>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Eyebrow tone="secondary">Your next step</Eyebrow>
            <h2
              id="next-step-heading"
              className="text-section-title text-[var(--color-text-primary)]"
            >
              Proceed to CBSA Customs
            </h2>
          </div>
        </div>

        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Level 2 · International Terminal. Follow CBSA / Customs signage from
          Gate {arrival.gate}.
        </p>

        <Button
          href={"/map" as Route}
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label="Open airport map"
        >
          Open airport map
        </Button>
      </div>
    </Card>
  );
}

function ExitPathCard({ stages }: { stages: ExitStage[] }) {
  return (
    <section
      aria-labelledby="exit-path-heading"
      className="flex flex-col gap-3"
    >
      <Eyebrow tone="primary">
        <span id="exit-path-heading">Your exit path</span>
      </Eyebrow>

      <Card as="article" surface="sheet">
        <ol className="flex flex-col">
          {stages.map((stage, i) => (
            <ExitStageRow
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

function ExitStageRow({
  stage,
  isLast,
}: {
  stage: ExitStage;
  isLast: boolean;
}) {
  const active = stage.state === "active";
  return (
    <li
      className="relative flex gap-4"
      aria-current={active ? "step" : undefined}
    >
      <ExitStageSpine state={stage.state} icon={stage.icon} isLast={isLast} />
      <div
        className={`flex min-w-0 flex-1 items-center justify-between gap-3 ${
          isLast ? "pb-0" : "pb-4"
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
          <span className="text-label text-[var(--color-text-muted)]">
            {stage.detail}
          </span>
        </div>
        <ExitStageChip state={stage.state} />
      </div>
    </li>
  );
}

function ExitStageSpine({
  state,
  icon,
  isLast,
}: {
  state: ExitStage["state"];
  icon: React.ReactNode;
  isLast: boolean;
}) {
  const done = state === "done";
  const active = state === "active";
  return (
    <span
      aria-hidden
      className="relative flex w-8 shrink-0 flex-col items-center"
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
            : done
              ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-fg)]"
              : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]",
        ].join(" ")}
      >
        {icon}
      </span>
      {isLast ? null : (
        <span
          className={[
            "mt-1 w-px flex-1",
            done || active
              ? "bg-[var(--color-action-teal)]"
              : "bg-[var(--color-border)]",
          ].join(" ")}
        />
      )}
    </span>
  );
}

function ExitStageChip({ state }: { state: ExitStage["state"] }) {
  if (state === "active") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-primary-fg)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        Now
      </span>
    );
  }
  if (state === "done") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2.5 py-1 text-micro uppercase text-[var(--color-success-fg)]">
        <CheckIcon size={10} />
        Done
      </span>
    );
  }
  return null;
}
