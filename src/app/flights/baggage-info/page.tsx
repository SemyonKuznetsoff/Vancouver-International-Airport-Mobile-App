import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  CheckIcon,
  LocationPinIcon,
  LuggageIcon,
  NavigationIcon,
  SyncIcon,
} from "@/components/icons";

type StepStatus = "complete" | "current" | "upcoming";

type Step = {
  id: string;
  label: string;
  status: StepStatus;
};

type Baggage = {
  flightNumber: string;
  origin: string;
  carousel: number;
  statusLabel: string;
  progressLabel: string;
  firstBagEstimate: string;
  location: string;
  guidance: string;
  reference: string;
};

const BAGGAGE: Baggage = {
  flightNumber: "CX838",
  origin: "Hong Kong",
  carousel: 6,
  statusLabel: "Updated now",
  progressLabel: "In progress",
  firstBagEstimate: "~12 min",
  location: "International Arrivals Hall · Level 2",
  guidance: "Follow the green baggage signs from the gate.",
  reference: "Tag 0420-CX838",
};

const BAGGAGE_PROGRESS: Step[] = [
  { id: "landed", label: "Landed", status: "complete" },
  { id: "unloading", label: "Unloading", status: "current" },
  { id: "belt", label: "Belt", status: "upcoming" },
];

const ARRIVAL_JOURNEY: Step[] = [
  { id: "landed", label: "Landed", status: "complete" },
  { id: "baggage", label: "Baggage", status: "current" },
  { id: "carousel", label: "Carousel 6", status: "upcoming" },
  { id: "inspection", label: "Inspection", status: "upcoming" },
  { id: "transport", label: "Transport", status: "upcoming" },
];

export default function BaggageInfoPage() {
  const currentIndex =
    ARRIVAL_JOURNEY.findIndex((s) => s.status === "current") + 1;
  return (
    <AppShellAuthed activeHref="/flights">
      <BaggageHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <BaggagePass baggage={BAGGAGE} progress={BAGGAGE_PROGRESS} />
        <ArrivalJourneyCard
          steps={ARRIVAL_JOURNEY}
          currentStep={currentIndex}
        />
        <BaggageTipCard />
      </div>
    </AppShellAuthed>
  );
}

function BaggageHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to My Flights"
        href={"/flights" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          Arrival
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Baggage Info
        </h1>
      </div>

      <HeaderIconButton aria-label="Refresh baggage status">
        <SyncIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function BaggagePass({
  baggage,
  progress,
}: {
  baggage: Baggage;
  progress: Step[];
}) {
  const accessibleName = `Live baggage status for ${baggage.flightNumber} from ${baggage.origin}: Carousel ${baggage.carousel}, ${baggage.progressLabel}, first bag in ${baggage.firstBagEstimate}, at ${baggage.location}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="delay" />
      <div className="relative flex flex-col gap-5 p-5">
        {/* Pass header strip — live status + updated indicator */}
        <BaggagePassHeader
          reference={baggage.reference}
          statusLabel={baggage.statusLabel}
        />

        {/* Flight identity row */}
        <FlightIdentity
          flightNumber={baggage.flightNumber}
          origin={baggage.origin}
        />

        {/* Carousel value zone — eyebrow + huge value + progress pill */}
        <CarouselZone
          carousel={baggage.carousel}
          progressLabel={baggage.progressLabel}
          firstBagEstimate={baggage.firstBagEstimate}
        />

        {/* Progress tracker — 3-stop horizontal stepper on hero surface */}
        <BaggageProgressTracker steps={progress} />

        <PassPerforation inset="-mx-5" />

        {/* Location panel — destination hall + guidance */}
        <LocationPanel
          location={baggage.location}
          guidance={baggage.guidance}
        />

        {/* CTA — Navigate to Carousel */}
        <Button
          tone="inverse"
          leadingIcon={<NavigationIcon size={16} />}
          aria-label={`Navigate to Carousel ${baggage.carousel}`}
        >
          Navigate to Carousel {baggage.carousel}
        </Button>
      </div>
    </HeroSurface>
  );
}

function BaggagePassHeader({
  reference,
  statusLabel,
}: {
  reference: string;
  statusLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        Live baggage status
      </span>
      <span
        className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]"
        aria-live="polite"
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        {statusLabel}
        <span className="sr-only">— Reference {reference}</span>
      </span>
    </div>
  );
}

function FlightIdentity({
  flightNumber,
  origin,
}: {
  flightNumber: string;
  origin: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-7 items-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg)]">
        {flightNumber}
      </span>
      <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {origin}
      </span>
    </div>
  );
}

function CarouselZone({
  carousel,
  progressLabel,
  firstBagEstimate,
}: {
  carousel: number;
  progressLabel: string;
  firstBagEstimate: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
        Your carousel
      </span>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          Carousel {carousel}
        </h2>
        <StatusPill tone="success" surface="hero" leadingDot size="sm">
          {progressLabel}
        </StatusPill>
      </div>
      <div className="flex items-baseline justify-between gap-3 pt-1">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          First bag
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {firstBagEstimate}
        </span>
      </div>
    </div>
  );
}

function BaggageProgressTracker({ steps }: { steps: Step[] }) {
  return (
    <ol
      aria-label="Baggage progress"
      className="grid pt-1"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => (
        <HeroStepCell
          key={step.id}
          step={step}
          isFirst={i === 0}
          isLast={i === steps.length - 1}
        />
      ))}
    </ol>
  );
}

/**
 * Step cell for the 3-stop progress tracker that lives **inside** the
 * dark teal pass body. Painted in mint (`--color-map-mint`) for complete
 * + current segments so it reads cleanly against the hero surface;
 * upcoming segments use `--color-surface-hero-tile-border`.
 */
function HeroStepCell({
  step,
  isFirst,
  isLast,
}: {
  step: Step;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li
      aria-current={step.status === "current" ? "step" : undefined}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative flex h-6 w-full items-center justify-center">
        <span
          aria-hidden
          className={`absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isFirst
              ? ""
              : step.status === "upcoming"
                ? "bg-[var(--color-surface-hero-tile-border)]"
                : "bg-[var(--color-map-mint)]"
          }`}
        />
        <span
          aria-hidden
          className={`absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isLast
              ? ""
              : step.status === "complete"
                ? "bg-[var(--color-map-mint)]"
                : "bg-[var(--color-surface-hero-tile-border)]"
          }`}
        />
        <HeroStepDot status={step.status} />
      </div>
      <span
        className={`text-label ${
          step.status === "current"
            ? "text-[var(--color-surface-hero-fg)]"
            : step.status === "complete"
              ? "text-[var(--color-surface-hero-fg-muted)]"
              : "text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {step.label}
      </span>
      <span className="sr-only">
        {step.status === "complete"
          ? "completed"
          : step.status === "current"
            ? "current step"
            : "upcoming"}
      </span>
    </li>
  );
}

function HeroStepDot({ status }: { status: StepStatus }) {
  if (status === "complete") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-[var(--color-map-mint)]"
      />
    );
  }
  if (status === "current") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-map-mint-bg)]"
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-map-mint)]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="relative inline-flex h-3 w-3 items-center justify-center rounded-full border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]"
    />
  );
}

function LocationPanel({
  location,
  guidance,
}: {
  location: string;
  guidance: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] p-4">
      <IconTile
        size={32}
        className="rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <LocationPinIcon size={14} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {location}
        </span>
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {guidance}
        </span>
      </div>
    </div>
  );
}

function ArrivalJourneyCard({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label={`Arrival journey, step ${currentStep} of ${steps.length}`}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
          Arrival journey
        </span>
        <span className="text-micro uppercase tabular-nums text-[var(--color-text-muted)]">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      <ol
        aria-label="Journey steps"
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => (
          <SheetStepCell
            key={step.id}
            step={step}
            isFirst={i === 0}
            isLast={i === steps.length - 1}
          />
        ))}
      </ol>
    </Card>
  );
}

function SheetStepCell({
  step,
  isFirst,
  isLast,
}: {
  step: Step;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li
      aria-current={step.status === "current" ? "step" : undefined}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative flex h-6 w-full items-center justify-center">
        <span
          aria-hidden
          className={`absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isFirst
              ? ""
              : step.status === "upcoming"
                ? "bg-[var(--color-border-soft)]"
                : "bg-[var(--color-action-teal)]"
          }`}
        />
        <span
          aria-hidden
          className={`absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isLast
              ? ""
              : step.status === "complete"
                ? "bg-[var(--color-action-teal)]"
                : "bg-[var(--color-border-soft)]"
          }`}
        />
        <SheetStepDot status={step.status} />
      </div>
      <span
        className={`text-label ${
          step.status === "current"
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {step.label}
      </span>
      <span className="sr-only">
        {step.status === "complete"
          ? "completed"
          : step.status === "current"
            ? "current step"
            : "upcoming"}
      </span>
    </li>
  );
}

function SheetStepDot({ status }: { status: StepStatus }) {
  if (status === "complete") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
      >
        <CheckIcon size={12} />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-action-teal)] bg-[var(--color-surface-sheet)]"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-action-teal)]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-sheet)]"
    />
  );
}

function BaggageTipCard() {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      className="flex items-start gap-3"
    >
      <IconTile
        size={36}
        className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
      >
        <LuggageIcon size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          Keep your baggage tag handy
        </span>
        <p className="text-label text-[var(--color-text-secondary)]">
          You may be asked to show it before exiting customs.
        </p>
      </div>
    </Card>
  );
}
