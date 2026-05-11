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
        <ScreenHeader backHref="/onboarding/sign-in" step="Step 3 of 3" />

        <section className="mt-12 flex flex-col gap-4">
          <Eyebrow>Smart Guidance</Eyebrow>
          <Heading size="title">
            Two helpful
            <br />
            <em>permissions.</em>
          </Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Turn them on for smoother guidance. You can change them anytime.
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-3">
          <PermissionCard
            icon={<LocationPinIcon size={18} />}
            title="Indoor Wayfinding"
            description="Step-by-step directions to gates, lounges, dining, and services."
            footerLabel="Location while using app"
            toggleAriaLabel="Toggle indoor wayfinding"
            defaultOn
          />
          <PermissionCard
            icon={<BellIcon size={18} />}
            title="Flight Alerts"
            description="Gate changes, boarding times, delays, and security wait updates."
            footerLabel="Notifications"
            toggleAriaLabel="Toggle flight alerts"
            defaultOn
          />
        </section>

        <p className="mt-8 inline-flex items-start gap-2 text-label text-[var(--color-text-secondary)]">
          <LockIcon size={12} />
          <span>Your location and notifications stay on this device.</span>
        </p>

        <div className="mt-auto pt-8 pb-2">
          <Button
            href="/"
            variant="primary"
            trailingIcon={<ArrowRightIcon size={16} />}
            aria-label="Start using YVR"
          >
            Start using YVR
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
