import { AppShell } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FeatureList, type Feature } from "@/components/FeatureList";
import { Heading } from "@/components/Heading";
import { ArrowRightIcon } from "@/components/icons";

const features: Feature[] = [
  {
    title: "Personalized trip guidance",
    description: "From curbside to your gate.",
  },
  {
    title: "Indoor wayfinding",
    description: "Lounges, dining, security — mapped.",
  },
  {
    title: "Live flight intelligence",
    description: "Boarding, gates, delays in real time.",
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
            <em>effortlessly guided.</em>
          </Heading>
          <p className="text-[14px] leading-[1.55] text-[var(--color-text-secondary)]">
            A premium companion through YVR — calmly guiding you from arrival
            to takeoff.
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
