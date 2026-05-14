type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function strokeProps({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

function fillProps({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function PlaneIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M10.5 13.5 3 11l1.5-2 8 1.5L18 4.5a2 2 0 1 1 2 2L14 12l1.5 8-2 1.5-2.5-7.5-3 3v3l-1.5 1-1.5-3-3-1.5 1-1.5h3l3-3Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-4V14h-7v7.5h-4A1.5 1.5 0 0 1 3 20Z" />
    </svg>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function ServicesIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 17V12l2-5h10l2 5v5" />
      <path d="M3 17h18" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 11 7.6-4M8.2 13l7.6 4" />
    </svg>
  );
}

export function FootstepsIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M7 4c2 0 3 1.5 3 3.5 0 2-1.2 4-3 4.5-1.4.4-2.5-.4-2.5-2 0-2 1-6 2.5-6Z" />
      <path d="M16 12c2 0 3 1.5 3 3.5 0 2-1.2 4-3 4.5-1.4.4-2.5-.4-2.5-2 0-2 1-6 2.5-6Z" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LocationPinIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UmbrellaIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 12a9 9 0 0 1 18 0Z" />
      <path d="M12 12v6.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16M9 4v4M15 4v4" />
    </svg>
  );
}

export function ArrowsVerticalIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M8 4v16M5 7l3-3 3 3" />
      <path d="M16 20V4M13 17l3 3 3-3" />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="6" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 21V6l7-3 7 3v15" />
      <path d="M3 21h18" />
      <path d="M9 9h0M9 13h0M9 17h0M15 9h0M15 13h0M15 17h0" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ParkingIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 17V8h3.5a2.5 2.5 0 0 1 0 5H10" />
    </svg>
  );
}

export function TrainIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="6" y="3" width="12" height="14" rx="3" />
      <path d="M6 12h12M9 7h6" />
      <circle cx="9.5" cy="14.5" r="0.6" />
      <circle cx="14.5" cy="14.5" r="0.6" />
      <path d="m8 20 2-3M16 20l-2-3" />
    </svg>
  );
}

export function ScanIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </svg>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="5" r="1.5" />
      <path d="M12 8v4l3 .5M12 12l-2 5M15 12.5 17 17" />
    </svg>
  );
}

export function DiningIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M7 3v8M10 3v8M7 11v10M10 11h0M14 11V3M17 3c1.5 0 3 1.5 3 4v4h-3M17 11v10" />
    </svg>
  );
}

export function SignpostIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 3v18" />
      <path d="M4 7h12l3 2.5-3 2.5H4Z" />
      <path d="M20 14H8l-3 2.5L8 19h12Z" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.27 16.97l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.03 4.27l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}

export function SyncIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 4v4h-4" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 20v-4h4" />
    </svg>
  );
}

export function NavigationIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 11 21 4l-7 17-2-8-9-2Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3l-5.5 2.9 1.1-6.2L3 9.6l6.3-.9Z" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 9a14 14 0 0 1 18 0" />
      <path d="M6 12.5a10 10 0 0 1 12 0" />
      <path d="M9 16a6 6 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShowerIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 11h14" />
      <path d="M12 11V5a2 2 0 0 1 2-2c1.7 0 3 1.3 3 3" />
      <path d="M8 14v.5M11 15v1M14 14v.5M8.5 17.5v.5M12 18v1M15.5 17.5v.5" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14c2.8 0 5 2.2 5 5" />
    </svg>
  );
}

export function IdCardIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M5 17c.5-1.6 2-2.5 4-2.5s3.5.9 4 2.5M15 10h4M15 14h3" />
    </svg>
  );
}

export function CreditCardIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h12M20 17h0" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M6 4h12v17l-6-4-6 4Z" />
    </svg>
  );
}

export function LuggageIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="6" y="7" width="12" height="13" rx="2" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
      <path d="M10 10v7M14 10v7" />
    </svg>
  );
}

export function ChatBubbleIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6a2.5 2.5 0 0 1-2.5 2.5h-5L7 19v-3.5A2.5 2.5 0 0 1 5 13Z" />
    </svg>
  );
}

export function LifeBuoyIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m4.9 4.9 4.2 4.2M14.9 14.9l4.2 4.2M19.1 4.9l-4.2 4.2M9.1 14.9l-4.2 4.2" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <svg {...fillProps(props)} fill="currentColor">
      <path d="M16.365 12.74c-.026-2.59 2.117-3.83 2.213-3.892-1.205-1.762-3.082-2.003-3.75-2.03-1.596-.16-3.115.94-3.926.94-.81 0-2.064-.918-3.39-.892-1.742.026-3.35 1.014-4.247 2.575-1.81 3.139-.464 7.78 1.298 10.323.86 1.243 1.886 2.642 3.232 2.59 1.297-.053 1.788-.838 3.358-.838 1.57 0 2.012.838 3.39.812 1.4-.026 2.286-1.27 3.143-2.518.99-1.446 1.398-2.842 1.423-2.914-.031-.014-2.731-1.05-2.744-4.156ZM13.83 5.27c.717-.87 1.2-2.08 1.07-3.27-1.033.043-2.286.687-3.025 1.557-.664.77-1.245 1.998-1.087 3.168 1.152.09 2.325-.587 3.042-1.455Z" />
    </svg>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <svg {...fillProps(props)}>
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.71-.064-1.39-.182-2.045H12v3.868h5.382a4.602 4.602 0 0 1-1.995 3.018v2.51h3.227c1.887-1.74 2.986-4.305 2.986-7.351Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.614-2.422l-3.227-2.51c-.895.6-2.04.954-3.387.954-2.605 0-4.81-1.76-5.598-4.124H3.072v2.59A9.997 9.997 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.402 13.898A5.997 5.997 0 0 1 6.09 12c0-.66.113-1.302.311-1.898v-2.59H3.072A9.997 9.997 0 0 0 2 12c0 1.614.386 3.14 1.072 4.488l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.977c1.47 0 2.787.506 3.825 1.498l2.866-2.866C16.96 2.99 14.695 2 12 2 8.087 2 4.71 4.245 3.072 7.512l3.33 2.59C7.19 7.737 9.395 5.977 12 5.977Z"
      />
    </svg>
  );
}

/**
 * Decorative gold/bronze "smart-chip" badge that evokes the chip on a
 * physical parking access card. Used inside the dark teal Parking
 * Reserved pass card, beside the "Scan at parking barrier" label, to
 * give the pass a tangible, premium feel. Multicolour brand decoration —
 * sits alongside `AppleIcon` / `GoogleIcon` / `AeroplanBadge` and is
 * allow-listed for raw hex in `scripts/check-design-system.mjs`.
 */
export function ParkingPassChip({ size = 24 }: { size?: number }) {
  const stripe: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 1,
    flex: 1,
  };
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 flex-col items-stretch gap-0.5 p-1"
      style={{
        width: size,
        height: size * 0.75,
        borderRadius: 6,
        backgroundImage: "linear-gradient(143deg, #d6b97a 0%, #8c6e3a 100%)",
      }}
    >
      <span className="flex flex-1 gap-0.5">
        <span style={stripe} />
        <span style={stripe} />
        <span style={stripe} />
      </span>
      <span className="flex flex-1 gap-0.5">
        <span style={stripe} />
        <span style={stripe} />
        <span style={stripe} />
      </span>
    </span>
  );
}

/**
 * Aeroplan-style circular avatar badge with an "A" monogram.
 * Uses a teal gradient consistent with the YVR palette.
 */
export function AeroplanBadge({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{
        width: size,
        height: size,
        backgroundImage:
          "linear-gradient(131deg, #7FD8C4 0%, #0A5A66 100%)",
      }}
    >
      A
    </span>
  );
}

/**
 * Calm three-quarter arc spinner. Drives the loading state on `<Button>`.
 *
 * Uses Tailwind's `animate-spin` which the global
 * `prefers-reduced-motion: reduce` rule collapses to ~0ms duration —
 * the arc renders as a static SVG in that mode, still readable as a
 * loading indicator.
 */
export function SpinnerIcon(props: IconProps) {
  const { className = "animate-spin", ...rest } = props;
  return (
    <svg {...strokeProps({ ...rest, className })}>
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
