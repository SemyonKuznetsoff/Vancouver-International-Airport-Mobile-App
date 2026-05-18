import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { PermissionCard } from "@/components/PermissionCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  ArrowRightIcon,
  BellIcon,
  LocationPinIcon,
  LockIcon,
} from "@/components/icons";

export default function PermissionsPage() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <ScreenHeader backHref="/onboarding/sign-in" step="Step 4 of 4" />

        <section className="mt-8 flex flex-col gap-4">
          <Eyebrow>Smart Guidance</Eyebrow>
          <Heading size="title">
            Set up helpful
            <br />
            <em>alerts.</em>
          </Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Turn these on for smoother guidance. You can change them anytime.
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <PermissionCard
            icon={<LocationPinIcon size={18} />}
            title="Find my way"
            description="Step-by-step directions to gates, lounges, food, and services."
            footerLabel="Location while using app"
            toggleAriaLabel="Enable wayfinding guidance"
            defaultOn={false}
          />
          <PermissionCard
            icon={<BellIcon size={18} />}
            title="Keep me updated"
            description="Gate changes, boarding reminders, delays, and security wait alerts."
            footerLabel="Notifications"
            toggleAriaLabel="Enable flight updates"
            defaultOn={false}
          />
        </section>

        <p className="mt-8 inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
          <LockIcon size={12} />
          <span>Your location and notifications stay on this device.</span>
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
          <Button
            href="/"
            variant="primary"
            trailingIcon={<ArrowRightIcon size={16} />}
            aria-label="Start using YVR"
          >
            Start using YVR
          </Button>
          <Button href="/" variant="ghost">
            Set up later
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
