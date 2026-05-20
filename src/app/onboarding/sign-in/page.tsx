"use client";

import { AppShell } from "@/components/AppShell";
import { AuthOption, AuthOptionGroup } from "@/components/AuthOption";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { OnboardingStepHeader } from "@/components/OnboardingStepHeader";
import {
  AeroplanBadge,
  AppleIcon,
  ArrowRightIcon,
  GoogleIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { saveOnboardingState } from "@/data/onboarding-state";

export default function SignInPage() {
  const handleGuestContinue = () => {
    saveOnboardingState({ authMode: "guest" });
  };

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <OnboardingStepHeader
          current={2}
          total={4}
          backHref="/"
          backLabel="Back to welcome"
        />

        <section className="mt-8 flex flex-col gap-4">
          <Eyebrow>Personal Concierge</Eyebrow>
          <Heading size="title">
            Keep your
            <br />
            <em>trip ready.</em>
          </Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Sign in to sync flights, boarding passes, and preferences.
          </p>
        </section>

        <section className="mt-8">
          <AuthOptionGroup>
            <AuthOption
              leading={<AppleIcon size={18} />}
              label="Continue with Apple"
              badge="Soon"
              disabled
            />
            <AuthOption
              leading={<GoogleIcon size={18} />}
              label="Continue with Google"
              badge="Soon"
              disabled
            />
            <AuthOption
              leading={<AeroplanBadge size={20} />}
              label="Continue with Aeroplan"
              badge="Soon"
              disabled
            />
            <AuthOption
              leading={<MailIcon size={18} />}
              label="Continue with email"
              badge="Soon"
              disabled
            />
          </AuthOptionGroup>
        </section>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8 pb-2">
          <Button
            href="/onboarding/preferences"
            variant="primary"
            trailingIcon={<ArrowRightIcon size={16} />}
            onClick={handleGuestContinue}
          >
            Continue as guest
          </Button>
          <p className="inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
            <ShieldCheckIcon size={12} />
            <span>Stored on your device · Never shared with airlines</span>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
