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
  BellIcon,
  LocationPinIcon,
  PlaneIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type ArrivingFlight = {
  date: string;
  flightCode: string;
  airline: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  landingTime: string;
  status: "on-time" | "delayed";
};

type PickupTiming = {
  moveInMinutes: number;
  untilLandingMinutes: number;
  exitWindow: string;
  alertLeadMinutes: number;
};

type JourneyStage = {
  id: string;
  title: string;
  detail: string;
  state: "active" | "upcoming";
  /**
   * Right-side timing chip. `"Now"` on the active row renders the
   * filled teal NOW pill; on upcoming rows it renders a soft pill
   * with the estimated time. Set to `null` to omit the chip — used
   * on the final Exit row where the time is already in the detail
   * line so a chip would duplicate.
   */
  eta: string | null;
};

const FLIGHT: ArrivingFlight = {
  date: "Sat · May 9",
  flightCode: "CX838",
  airline: "Cathay Pacific",
  origin: { code: "HKG", city: "Hong Kong" },
  destination: { code: "YVR", city: "Vancouver" },
  landingTime: "09:22",
  status: "on-time",
};

const TIMING: PickupTiming = {
  moveInMinutes: 25,
  untilLandingMinutes: 38,
  exitWindow: "09:55 – 10:10",
  alertLeadMinutes: 25,
};

const STAGES: JourneyStage[] = [
  {
    id: "in-flight",
    title: "In Flight",
    detail: "Approaching · 38 min to land",
    state: "active",
    eta: "Now",
  },
  {
    id: "customs",
    title: "Customs",
    detail: "Typically 15 – 20 min after deplaning",
    state: "upcoming",
    eta: "~10:05",
  },
  {
    id: "baggage",
    title: "Baggage · Carousel 6",
    detail: "Bags usually arrive ~25 min after landing",
    state: "upcoming",
    eta: "~10:25",
  },
  {
    id: "exit",
    title: "Exit · Level 2 Arrivals",
    detail: "Predicted window 09:55 – 10:10",
    state: "upcoming",
    eta: null,
  },
];

const PASSENGER_FIRST_NAME = "Sarah";

export default function PickupWaitingPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <PickupWaitingHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <PickupHero flight={FLIGHT} timing={TIMING} />
        <LiveProgressPreview
          passenger={PASSENGER_FIRST_NAME}
          stages={STAGES}
        />
      </div>
    </AppShellAuthed>
  );
}

function PickupWaitingHeader() {
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
          Live pickup
        </span>
        <span className="text-section-title text-[var(--color-text-primary)]">
          {PASSENGER_FIRST_NAME}&rsquo;s arrival
        </span>
      </div>

      <HeaderIconButton
        aria-label="Pickup alert settings, new alert"
        badgeDot
      >
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function PickupHero({
  flight,
  timing,
}: {
  flight: ArrivingFlight;
  timing: PickupTiming;
}) {
  const accessibleName = `Live pickup pass for ${PASSENGER_FIRST_NAME}: ${flight.airline} ${flight.flightCode} from ${flight.origin.city} lands at ${flight.landingTime}, recommended departure in ${timing.moveInMinutes} minutes.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="delay" />
      <div className="relative flex flex-col gap-5 p-5">
        <PickupIdentity passenger={PASSENGER_FIRST_NAME} />

        <PickupFlightCard flight={flight} />

        <PassPerforation inset="-mx-5" />

        <PickupRecommendation timing={timing} />

        <PickupHelperNote alertLeadMinutes={timing.alertLeadMinutes} />

        <PickupActionBar />

        <PickupPassFooter
          flightCode={flight.flightCode}
          airline={flight.airline}
        />
      </div>
    </HeroSurface>
  );
}

function PickupIdentity({ passenger }: { passenger: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="inline-flex items-center gap-2 self-start rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-2.5 py-1 text-micro uppercase text-[var(--color-map-mint)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        Picking up · Live
      </span>
      <h1 className="text-display text-[var(--color-surface-hero-fg)] [&_em]:font-normal [&_em]:italic">
        {passenger} is <em>approaching.</em>
      </h1>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        Hold tight &mdash; we&rsquo;ll tell you when to head in.
      </p>
    </div>
  );
}

function PickupFlightCard({ flight }: { flight: ArrivingFlight }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {flight.date} · {flight.flightCode}
        </span>
        <StatusPill tone="success" surface="hero" leadingDot size="sm">
          On time
        </StatusPill>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
              {flight.origin.city}
            </span>
            <span className="text-display tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
              {flight.origin.code}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
              {flight.destination.city}
            </span>
            <span className="text-display tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
              {flight.destination.code}
            </span>
          </div>
        </div>

        <PickupRouteLine />

        <div className="flex items-center justify-between gap-3">
          <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
            {flight.airline} · {flight.flightCode}
          </span>
          <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-soft)]">
            Lands {flight.landingTime}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Progress line between HKG and YVR with the plane chip positioned to
 * suggest the flight is ~70% complete (approaching destination). The
 * mint dot is the origin marker; the brighter dot at the end is the
 * destination marker — both decorative.
 */
function PickupRouteLine() {
  return (
    <span aria-hidden className="relative flex w-full items-center">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      <span className="h-px flex-[7] border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)] shadow-[var(--shadow-card)]">
        <PlaneIcon size={14} />
      </span>
      <span className="h-px flex-[3] border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
    </span>
  );
}

function PickupRecommendation({ timing }: { timing: PickupTiming }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-map-mint)]">
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-[var(--color-map-mint)]"
          />
          Move in
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-display tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
            {timing.moveInMinutes}
          </span>
          <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
            min
          </span>
        </span>
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          Recommended departure
        </span>
      </div>

      <div className="flex flex-col items-end gap-2 text-right">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Until landing
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-section-title tabular-nums leading-none text-[var(--color-surface-hero-fg)]">
            {timing.untilLandingMinutes}
          </span>
          <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
            min
          </span>
        </span>
        <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-soft)]">
          Exit ~{timing.exitWindow}
        </span>
      </div>
    </div>
  );
}

function PickupHelperNote({
  alertLeadMinutes,
}: {
  alertLeadMinutes: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3">
      <span
        aria-hidden
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <ShieldCheckIcon size={12} />
      </span>
      <p className="min-w-0 flex-1 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        We&rsquo;ll alert you{" "}
        <span className="text-[var(--color-surface-hero-fg)]">
          {alertLeadMinutes} min before exit
        </span>
        . Drive time is built in.
      </p>
    </div>
  );
}

function PickupActionBar() {
  return (
    <div className="flex items-stretch gap-2.5">
      <div className="min-w-0 flex-1">
        <Button
          tone="inverse"
          leadingIcon={<BellIcon size={16} />}
          aria-label="Set pickup alert"
        >
          Set Alert
        </Button>
      </div>
      <div className="min-w-0 flex-1">
        <Button
          tone="inverse"
          disabled
          leadingIcon={<LocationPinIcon size={16} />}
          aria-label="View pickup zone, available after landing"
        >
          Pickup Zone
        </Button>
      </div>
    </div>
  );
}

function PickupPassFooter({
  flightCode,
  airline,
}: {
  flightCode: string;
  airline: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[var(--color-surface-hero-tile-border)] pt-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
        >
          <PlaneIcon size={12} />
        </span>
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          {airline} · {flightCode} · Intl. Arrivals
        </span>
      </div>
      <PickupBarcodeMarks />
    </div>
  );
}

function PickupBarcodeMarks() {
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

function LiveProgressPreview({
  passenger,
  stages,
}: {
  passenger: string;
  stages: JourneyStage[];
}) {
  const activeIndex = stages.findIndex((s) => s.state === "active");
  const stageCount = stages.length;
  const currentStage = activeIndex >= 0 ? activeIndex + 1 : 1;
  return (
    <section
      aria-labelledby="live-progress-heading"
      className="flex flex-col gap-3 pt-2"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-action-teal)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-action-teal)]"
            />
            Live progress
          </span>
          <h2
            id="live-progress-heading"
            className="text-section-title text-[var(--color-text-primary)]"
          >
            {passenger}&rsquo;s journey
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2.5 py-1 text-micro uppercase tabular-nums text-[var(--color-action-teal)]">
          Stage {currentStage} of {stageCount}
        </span>
      </div>

      <Card as="article" surface="sheet" padding="lg">
        <ol className="flex flex-col">
          {stages.map((stage, i) => (
            <PickupStageRow
              key={stage.id}
              stage={stage}
              isLast={i === stages.length - 1}
              isBeforeOrAtActive={activeIndex >= 0 && i <= activeIndex}
            />
          ))}
        </ol>
      </Card>
    </section>
  );
}

function PickupStageRow({
  stage,
  isLast,
  isBeforeOrAtActive,
}: {
  stage: JourneyStage;
  isLast: boolean;
  isBeforeOrAtActive: boolean;
}) {
  const active = stage.state === "active";
  return (
    <li
      className="relative flex gap-4"
      aria-current={active ? "step" : undefined}
    >
      <StageSpine
        active={active}
        isLast={isLast}
        spineFilled={isBeforeOrAtActive && !isLast}
      />
      <div
        className={`flex min-w-0 flex-1 items-center justify-between gap-3 ${
          isLast ? "pb-0" : "pb-5"
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
        <StageEtaChip eta={stage.eta} active={active} />
      </div>
    </li>
  );
}

/**
 * Spine + dot column for a single timeline row. The active row uses
 * a filled teal dot inside a soft teal halo so the current state
 * reads at a glance; upcoming rows use a small hollow ring. The
 * vertical spine segment below the dot is painted teal up to and
 * including the active dot, and muted for everything after — so the
 * column itself shows progress, not just the dots.
 */
function StageSpine({
  active,
  isLast,
  spineFilled,
}: {
  active: boolean;
  isLast: boolean;
  spineFilled: boolean;
}) {
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
          <span className="h-2.5 w-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)]" />
        )}
      </span>
      {isLast ? null : (
        <span
          className={`mt-1 w-px flex-1 ${
            spineFilled
              ? "bg-[var(--color-action-teal)]"
              : "bg-[var(--color-border)]"
          }`}
        />
      )}
    </span>
  );
}

/**
 * Right-side timing chip for a timeline row. The active row gets a
 * filled teal pill with a mint dot — premium "we're here now" badge
 * that echoes the hero's mint accent. Upcoming rows get a quieter
 * surface-tile pill with the ETA. Rows with `eta === null` (the
 * final Exit row, whose time is already in the detail line) render
 * nothing so the column doesn't duplicate.
 */
function StageEtaChip({
  eta,
  active,
}: {
  eta: string | null;
  active: boolean;
}) {
  if (eta == null) return null;
  if (active) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-primary-fg)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        {eta}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] px-2.5 py-1 text-label tabular-nums text-[var(--color-text-secondary)]">
      {eta}
    </span>
  );
}
