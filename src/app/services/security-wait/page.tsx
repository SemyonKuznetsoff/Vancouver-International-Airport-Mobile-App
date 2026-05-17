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
  FootstepsIcon,
  LocationPinIcon,
  NavigationIcon,
  ShieldCheckIcon,
  SparkleIcon,
  SyncIcon,
} from "@/components/icons";

type CheckpointTone = "low" | "medium" | "high";

type CheckpointSummary = {
  id: string;
  label: string;
  waitMinutes: number;
  tone: CheckpointTone;
};

type Checkpoint = {
  id: string;
  name: string;
  location: string;
  waitMinutes: number;
  status: "Open" | "Closed";
  recommended?: boolean;
};

type ExpressLane = {
  title: string;
  helper: string;
  estimateMinutes: number;
};

type RouteStop = {
  id: string;
  label: string;
  helper: string;
  state: "complete" | "current" | "upcoming";
};

const STATUS_LABEL = "Updated just now";
const SOURCE_LABEL = "CATSA & YVR feed";

const SUMMARY: CheckpointSummary[] = [
  { id: "intl", label: "International", waitMinutes: 12, tone: "low" },
  { id: "us", label: "US Transborder", waitMinutes: 18, tone: "medium" },
  { id: "dom", label: "Domestic", waitMinutes: 6, tone: "low" },
];

const RECOMMENDED: Checkpoint = {
  id: "intl-main",
  name: "International · Main",
  location: "International Terminal · Level 2",
  waitMinutes: 12,
  status: "Open",
  recommended: true,
};

const EXPRESS_LANE: ExpressLane = {
  title: "Express lane available",
  helper: "Eligible travelers: 5 min est.",
  estimateMinutes: 5,
};

const ROUTE_STOPS: RouteStop[] = [
  { id: "you", label: "You", helper: "Level 3", state: "complete" },
  { id: "security", label: "Security", helper: "Level 2", state: "current" },
  { id: "gate", label: "Gate E", helper: "Departure", state: "upcoming" },
];

const WALK_MINUTES = 4;

const ALL_CHECKPOINTS: Checkpoint[] = [
  {
    id: "intl-main",
    name: "International · Main",
    location: "International Terminal · Level 2",
    waitMinutes: 12,
    status: "Open",
    recommended: true,
  },
  {
    id: "us-transborder",
    name: "US Transborder",
    location: "US Departures · Level 3",
    waitMinutes: 18,
    status: "Open",
  },
  {
    id: "domestic",
    name: "Domestic",
    location: "Domestic Terminal · Level 3",
    waitMinutes: 6,
    status: "Open",
  },
  {
    id: "premium",
    name: "Premium · Express",
    location: "International Terminal · Level 2",
    waitMinutes: 5,
    status: "Open",
  },
];

export default function SecurityWaitPage() {
  return (
    <AppShellAuthed activeHref="/services">
      <SecurityHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <SecurityStatusPass summary={SUMMARY} />
        <RecommendedCheckpointCard
          checkpoint={RECOMMENDED}
          express={EXPRESS_LANE}
          stops={ROUTE_STOPS}
          walkMinutes={WALK_MINUTES}
        />
        <AllCheckpointsSection checkpoints={ALL_CHECKPOINTS} />
      </div>
    </AppShellAuthed>
  );
}

function SecurityHeader() {
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
          Security
        </h1>
      </div>

      <HeaderIconButton aria-label="Refresh security wait times">
        <SyncIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function SecurityStatusPass({ summary }: { summary: CheckpointSummary[] }) {
  const accessibleName = `Live security status from ${SOURCE_LABEL}, ${STATUS_LABEL}. ${summary
    .map((s) => `${s.label}: ${s.waitMinutes} minute wait`)
    .join(", ")}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        <SecurityPassHeader />
        <SecurityIdentity />
        <SecuritySummaryGrid summary={summary} />

        <PassPerforation inset="-mx-5" />

        <SecurityPassFooter />
      </div>
    </HeroSurface>
  );
}

function SecurityPassHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Live security status
      </StatusPill>
      <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-surface-hero-fg-muted)]">
        <SyncIcon size={11} aria-hidden />
        {STATUS_LABEL}
      </span>
    </div>
  );
}

function SecurityIdentity() {
  return (
    <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
      {SOURCE_LABEL}
    </span>
  );
}

function SecurityPassFooter() {
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
          YVR · Security checkpoints
        </span>
      </div>
      <SecurityBarcodeMarks />
    </div>
  );
}

function SecurityBarcodeMarks() {
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

function SecuritySummaryGrid({
  summary,
}: {
  summary: CheckpointSummary[];
}) {
  return (
    <ul
      aria-label="Checkpoint wait times"
      className="grid grid-cols-3 gap-2.5"
    >
      {summary.map((s) => (
        <li key={s.id}>
          <SecuritySummaryTile summary={s} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Checkpoint summary tile inside the green pass. The thin top accent
 * stripe encodes wait length: mint for low waits, warning for medium,
 * danger for long. The number plus its `min` unit remains the
 * authoritative cue — colour is not load-bearing.
 */
function SecuritySummaryTile({ summary }: { summary: CheckpointSummary }) {
  return (
    <div
      aria-label={`${summary.label}: ${summary.waitMinutes} minute wait`}
      className="relative flex flex-col gap-2 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] p-3"
    >
      <SummaryToneStripe tone={summary.tone} />
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        {summary.label}
      </span>
      <span className="inline-flex items-baseline gap-1">
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {summary.waitMinutes}
        </span>
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          min
        </span>
      </span>
    </div>
  );
}

const TONE_STRIPE: Record<CheckpointTone, string> = {
  low: "bg-[var(--color-map-mint)]",
  medium: "bg-[var(--color-warning)]",
  high: "bg-[var(--color-danger)]",
};

function SummaryToneStripe({ tone }: { tone: CheckpointTone }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-x-3 top-0 h-0.5 rounded-b-full ${TONE_STRIPE[tone]}`}
    />
  );
}

function RecommendedCheckpointCard({
  checkpoint,
  express,
  stops,
  walkMinutes,
}: {
  checkpoint: Checkpoint;
  express: ExpressLane;
  stops: RouteStop[];
  walkMinutes: number;
}) {
  const accessibleName = `Recommended checkpoint: ${checkpoint.name}, ${checkpoint.waitMinutes} minute wait, ${checkpoint.location}, ${walkMinutes} minute walk.`;
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label={accessibleName}
      className="flex flex-col gap-4"
    >
      <RecommendedChips />
      <RecommendedTitleRow
        name={checkpoint.name}
        waitMinutes={checkpoint.waitMinutes}
      />
      <RecommendedLocation location={checkpoint.location} />
      <ExpressLaneModule express={express} />
      <CheckpointRouteStrip stops={stops} />
      <RecommendedActionRow
        walkMinutes={walkMinutes}
        checkpointName={checkpoint.name}
      />
    </Card>
  );
}

function RecommendedChips() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 text-micro uppercase text-[var(--color-action-primary-fg)]">
        <CheckIcon size={11} aria-hidden />
        Recommended
      </span>
      <span className="inline-flex h-7 items-center rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-2.5 text-micro uppercase text-[var(--color-map-mint)]">
        Lowest wait for your terminal
      </span>
    </div>
  );
}

function RecommendedTitleRow({
  name,
  waitMinutes,
}: {
  name: string;
  waitMinutes: number;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-section-title text-[var(--color-text-primary)]">
        {name}
      </h2>
      <span className="inline-flex items-baseline gap-1">
        <span className="text-title tabular-nums text-[var(--color-text-primary)]">
          {waitMinutes}
        </span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          min
        </span>
      </span>
    </div>
  );
}

function RecommendedLocation({ location }: { location: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-body-sm text-[var(--color-text-secondary)]">
      <LocationPinIcon size={12} aria-hidden />
      {location}
    </span>
  );
}

function ExpressLaneModule({ express }: { express: ExpressLane }) {
  return (
    <div
      role="note"
      className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-3 py-2.5"
    >
      <IconTile
        size={32}
        className="rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-surface-sheet)] text-[var(--color-action-teal)]"
      >
        <SparkleIcon size={14} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-action-teal)]">
          {express.title}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {express.helper}
        </span>
      </div>
      <span className="inline-flex shrink-0 items-baseline gap-0.5">
        <span className="text-section-title tabular-nums text-[var(--color-action-teal)]">
          {express.estimateMinutes}
        </span>
        <span className="text-micro uppercase text-[var(--color-action-teal)]">
          min
        </span>
      </span>
    </div>
  );
}

function CheckpointRouteStrip({ stops }: { stops: RouteStop[] }) {
  return (
    <ol
      aria-label="Walking route from you to gate"
      className="grid"
      style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}
    >
      {stops.map((stop, i) => (
        <RouteStopCell
          key={stop.id}
          stop={stop}
          isFirst={i === 0}
          isLast={i === stops.length - 1}
        />
      ))}
    </ol>
  );
}

function RouteStopCell({
  stop,
  isFirst,
  isLast,
}: {
  stop: RouteStop;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li
      aria-current={stop.state === "current" ? "step" : undefined}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative flex h-4 w-full items-center justify-center">
        <span
          aria-hidden
          className={`absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isFirst
              ? ""
              : stop.state === "upcoming"
                ? "bg-[var(--color-border-soft)]"
                : "bg-[var(--color-action-teal)]"
          }`}
        />
        <span
          aria-hidden
          className={`absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isLast
              ? ""
              : stop.state === "complete"
                ? "bg-[var(--color-action-teal)]"
                : "bg-[var(--color-border-soft)]"
          }`}
        />
        <RouteStopDot state={stop.state} />
      </div>
      <span
        className={`text-label ${
          stop.state === "current"
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {stop.label}
      </span>
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        {stop.helper}
      </span>
      <span className="sr-only">
        {stop.state === "complete"
          ? "completed"
          : stop.state === "current"
            ? "current step"
            : "upcoming"}
      </span>
    </li>
  );
}

function RouteStopDot({ state }: { state: RouteStop["state"] }) {
  if (state === "complete") {
    return (
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-text-primary)]"
      />
    );
  }
  if (state === "current") {
    return (
      <span
        aria-hidden
        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-map-mint-bg)]"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-action-teal)]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
    />
  );
}

function RecommendedActionRow({
  walkMinutes,
  checkpointName,
}: {
  walkMinutes: number;
  checkpointName: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <Button
          tone="teal"
          leadingIcon={<NavigationIcon size={16} />}
          aria-label={`Navigate to ${checkpointName}, ${walkMinutes} minute walk`}
        >
          Navigate There
        </Button>
      </div>
      <span
        aria-hidden
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] px-3 text-[var(--color-text-secondary)]"
      >
        <FootstepsIcon size={14} />
        <span className="inline-flex items-baseline gap-1">
          <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
            {walkMinutes} min
          </span>
          <span className="text-micro uppercase text-[var(--color-text-muted)]">
            Walk
          </span>
        </span>
      </span>
    </div>
  );
}

function AllCheckpointsSection({
  checkpoints,
}: {
  checkpoints: Checkpoint[];
}) {
  const activeCount = checkpoints.filter((c) => c.status === "Open").length;
  return (
    <section
      aria-labelledby="all-checkpoints-heading"
      className="flex flex-col gap-3 pt-1"
    >
      <div className="flex items-end justify-between gap-3">
        <h2
          id="all-checkpoints-heading"
          className="text-eyebrow uppercase text-[var(--color-text-muted)]"
        >
          All checkpoints
        </h2>
        <span className="inline-flex h-5 items-center rounded-[var(--radius-pill)] bg-[var(--color-success-bg)] px-2 text-micro uppercase tabular-nums text-[var(--color-success-fg)]">
          {activeCount} active
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {checkpoints.map((c) => (
          <li key={c.id}>
            <CheckpointRow checkpoint={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CheckpointRow({ checkpoint }: { checkpoint: Checkpoint }) {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="compact"
      aria-label={`${checkpoint.name}, ${checkpoint.status}, ${checkpoint.waitMinutes} minute wait, ${checkpoint.location}`}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-success-bg)] px-2 text-micro uppercase text-[var(--color-success-fg)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
          />
          {checkpoint.status}
        </span>
        {checkpoint.recommended ? (
          <span className="inline-flex h-5 items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2 text-micro uppercase text-[var(--color-action-teal)]">
            Recommended
          </span>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {checkpoint.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-text-secondary)]">
            <LocationPinIcon size={11} aria-hidden />
            {checkpoint.location}
          </span>
        </div>
        <span className="inline-flex shrink-0 items-baseline gap-0.5">
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            {checkpoint.waitMinutes}
          </span>
          <span className="text-label text-[var(--color-text-muted)]">
            min
          </span>
        </span>
      </div>
    </Card>
  );
}
