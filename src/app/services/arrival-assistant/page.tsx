import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  LocationPinIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SyncIcon,
} from "@/components/icons";

type ArrivalFlight = {
  airline: string;
  flightNumber: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  landedAt: string;
  gate: string;
  terminal: string;
  carousel: number;
};

type CurrentStep = {
  index: number;
  total: number;
  title: string;
  description: string;
  location: string;
  estTime: string;
  advisory: string;
};

type UpcomingStep = {
  id: string;
  index: number;
  title: string;
  detail: string;
  href?: Route;
};

const FLIGHT: ArrivalFlight = {
  airline: "Cathay Pacific",
  flightNumber: "CX838",
  origin: { code: "HKG", city: "Hong Kong" },
  destination: { code: "YVR", city: "Vancouver" },
  landedAt: "09:18",
  gate: "E75",
  terminal: "Intl",
  carousel: 6,
};

const ARRIVAL_FACILITY = "YVR · International Arrivals";

const CURRENT_STEP: CurrentStep = {
  index: 1,
  total: 5,
  title: "CBSA Primary Inspection",
  description: "Follow signs to Canadian Border Services",
  location: "Level 2 · Main Hall",
  estTime: "15 – 20 min",
  advisory:
    "ArriveCAN or paper declaration may be required. Have your passport ready.",
};

const UPCOMING_STEPS: UpcomingStep[] = [
  {
    id: "baggage",
    index: 2,
    title: "Baggage claim",
    detail: "Carousel 6 · ~12 min",
    href: "/flights/baggage-info" as Route,
  },
  { id: "carousel", index: 3, title: "Carousel 6", detail: "International Arrivals · Level 2" },
  { id: "inspection", index: 4, title: "Customs inspection", detail: "Final declaration · Green / Red lanes" },
  { id: "transport", index: 5, title: "Ground transport", detail: "SkyTrain, taxi, rideshare, pickup" },
];

export default function ArrivalAssistantPage() {
  return (
    <AppShellAuthed activeHref="/services">
      <ArrivalHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <ArrivalIntro />
        <LiveArrivalStatusCard flight={FLIGHT} />
        <CurrentStepCard step={CURRENT_STEP} />
        <NextStepsCard steps={UPCOMING_STEPS} />
      </div>
    </AppShellAuthed>
  );
}

function ArrivalHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to services"
        href={"/services" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <span
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-3 text-micro uppercase text-[var(--color-success-fg)]"
        aria-label="Live status, Vancouver International"
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
        />
        Live · YVR
      </span>

      <HeaderIconButton aria-label="Refresh arrival status">
        <SyncIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function ArrivalIntro() {
  return (
    <section className="flex flex-col gap-2 pt-1">
      <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
        Arrival assistant
      </span>
      <h1 className="text-title text-[var(--color-text-primary)]">
        Welcome to Vancouver
      </h1>
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        We&rsquo;ll guide you from Gate {FLIGHT.gate} to ground transport.
      </p>
    </section>
  );
}

function LiveArrivalStatusCard({ flight }: { flight: ArrivalFlight }) {
  const accessibleName = `Live arrival status — ${flight.airline} ${flight.flightNumber} from ${flight.origin.city} landed at ${flight.landedAt}, gate ${flight.gate}, terminal ${flight.terminal}, carousel ${flight.carousel}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        {/* Pass header strip */}
        <ArrivalPassHeader />

        {/* Airline + flight + landed time */}
        <ArrivalIdentity
          airline={flight.airline}
          flightNumber={flight.flightNumber}
          landedAt={flight.landedAt}
        />

        {/* Route zone */}
        <ArrivalRoute
          origin={flight.origin}
          destination={flight.destination}
        />

        {/* Metadata strip — gate / terminal / carousel */}
        <ArrivalInfoModule
          gate={flight.gate}
          terminal={flight.terminal}
          carousel={flight.carousel}
        />

        <PassPerforation inset="-mx-5" />

        {/* Pass footer — facility chip + barcode marks */}
        <ArrivalPassFooter />
      </div>
    </HeroSurface>
  );
}

function ArrivalPassHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Live arrival status
      </StatusPill>
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        YVR · INTL
      </span>
    </div>
  );
}

function ArrivalIdentity({
  airline,
  flightNumber,
  landedAt,
}: {
  airline: string;
  flightNumber: string;
  landedAt: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
          {airline}
        </span>
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {flightNumber}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
        <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
          Landed
        </span>
        <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {landedAt}
        </span>
      </div>
    </div>
  );
}

function ArrivalRoute({
  origin,
  destination,
}: {
  origin: ArrivalFlight["origin"];
  destination: ArrivalFlight["destination"];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <ArrivalRouteLine />
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

function ArrivalRouteLine() {
  return (
    <span aria-hidden className="relative flex w-full items-center">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex shrink-0 text-[var(--color-map-mint)]">
        <PlaneIcon size={12} />
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
    </span>
  );
}

function ArrivalInfoModule({
  gate,
  terminal,
  carousel,
}: {
  gate: string;
  terminal: string;
  carousel: number;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <ArrivalInfoCell label="Gate" value={gate} />
      <ArrivalInfoCell label="Terminal" value={terminal} divider />
      <ArrivalInfoCell label="Carousel" value={String(carousel)} divider />
    </div>
  );
}

function ArrivalInfoCell({
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

function ArrivalPassFooter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
        >
          <ShieldCheckIcon size={12} />
        </span>
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          {ARRIVAL_FACILITY}
        </span>
      </div>
      <ArrivalBarcodeMarks />
    </div>
  );
}

function ArrivalBarcodeMarks() {
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

function CurrentStepCard({ step }: { step: CurrentStep }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label={`Current step ${step.index} of ${step.total}: ${step.title}`}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-micro uppercase tabular-nums text-[var(--color-text-muted)]">
          Current step · {step.index} of {step.total}
        </span>
        <StatusPill tone="success" size="sm" leadingDot>
          Active now
        </StatusPill>
      </div>

      <div className="flex items-start gap-3">
        <IconTile
          size={44}
          className="rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
        >
          <ShieldCheckIcon size={20} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-section-title text-[var(--color-text-primary)]">
            {step.title}
          </h2>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            {step.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <CurrentStepCell
          label="Location"
          value={step.location}
          icon={<LocationPinIcon size={11} />}
        />
        <CurrentStepCell
          label="Est. time"
          value={step.estTime}
          icon={<ClockIcon size={11} />}
        />
      </div>

      <ArrivalAdvisory message={step.advisory} />
    </Card>
  );
}

function CurrentStepCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] px-3 py-2.5">
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-text-muted)]">
        <span aria-hidden className="inline-flex shrink-0">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}

function ArrivalAdvisory({ message }: { message: string }) {
  return (
    <div
      role="note"
      className="flex items-start gap-2.5 rounded-[var(--radius-tile)] border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 py-2.5"
    >
      <span
        aria-hidden
        className="inline-flex shrink-0 pt-0.5 text-[var(--color-warning-fg)]"
      >
        <InfoIcon size={14} />
      </span>
      <p className="text-label text-[var(--color-warning-fg)]">{message}</p>
    </div>
  );
}

function NextStepsCard({ steps }: { steps: UpcomingStep[] }) {
  return (
    <section
      aria-labelledby="next-steps-heading"
      className="flex flex-col gap-3 pt-1"
    >
      <h2
        id="next-steps-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Next steps
      </h2>
      <Card
        as="div"
        surface="sheet"
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        {steps.map((step) => (
          <NextStepRow key={step.id} step={step} />
        ))}
      </Card>
    </section>
  );
}

function NextStepRow({ step }: { step: UpcomingStep }) {
  const content = (
    <>
      <span
        aria-hidden
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-tile)] text-body-sm-emphasis tabular-nums text-[var(--color-text-secondary)]"
      >
        {step.index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          {step.title}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {step.detail}
        </span>
      </div>
      {step.href ? (
        <span
          aria-hidden
          className="inline-flex shrink-0 text-[var(--color-text-muted)]"
        >
          <ChevronRightIcon size={16} />
        </span>
      ) : null}
    </>
  );
  if (step.href) {
    return (
      <Link
        href={step.href}
        aria-label={`${step.title} — ${step.detail}`}
        className="flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        {content}
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">{content}</div>
  );
}
