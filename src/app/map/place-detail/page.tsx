import Image from "next/image";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { IconTile } from "@/components/IconTile";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  BuildingIcon,
  CheckIcon,
  DiningIcon,
  LocationPinIcon,
  NavigationIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/icons";

type Place = {
  name: string;
  category: string;
  price: string;
  rating: number;
  reviewCount: number;
  openLabel: string;
  routeStatus: string;
};

type RouteFitStopState = "complete" | "current" | "upcoming";

type RouteFitStop = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  state: RouteFitStopState;
};

type RouteFitSegment = {
  id: string;
  label: string;
  highlighted: boolean;
};

type Decision = {
  title: string;
  subtitle: string;
  detourMinutes: number;
  walkMinutes: number;
  distanceMeters: number;
};

const PLACE: Place = {
  name: "Caffe Artigiano",
  category: "Coffee",
  price: "$$",
  rating: 4.6,
  reviewCount: 380,
  openLabel: "Open till 22:00",
  routeStatus: "On your way",
};

const ROUTE_FIT_STOPS: RouteFitStop[] = [
  { id: "you", label: "You", state: "complete" },
  {
    id: "caffe",
    label: "Caffe",
    icon: <DiningIcon size={14} />,
    state: "current",
  },
  {
    id: "gate",
    label: "D73",
    icon: <BuildingIcon size={14} />,
    state: "upcoming",
  },
];

const ROUTE_FIT_SEGMENTS: RouteFitSegment[] = [
  { id: "you-caffe", label: "4 min · 220m", highlighted: true },
  { id: "caffe-gate", label: "8 min", highlighted: false },
];

const DECISION: Decision = {
  title: "Safe to stop",
  subtitle: "52 min buffer before boarding",
  detourMinutes: 0,
  walkMinutes: 4,
  distanceMeters: 220,
};

const ROUTE_IMPACT_LABEL = "Optimized";

type WhyReason = {
  id: string;
  title: string;
  helper: string;
};

const WHY_RECOMMENDED: WhyReason[] = [
  {
    id: "wait",
    title: "Light wait inside",
    helper: "Most visitors served under 5 min",
  },
  {
    id: "open",
    title: "Stays open past departure",
    helper: "Closes at 22:00, you board well before",
  },
  {
    id: "closer",
    title: "4 min closer than alternatives",
    helper: "On your direct path to Gate D73",
  },
];

export default function PlaceDetailPage() {
  const decisionLabel = `Decision: ${DECISION.title}. ${DECISION.subtitle}. Detour ${DECISION.detourMinutes >= 0 ? "plus " : ""}${DECISION.detourMinutes} minutes, walk ${DECISION.walkMinutes} minutes, distance ${DECISION.distanceMeters} meters.`;
  return (
    <AppShellAuthed activeHref="/map">
      <PlaceHero place={PLACE} />
      <div className="relative z-30 -mt-8 flex flex-1 flex-col rounded-t-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface-sheet)] shadow-[var(--shadow-card)]">
        {/* 1 — Route Fit */}
        <section
          aria-label="Route fit summary"
          className="flex flex-col gap-3 px-6 pb-5 pt-7"
        >
          <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Route fit
          </span>
          <RouteFitModule
            placeName={PLACE.name}
            stops={ROUTE_FIT_STOPS}
            segments={ROUTE_FIT_SEGMENTS}
          />
        </section>

        <SheetDivider />

        {/* 2 — Decision + Actions (bonded as one decision-to-action unit) */}
        <section
          aria-label={decisionLabel}
          className="flex flex-col gap-5 px-6 py-5"
        >
          <DecisionHeader decision={DECISION} />
          <DecisionMetrics decision={DECISION} />
          <div className="flex flex-col gap-2 pt-1">
            <Button
              tone="teal"
              leadingIcon={<NavigationIcon size={16} />}
              aria-label={`Navigate to ${PLACE.name}, ${DECISION.walkMinutes} minute walk`}
            >
              Navigate · {DECISION.walkMinutes} min
            </Button>
            <Button
              variant="secondary"
              leadingIcon={<PlusIcon size={14} />}
              aria-label={`Add ${PLACE.name} as a stop on your route`}
            >
              Add stop to route
            </Button>
          </div>
        </section>

        <SheetDivider />

        {/* 3 — Why we recommended */}
        <WhyRecommendedSection />

        <SheetDivider />

        {/* 4 — Route Impact */}
        <RouteImpactSection />
      </div>
    </AppShellAuthed>
  );
}

/**
 * Full-bleed hairline divider between sections inside the bottom
 * sheet. The sheet's own border + shadow provide outer definition;
 * these inner dividers structure the sections without nesting
 * additional cards.
 */
function SheetDivider() {
  return (
    <span
      aria-hidden
      className="block h-px bg-[var(--color-border-soft)]"
    />
  );
}

/**
 * Full-bleed place hero — photo-backed in the Figma direction.
 *
 * Layering (back → front):
 *   z-0  `<Image>` covers the section with `object-cover`, `priority`.
 *   z-10 `<PlaceHeroVignette>` two-stop dark gradient for text legibility.
 *   z-20 header buttons + content stack + glassy route-fit module.
 */
function PlaceHero({ place }: { place: Place }) {
  const accessibleName = `Place detail for ${place.name}, ${place.category}, ${place.price}, rated ${place.rating} from ${place.reviewCount} reviews, ${place.openLabel}, ${place.routeStatus}.`;
  return (
    <section
      aria-label={accessibleName}
      className="relative overflow-hidden text-[var(--color-surface-hero-fg)] shadow-[var(--shadow-hero-card)]"
      style={{ minHeight: 360 }}
    >
      <Image
        src="/images/place-caffe-artigiano.jpg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        className="absolute inset-0 z-0 object-cover"
      />
      <PlaceHeroVignette />
      <PlaceHeroOverlayHeader placeName={place.name} />
      <div className="relative z-20 flex h-full flex-col justify-end gap-3 px-6 pb-10 pt-16">
        <PlaceLiveBadge />
        <h1 className="text-display text-[var(--color-surface-hero-fg)]">
          {place.name}
        </h1>
        <PlaceMetaRow place={place} />
        <PlaceStatusChips
          openLabel={place.openLabel}
          routeStatus={place.routeStatus}
        />
      </div>
    </section>
  );
}

/**
 * Dark vignette that fades the photo from clear at the top (so the
 * place setting reads through the header band) into
 * `--color-surface-hero-end` at the bottom (so the title, meta row,
 * status chips, and glassy route-fit module read cleanly).
 */
function PlaceHeroVignette() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, transparent 0%, transparent 30%, var(--color-surface-hero-end) 100%)",
      }}
    />
  );
}

function PlaceHeroOverlayHeader({ placeName }: { placeName: string }) {
  return (
    <header className="absolute left-6 right-6 top-4 z-20 flex items-center justify-between gap-3">
      <HeaderIconButton aria-label="Back to map" href="/map">
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>
      <HeaderIconButton aria-label={`Save ${placeName}`}>
        <BookmarkIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function PlaceLiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 self-start text-eyebrow uppercase text-[var(--color-map-mint)]">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
      />
      Live route fit
    </span>
  );
}

function PlaceMetaRow({ place }: { place: Place }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
      <span className="inline-flex items-center gap-1.5">
        <DiningIcon size={12} aria-hidden />
        {place.category}
      </span>
      <span aria-hidden>·</span>
      <span className="tabular-nums">{place.price}</span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1 text-[var(--color-surface-hero-fg)]">
        <StarIcon size={12} aria-hidden />
        <span className="tabular-nums">{place.rating.toFixed(1)}</span>
      </span>
      <span className="tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        ({place.reviewCount})
      </span>
    </div>
  );
}

function PlaceStatusChips({
  openLabel,
  routeStatus,
}: {
  openLabel: string;
  routeStatus: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        {openLabel}
      </StatusPill>
      <span className="inline-flex h-5 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-2 text-micro uppercase text-[var(--color-surface-hero-fg)]">
        <NavigationIcon size={11} aria-hidden />
        {routeStatus}
      </span>
    </div>
  );
}

/**
 * Route-fit module — sits at the top of the white bottom sheet,
 * visually overlapping the photo hero. Light/sheet variant: stops and
 * connectors use action-teal / text / border tokens (not hero tokens)
 * since the surface is now white.
 */
function RouteFitModule({
  placeName,
  stops,
  segments,
}: {
  placeName: string;
  stops: RouteFitStop[];
  segments: RouteFitSegment[];
}) {
  const youToPlace = segments[0]?.label ?? "";
  const placeToGate = segments[1]?.label ?? "";
  const gateLabel = stops[2]?.label ?? "";
  const accessibleName = `${placeName} is ${youToPlace} from you, then ${placeToGate} to gate ${gateLabel}.`;
  return (
    <div
      aria-label={accessibleName}
      className="flex items-center gap-2"
    >
      {stops.map((stop, i) => {
        const seg = segments[i];
        return (
          <span key={stop.id} className="contents">
            <RouteFitStopNode stop={stop} />
            {seg ? <RouteFitConnector segment={seg} /> : null}
          </span>
        );
      })}
    </div>
  );
}

function RouteFitStopNode({ stop }: { stop: RouteFitStop }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <RouteFitStopMark stop={stop} />
      <span
        className={`text-micro uppercase ${
          stop.state === "current"
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {stop.label}
      </span>
    </div>
  );
}

function RouteFitStopMark({ stop }: { stop: RouteFitStop }) {
  if (stop.state === "current") {
    return (
      <span
        aria-hidden
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
      >
        {stop.icon ?? (
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-action-primary-fg)]" />
        )}
      </span>
    );
  }
  if (stop.state === "complete") {
    return (
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
      >
        {stop.icon ?? (
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-action-teal)]" />
        )}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-action-teal)] bg-[var(--color-surface-sheet)] text-[var(--color-action-teal)]"
    >
      {stop.icon ?? (
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-action-teal)]" />
      )}
    </span>
  );
}

function RouteFitConnector({ segment }: { segment: RouteFitSegment }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <span
        className={`text-micro uppercase tabular-nums ${
          segment.highlighted
            ? "text-[var(--color-action-teal)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        {segment.label}
      </span>
      <span
        aria-hidden
        className={`block h-px w-full ${
          segment.highlighted
            ? "bg-[var(--color-action-teal)]"
            : "border-t border-dashed border-[var(--color-border-soft)]"
        }`}
      />
    </div>
  );
}

function DecisionHeader({ decision }: { decision: Decision }) {
  return (
    <div className="flex items-start gap-5">
      <IconTile
        size={48}
        className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
      >
        <ShieldCheckIcon size={22} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          Decision
        </span>
        <h2 className="text-title text-[var(--color-text-primary)]">
          {decision.title}
        </h2>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          {decision.subtitle}
        </p>
      </div>
    </div>
  );
}

function DecisionMetrics({ decision }: { decision: Decision }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-border-soft)]">
      <DecisionMetric
        label="Detour"
        toned
        value={
          <span className="inline-flex items-baseline gap-0.5">
            {decision.detourMinutes >= 0 ? "+" : ""}
            {decision.detourMinutes}
            <span className="text-label text-[var(--color-text-muted)]">
              min
            </span>
          </span>
        }
      />
      <DecisionMetric
        label="Walk"
        value={
          <span className="inline-flex items-baseline gap-0.5">
            {decision.walkMinutes}
            <span className="text-label text-[var(--color-text-muted)]">
              min
            </span>
          </span>
        }
        divider
      />
      <DecisionMetric
        label="Distance"
        value={
          <span className="inline-flex items-baseline gap-0.5">
            {decision.distanceMeters}
            <span className="text-label text-[var(--color-text-muted)]">
              m
            </span>
          </span>
        }
        divider
      />
    </div>
  );
}

function DecisionMetric({
  label,
  value,
  divider = false,
  toned = false,
}: {
  label: string;
  value: React.ReactNode;
  divider?: boolean;
  toned?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 px-3 py-4 ${
        divider ? "border-l border-[var(--color-border-soft)]" : ""
      }`}
    >
      <span className="text-micro uppercase text-[var(--color-text-secondary)]">
        {label}
      </span>
      <span
        className={`text-section-title tabular-nums ${
          toned
            ? "text-[var(--color-success-fg)]"
            : "text-[var(--color-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function WhyRecommendedSection() {
  return (
    <section
      aria-labelledby="why-recommended-heading"
      className="flex flex-col gap-4 px-6 py-5"
    >
      <h2
        id="why-recommended-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Why we recommended
      </h2>
      <ul className="flex flex-col gap-3.5">
        {WHY_RECOMMENDED.map((reason) => (
          <li key={reason.id}>
            <WhyRecommendedRow reason={reason} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function WhyRecommendedRow({ reason }: { reason: WhyReason }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
      >
        <CheckIcon size={12} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          {reason.title}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {reason.helper}
        </span>
      </div>
    </div>
  );
}

function RouteImpactSection() {
  return (
    <section
      aria-labelledby="route-impact-heading"
      className="flex flex-1 flex-col gap-3 px-6 pb-8 pt-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="route-impact-heading"
          className="text-eyebrow uppercase text-[var(--color-text-muted)]"
        >
          Route impact
        </h2>
        <span className="inline-flex h-5 items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-success-bg)] px-2 text-micro uppercase text-[var(--color-success-fg)]">
          <SparkleIcon size={11} aria-hidden />
          {ROUTE_IMPACT_LABEL}
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] px-4 py-4">
        <IconTile
          size={36}
          className="rounded-full bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
        >
          <LocationPinIcon size={16} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            Current location
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            Concourse C · Level 3
          </span>
        </div>
      </div>
    </section>
  );
}
