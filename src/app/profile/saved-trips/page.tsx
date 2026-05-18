import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { AirportCodePair } from "@/components/AirportCodePair";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { GateDisplay } from "@/components/GateDisplay";
import { Heading } from "@/components/Heading";
import { IconTile } from "@/components/IconTile";
import { LiveIndicator } from "@/components/LiveIndicator";
import { MetricBlock } from "@/components/MetricBlock";
import { RouteTimeline } from "@/components/RouteTimeline";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  ClockIcon,
  LocationPinIcon,
  NavigationIcon,
  PlaneIcon,
} from "@/components/icons";

type Endpoint = {
  code: string;
  city: string;
  time: string;
  offset?: string;
};

type PrimaryTrip = {
  airline: string;
  flightNumber: string;
  status: "On time" | "Delayed" | "Boarding" | "Cancelled";
  origin: Endpoint;
  destination: Endpoint;
  duration: string;
  gate: string;
  terminal: string;
  boarding: string;
  terminalName: string;
};

type SavedJourney = {
  id: string;
  airline: string;
  flightNumber: string;
  status: "Scheduled" | "Boarding" | "On time" | "Delayed";
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  terminal?: string;
  gate: string;
};

type PreferenceTile = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

const primaryTrip: PrimaryTrip = {
  airline: "Air Canada",
  flightNumber: "Flight AC 892",
  status: "On time",
  origin: { code: "YVR", city: "Vancouver", time: "14:35" },
  destination: { code: "NRT", city: "Tokyo Narita", time: "17:20", offset: "+1" },
  duration: "10h 45 · Nonstop",
  gate: "D73",
  terminal: "Intl",
  boarding: "13:50",
  terminalName: "International",
};

const savedJourneys: SavedJourney[] = [
  {
    id: "nh110",
    airline: "All Nippon",
    flightNumber: "NH 110",
    status: "Scheduled",
    origin: "NRT",
    destination: "YVR",
    departTime: "10:45",
    arriveTime: "05:30",
    terminal: "Intl",
    gate: "—",
  },
];

const preferences: PreferenceTile[] = [
  {
    id: "seat",
    label: "Preferred seat",
    value: "Window · Economy",
    icon: <BookmarkIcon size={16} />,
  },
  {
    id: "alerts",
    label: "Alert timing",
    value: "30 min before boarding",
    icon: <BellIcon size={16} />,
  },
  {
    id: "terminal",
    label: "Home terminal",
    value: "International · YVR",
    icon: <LocationPinIcon size={16} />,
  },
  {
    id: "route",
    label: "Frequent route",
    value: "Vancouver ↔ Tokyo",
    icon: <PlaneIcon size={16} />,
  },
];

const savedPlaces = ["Caffe Artigiano", "Maple Leaf Lounge", "Parkade P1"];

export default function SavedTripsPage() {
  return (
    <AppShellAuthed activeHref="/profile">
      <SavedTripsHero />
      <div className="flex flex-col gap-8 px-6 pt-8 pb-8">
        <PrimaryTripCard trip={primaryTrip} />
        <SavedJourneysSection journeys={savedJourneys} />
        <TravelIntelligenceSection
          preferences={preferences}
          savedPlaces={savedPlaces}
        />
      </div>
    </AppShellAuthed>
  );
}

function SavedTripsHero() {
  return (
    <header
      aria-label="Saved trips"
      className="relative overflow-hidden px-6 pt-2 pb-8 text-[var(--color-surface-hero-fg)]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/profile"
          aria-label="Back to Profile"
          className="inline-flex h-11 items-center gap-1 rounded-full pr-3 text-body-sm text-[var(--color-surface-hero-fg)] transition-colors duration-150 hover:text-[var(--color-surface-hero-fg-muted)]"
        >
          <span
            aria-hidden
            className="inline-flex h-11 w-11 items-center justify-center"
          >
            <ArrowLeftIcon size={16} />
          </span>
          <span>Profile</span>
        </Link>
        <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 py-1">
          <LiveIndicator
            status="live"
            pulse
            label="Live sync · just now"
            className="text-[var(--color-surface-hero-fg-muted)]"
          />
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Eyebrow tone="hero">Your Travel Vault</Eyebrow>
        <Heading size="title" tone="hero">
          Saved Trips
        </Heading>
        <p className="text-body text-[var(--color-surface-hero-fg-muted)]">
          Welcome back, Alex — your next journey is ready.
        </p>
      </div>
    </header>
  );
}

function PrimaryTripCard({ trip }: { trip: PrimaryTrip }) {
  const statusTone =
    trip.status === "On time"
      ? "success"
      : trip.status === "Boarding"
        ? "warning"
        : trip.status === "Delayed"
          ? "danger"
          : "neutral";

  return (
    <Card as="article" padding="none" aria-label="Primary saved trip">
      <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconTile size={36} className="bg-[var(--color-surface-tile)]">
            <span className="text-[var(--color-text-primary)]">
              <PlaneIcon size={16} />
            </span>
          </IconTile>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-body-sm font-semibold text-[var(--color-text-primary)]">
              {trip.airline}
            </p>
            <p className="truncate text-label text-[var(--color-text-secondary)]">
              {trip.flightNumber}
            </p>
          </div>
        </div>
        <StatusPill tone={statusTone} size="sm" leadingDot>
          {trip.status}
        </StatusPill>
      </header>

      <div className="border-t border-[var(--color-border-soft)] px-4 pt-4">
        <RouteTimeline
          origin={trip.origin}
          destination={trip.destination}
          duration={trip.duration}
        />
      </div>

      <div className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-[var(--radius-chip)] bg-[var(--color-surface-tile)] px-4 py-3">
        <GateDisplay gate={trip.gate} terminal={trip.terminal} />
        <span aria-hidden className="h-6 w-px bg-[var(--color-border-soft)]" />
        <MetricBlock label="Boarding" value={trip.boarding} align="left" />
        <span aria-hidden className="h-6 w-px bg-[var(--color-border-soft)]" />
        <MetricBlock
          label="Terminal"
          value={trip.terminalName}
          align="left"
        />
      </div>

      <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
        <Button
          variant="primary"
          href="/flights/detail"
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label="View trip details for AC 892"
        >
          View trip
        </Button>
        <Button
          variant="ghost"
          href="/flights/detail"
          leadingIcon={<NavigationIcon size={16} />}
          aria-label="Navigate to gate for AC 892"
        >
          Navigate to gate
        </Button>
      </div>
    </Card>
  );
}

function SavedJourneysSection({ journeys }: { journeys: SavedJourney[] }) {
  return (
    <section aria-labelledby="saved-journeys-heading" className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <h2
          id="saved-journeys-heading"
          className="text-eyebrow uppercase text-[var(--color-text-secondary)]"
        >
          Saved Journeys
        </h2>
        <span className="text-label text-[var(--color-text-muted)]">
          {journeys.length} saved
        </span>
      </header>

      <ul className="flex flex-col gap-3">
        {journeys.map((journey) => (
          <li key={journey.id}>
            <SavedJourneyCard journey={journey} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SavedJourneyCard({ journey }: { journey: SavedJourney }) {
  return (
    <Card
      as="article"
      padding="none"
      aria-label={`Saved journey ${journey.airline} ${journey.flightNumber}`}
      className="flex items-center gap-3 px-4 py-4"
    >
      <IconTile size={40} className="bg-[var(--color-surface-tile)]">
        <span className="text-[var(--color-text-primary)]">
          <PlaneIcon size={16} />
        </span>
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-body-sm font-semibold text-[var(--color-text-primary)]">
            {journey.airline} · {journey.flightNumber}
          </p>
          <StatusPill tone="neutral" size="sm">
            {journey.status}
          </StatusPill>
        </div>
        <AirportCodePair origin={journey.origin} destination={journey.destination} />
        <p className="inline-flex items-center gap-3 text-label text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <ClockIcon size={12} />
            <span>
              {journey.departTime} → {journey.arriveTime}
            </span>
          </span>
          <span aria-hidden>·</span>
          <GateDisplay
            size="compact"
            gate={journey.gate}
            terminal={journey.terminal}
          />
        </p>
      </div>
    </Card>
  );
}

function TravelIntelligenceSection({
  preferences,
  savedPlaces,
}: {
  preferences: PreferenceTile[];
  savedPlaces: string[];
}) {
  return (
    <section
      aria-labelledby="travel-intelligence-heading"
      className="flex flex-col gap-4"
    >
      <header className="flex items-end justify-between gap-3">
        <h2
          id="travel-intelligence-heading"
          className="text-eyebrow uppercase text-[var(--color-text-secondary)]"
        >
          Travel Intelligence
        </h2>
        <span className="text-label text-[var(--color-text-muted)]">
          Personalized
        </span>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        {preferences.map((pref) => (
          <li key={pref.id}>
            <PreferenceTile preference={pref} />
          </li>
        ))}
      </ul>

      <SavedPlacesCard places={savedPlaces} />
    </section>
  );
}

function PreferenceTile({ preference }: { preference: PreferenceTile }) {
  return (
    <Card
      as="article"
      padding="compact"
      aria-label={preference.label}
      className="flex h-full flex-col gap-3"
    >
      <IconTile size={32} className="bg-[var(--color-surface-tile)]">
        <span className="text-[var(--color-text-primary)]">{preference.icon}</span>
      </IconTile>
      <div className="flex flex-col gap-1">
        <p className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
          {preference.label}
        </p>
        <p className="text-body-sm text-[var(--color-text-primary)]">
          {preference.value}
        </p>
      </div>
    </Card>
  );
}

function SavedPlacesCard({ places }: { places: string[] }) {
  return (
    <Card as="article" aria-label="Saved places">
      <div className="flex items-center gap-3">
        <IconTile size={36} className="bg-[var(--color-surface-tile)]">
          <span className="text-[var(--color-text-primary)]">
            <BookmarkIcon size={16} />
          </span>
        </IconTile>
        <div className="flex flex-col gap-1">
          <p className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
            Saved places
          </p>
          <p className="text-body-sm text-[var(--color-text-primary)]">
            {places.length} favourites at YVR
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {places.map((place) => (
          <li
            key={place}
            className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] px-3 py-1 text-label text-[var(--color-text-primary)]"
          >
            {place}
          </li>
        ))}
      </ul>
    </Card>
  );
}
