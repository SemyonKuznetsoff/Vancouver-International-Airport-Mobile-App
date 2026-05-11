import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { PermissionCard } from "@/components/PermissionCard";
import {
  ArrowLeftIcon,
  BellIcon,
  LocationPinIcon,
  LockIcon,
} from "@/components/icons";

export default function PermissionsPage() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <header className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/sign-in"
            aria-label="Go back"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-white/70"
          >
            <ArrowLeftIcon size={16} />
          </Link>
          <span className="text-[11px] uppercase leading-[1.5] tracking-[0.22em] text-[var(--color-text-secondary)]">
            Step 3 of 3
          </span>
        </header>

        <section className="mt-12 flex flex-col gap-4">
          <Eyebrow>Smart Guidance</Eyebrow>
          <Heading className="!text-[30px] !leading-[1.1]">
            Two thoughtful
            <br />
            <em>permissions.</em>
          </Heading>
          <p className="text-[14px] leading-[1.55] text-[var(--color-text-secondary)]">
            Used only to make your time at YVR calmer. You stay in control —
            change either at any time.
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-3">
          <PermissionCard
            icon={<LocationPinIcon size={18} />}
            title="Terminal Wayfinding"
            description="Turn-by-turn indoor directions to your gate, lounges, and dining — only used while you’re at YVR."
            footerLabel="Location · While using app"
            toggleAriaLabel="Toggle terminal wayfinding"
            defaultOn
          />
          <PermissionCard
            icon={<BellIcon size={18} />}
            title="Live Flight Alerts"
            description="Boarding times, gate changes, and security wait times delivered the moment they update."
            footerLabel="Notifications"
            toggleAriaLabel="Toggle live flight alerts"
            defaultOn
          />
        </section>

        <p className="mt-auto inline-flex items-start gap-2 pt-8 pb-2 text-[11px] leading-[1.5] text-[var(--color-text-secondary)]">
          <LockIcon size={12} />
          <span>Your location and notifications stay on this device.</span>
        </p>
      </main>
    </AppShell>
  );
}
