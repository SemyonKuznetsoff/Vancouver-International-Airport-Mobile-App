import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { MetricBlock } from "@/components/MetricBlock";
import { PassPerforation } from "@/components/PassPerforation";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CarIcon,
  ClockIcon,
  FootstepsIcon,
  InfoIcon,
  NavigationIcon,
  ParkingIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type SavedCar = {
  province: string;
  plate: string;
  garage: string;
  level: string;
  space: string;
  terminal: string;
  walkTime: string;
  distance: string;
  savedAt: string;
};

const CAR: SavedCar = {
  province: "BC",
  plate: "7YKR 492",
  garage: "Parkade P1",
  level: "Level 2",
  space: "B-042",
  terminal: "International Terminal",
  walkTime: "4 min",
  distance: "280 m",
  savedAt: "Saved just now",
};

type RouteStop = {
  id: string;
  label: string;
  helper: string;
  icon: React.ReactNode;
  active: boolean;
};

const ROUTE_STOPS: RouteStop[] = [
  {
    id: "terminal",
    label: "Terminal",
    helper: "You are here",
    icon: <BuildingIcon size={15} />,
    active: false,
  },
  {
    id: "skybridge",
    label: "Skybridge",
    helper: "Covered walk",
    icon: <FootstepsIcon size={15} />,
    active: false,
  },
  {
    id: "p1",
    label: "P1 · L2",
    helper: `Space ${CAR.space}`,
    icon: <CarIcon size={15} />,
    active: true,
  },
];

export default function FindMyCarPage() {
  return (
    <AppShellAuthed activeHref="/services">
      <FindMyCarHeader />

      <div className="flex flex-1 flex-col gap-6 px-6 pt-2 pb-32">
        <SavedConfirmation />
        <SavedParkingDocument car={CAR} />
        <ParkingMapPreview car={CAR} />
        <RouteCard stops={ROUTE_STOPS} />
        <DetailsCard car={CAR} />
        <ParkingHelperNote />
      </div>

      <StickyNavigateCTA car={CAR} />
    </AppShellAuthed>
  );
}

function FindMyCarHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-3 pt-2">
      <HeaderIconButton
        aria-label="Back to Parking"
        href={"/parking" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <p className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
          Saved location
        </p>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Find My Car
        </h1>
      </div>

      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}

function SavedConfirmation() {
  return (
    <section
      aria-label="Saved location status"
      className="flex items-center justify-between gap-3"
    >
      <div className="inline-flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)]"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-map-mint)] text-[var(--color-action-teal)]">
            <ParkingIcon size={12} />
          </span>
        </span>
        <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
          Saved &amp; ready
        </span>
      </div>
      <span className="text-label text-[var(--color-text-secondary)]">
        {CAR.savedAt}
      </span>
    </section>
  );
}

function SavedParkingDocument({ car }: { car: SavedCar }) {
  return (
    <HeroSurface
      as="section"
      aria-label={`Saved parking location, ${car.province} ${car.plate}, ${car.garage}, ${car.level}, Space ${car.space}.`}
      className="p-0 shadow-[var(--shadow-hero-card)]"
    >
      <div className="relative flex flex-col gap-5 p-6">
        <DocumentHeader car={car} />
        <PassPerforation />
        <DocumentBody car={car} />
        <DocumentFooter />
      </div>
    </HeroSurface>
  );
}

function DocumentHeader({ car }: { car: SavedCar }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
          />
          Parking Location · Saved
        </span>
        <p className="text-title text-[var(--color-surface-hero-fg)]">
          {car.garage}
        </p>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          {car.terminal} · {car.level}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 py-1 text-micro uppercase text-[var(--color-surface-hero-fg)]">
          L2
        </span>
        <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          <ShieldCheckIcon size={12} />
          On device
        </span>
      </div>
    </div>
  );
}

function DocumentBody({ car }: { car: SavedCar }) {
  return (
    <div className="flex items-center gap-5">
      <span
        aria-hidden
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
      >
        <CarIcon size={22} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Vehicle
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
            {car.province} · {car.plate}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Space
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
            {car.space}
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentFooter() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        Walk back from terminal
      </span>
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        YVR · Parking
      </span>
    </div>
  );
}

function ParkingMapPreview({ car }: { car: SavedCar }) {
  const ariaLabel = `Indoor route from the terminal through the skybridge to ${car.garage}, ${car.level}, Space ${car.space}.`;
  return (
    <Card
      as="section"
      surface="sheet"
      padding="none"
      aria-label={ariaLabel}
      className="overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex flex-col">
          <span className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
            Parkade map
          </span>
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {car.garage} · {car.level}
          </span>
        </div>
        <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-teal)]">
          {car.space}
        </span>
      </div>

      <ParkingMapSvg />

      <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border-soft)] px-5 py-3">
        <LegendItem
          dotClass="bg-[var(--color-action-primary)]"
          label="You are here"
        />
        <LegendItem
          dotClass="bg-[var(--color-action-teal)]"
          label={`Space ${car.space}`}
        />
      </div>
    </Card>
  );
}

function ParkingMapSvg() {
  return (
    <div className="bg-[var(--color-surface-tile)] px-4 py-4">
      <svg
        aria-hidden
        viewBox="0 0 360 200"
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="parkade-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--color-border-soft)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect
          x="0"
          y="0"
          width="360"
          height="200"
          fill="url(#parkade-grid)"
          opacity="0.6"
        />

        {/* Parkade outline */}
        <rect
          x="130"
          y="20"
          width="210"
          height="160"
          rx="14"
          fill="var(--color-surface-elevated)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="146"
          y="44"
          fill="var(--color-text-primary)"
          fontWeight="600"
          fontSize="12"
        >
          Parkade P1
        </text>
        <text
          x="146"
          y="60"
          fill="var(--color-text-secondary)"
          fontWeight="600"
          fontSize="9"
          letterSpacing="1.4"
        >
          LEVEL 2
        </text>

        {/* Column markers A B C D */}
        {[
          { x: 162, letter: "A" },
          { x: 212, letter: "B", destination: true },
          { x: 262, letter: "C" },
          { x: 312, letter: "D" },
        ].map((col) => (
          <g key={col.letter}>
            <circle
              cx={col.x}
              cy="86"
              r="9"
              fill={
                col.destination
                  ? "var(--color-action-teal-soft)"
                  : "var(--color-surface-elevated)"
              }
              stroke={
                col.destination
                  ? "var(--color-action-teal)"
                  : "var(--color-border)"
              }
              strokeWidth="0.8"
            />
            <text
              x={col.x}
              y="90"
              fill={
                col.destination
                  ? "var(--color-action-teal)"
                  : "var(--color-text-secondary)"
              }
              fontWeight="700"
              fontSize="9"
              textAnchor="middle"
            >
              {col.letter}
            </text>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <line
                key={idx}
                x1={col.x - 6}
                x2={col.x + 6}
                y1={104 + idx * 12}
                y2={104 + idx * 12}
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
            ))}
          </g>
        ))}

        {/* Terminal block on the left */}
        <rect
          x="14"
          y="86"
          width="64"
          height="40"
          rx="10"
          fill="var(--color-surface-elevated)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="46"
          y="101"
          fill="var(--color-text-primary)"
          fontWeight="700"
          fontSize="9"
          letterSpacing="1.2"
          textAnchor="middle"
        >
          TERMINAL
        </text>

        {/* Skybridge connector — terminal to parkade */}
        <line
          x1="78"
          y1="118"
          x2="130"
          y2="118"
          stroke="var(--color-text-muted)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="84"
          y="134"
          fill="var(--color-text-secondary)"
          fontWeight="700"
          fontSize="8"
          letterSpacing="1"
        >
          SKYBRIDGE
        </text>

        {/* You are here — sits below the TERMINAL label, inside the block */}
        <circle
          cx="46"
          cy="118"
          r="4.5"
          fill="var(--color-action-primary)"
        />
        <circle
          cx="46"
          cy="118"
          r="8"
          fill="none"
          stroke="var(--color-action-primary)"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Route line: terminal → skybridge → parkade column B */}
        <path
          d="M 46 118 L 130 118 L 212 118 L 212 100"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Destination marker at B-042 */}
        <g>
          <circle
            cx="212"
            cy="148"
            r="10"
            fill="var(--color-action-teal-soft)"
            stroke="var(--color-action-teal)"
            strokeWidth="1"
          />
          <circle cx="212" cy="148" r="4" fill="var(--color-action-teal)" />
        </g>
        <text
          x="212"
          y="170"
          fill="var(--color-action-teal)"
          fontWeight="700"
          fontSize="9"
          letterSpacing="1"
          textAnchor="middle"
        >
          B-042
        </text>
      </svg>
    </div>
  );
}

function LegendItem({
  dotClass,
  label,
}: {
  dotClass: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
      <span
        aria-hidden
        className={`inline-block h-2 w-2 rounded-full ${dotClass}`}
      />
      <span>{label}</span>
    </span>
  );
}

function RouteCard({ stops }: { stops: RouteStop[] }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="compact"
      aria-label="Walking route from terminal to saved parking space"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] items-start gap-1">
        <StopCell stop={stops[0]} />
        <ConnectorCell label="4 min walk" />
        <StopCell stop={stops[1]} />
        <ConnectorCell />
        <StopCell stop={stops[2]} />
      </div>
    </Card>
  );
}

function StopCell({ stop }: { stop: RouteStop }) {
  const tile = stop.active
    ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
    : "bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]";
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <span
        aria-hidden
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-pill)] ${tile}`}
      >
        {stop.icon}
      </span>
      <span className="text-micro uppercase text-[var(--color-text-primary)]">
        {stop.label}
      </span>
      <span className="text-label text-[var(--color-text-secondary)]">
        {stop.helper}
      </span>
    </div>
  );
}

function ConnectorCell({ label }: { label?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 pt-4">
      <DottedConnector />
      {label ? (
        <span className="text-label text-center text-[var(--color-text-secondary)]">
          {label}
        </span>
      ) : (
        <span aria-hidden className="h-4" />
      )}
    </div>
  );
}

function DottedConnector() {
  return (
    <span
      aria-hidden
      className="flex w-full min-w-0 items-center justify-between"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="inline-block h-0.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-soft)]"
        />
      ))}
    </span>
  );
}

function DetailsCard({ car }: { car: SavedCar }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label="Route summary"
    >
      <div className="grid grid-cols-3 items-start gap-3">
        <DetailMetric
          icon={<ClockIcon size={14} />}
          label="Walk time"
          value={car.walkTime}
        />
        <DetailMetric
          icon={<FootstepsIcon size={14} />}
          label="Distance"
          value={car.distance}
        />
        <DetailMetric
          icon={<CarIcon size={14} />}
          label="Space"
          value={car.space}
        />
      </div>
    </Card>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-text-secondary)]">
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </span>
      <MetricBlock value={value} label={label} hideLabel align="left" />
    </div>
  );
}

function ParkingHelperNote() {
  return (
    <p className="inline-flex items-start gap-2 text-label text-[var(--color-text-secondary)]">
      <span aria-hidden className="mt-0.5 text-[var(--color-action-teal)]">
        <InfoIcon size={12} />
      </span>
      <span>
        Take the skybridge from the terminal, then continue to {CAR.level},
        zone B.
      </span>
    </p>
  );
}

function StickyNavigateCTA({ car }: { car: SavedCar }) {
  return (
    <div
      className="sticky bottom-0 z-10 px-6 pt-6"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
        background:
          "linear-gradient(to bottom, transparent 0%, var(--color-bg) 60%)",
      }}
    >
      <Button
        href={"/map/live-navigation" as Route}
        tone="teal"
        leadingIcon={<NavigationIcon size={16} />}
        aria-label={`Navigate to my car at space ${car.space}`}
      >
        Navigate to My Car
      </Button>
    </div>
  );
}
