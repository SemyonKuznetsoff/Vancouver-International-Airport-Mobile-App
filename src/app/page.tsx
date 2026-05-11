import { AppShell } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FeatureList, type Feature } from "@/components/FeatureList";
import { Heading } from "@/components/Heading";
import { ArrowRightIcon } from "@/components/icons";

const features: Feature[] = [
  {
    title: "Trip guidance",
    description: "From curbside to your gate.",
  },
  {
    title: "Indoor wayfinding",
    description: "Find gates, lounges, dining, and services.",
  },
  {
    title: "Live updates",
    description: "Boarding, delays, and gate changes.",
  },
];

export default function OnboardingPage() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <header className="pt-2">
          <BrandMark />
        </header>

        <section className="mt-8 flex flex-col gap-4">
          <Eyebrow>Welcome to Vancouver</Eyebrow>
          <Heading>
            Your journey,
            <br />
            <em>calmly guided.</em>
          </Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Flights, maps, gates, and alerts in one quiet place.
          </p>
        </section>

        <section className="mt-8">
          <FeatureList items={features} />
        </section>

        <div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
          <Button
            href="/onboarding/sign-in"
            variant="primary"
            trailingIcon={<ArrowRightIcon size={16} />}
            aria-label="Begin your journey"
          >
            Begin your journey
          </Button>
          <Button href="/onboarding/sign-in" variant="ghost">
            I already have an account
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
