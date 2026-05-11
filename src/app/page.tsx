import { AppShell } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FeatureList, type Feature } from "@/components/FeatureList";
import { Heading } from "@/components/Heading";
import { ArrowRightIcon } from "@/components/icons";

const features: Feature[] = [
  {
    title: "Know what's next",
    description: "Flight, gate, and timing in one place.",
  },
  {
    title: "Find places faster",
    description: "Gates, lounges, food, and services.",
  },
  {
    title: "Stay updated",
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
          <p className="text-[14px] leading-[1.55] text-[var(--color-text-secondary)]">
            YVR helps you move through the airport with less guesswork.
          </p>
        </section>

        <section className="mt-8">
          <FeatureList items={features} />
        </section>

        <div className="min-h-8 max-h-16 flex-grow" aria-hidden />

        <div className="flex flex-col gap-3 pb-2">
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
