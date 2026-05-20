"use client";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { OnboardingStepHeader } from "@/components/OnboardingStepHeader";
import { PermissionCard } from "@/components/PermissionCard";
import {
  ArrowRightIcon,
  BellIcon,
  LocationPinIcon,
  LockIcon,
} from "@/components/icons";
import {
  completeOnboarding,
  saveOnboardingState,
} from "@/data/onboarding-state";

export default function PermissionsPage() {
  const handleWayfindingChange = (next: boolean) => {
    saveOnboardingState({ wantsWayfinding: next });
  };

  const handleNotificationsChange = (next: boolean) => {
    saveOnboardingState({ wantsNotifications: next });
  };

  const handleStart = () => {
    completeOnboarding();
  };

  const handleSetUpLater = () => {
    completeOnboarding();
  };

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <OnboardingStepHeader
          current={4}
          total={4}
          backHref="/onboarding/preferences"
          backLabel="Back to preferences"
        />

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
            onChange={handleWayfindingChange}
          />
          <PermissionCard
            icon={<BellIcon size={18} />}
            title="Keep me updated"
            description="Gate changes, boarding reminders, delays, and security wait alerts."
            footerLabel="Notifications"
            toggleAriaLabel="Enable flight updates"
            defaultOn={false}
            onChange={handleNotificationsChange}
          />
        </section>

        <p className="mt-8 inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
          <LockIcon size={12} />
          <span>We&apos;ll ask for device permission when needed.</span>
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
          <Button
            href="/home"
            variant="primary"
            trailingIcon={<ArrowRightIcon size={16} />}
            aria-label="Start using YVR"
            onClick={handleStart}
          >
            Start using YVR
          </Button>
          <Button href="/home" variant="ghost" onClick={handleSetUpLater}>
            Set up later
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
