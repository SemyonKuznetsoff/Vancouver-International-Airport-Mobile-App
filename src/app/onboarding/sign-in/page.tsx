import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AuthOption, AuthOptionGroup } from "@/components/AuthOption";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import {
  AeroplanBadge,
  AppleIcon,
  ArrowLeftIcon,
  GoogleIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@/components/icons";

export default function SignInPage() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <header className="flex items-center justify-between pt-2">
          <Link
            href="/"
            aria-label="Go back"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-white/70"
          >
            <ArrowLeftIcon size={16} />
          </Link>
          <span className="text-[11px] uppercase leading-[1.5] tracking-[0.22em] text-[var(--color-text-secondary)]">
            Step 2 of 3
          </span>
        </header>

        <section className="mt-12 flex flex-col gap-4">
          <Eyebrow>Personal Concierge</Eyebrow>
          <Heading className="!text-[30px] !leading-[1.1]">
            Welcome back to
            <br />
            <em>your journey.</em>
          </Heading>
          <p className="text-[14px] leading-[1.55] text-[var(--color-text-secondary)]">
            Sign in to sync flights, boarding passes, and saved preferences
            across devices.
          </p>
        </section>

        <section className="mt-8">
          <AuthOptionGroup>
            <AuthOption
              leading={<AppleIcon size={18} />}
              label="Continue with Apple"
              badge="Fastest"
            />
            <AuthOption
              leading={<GoogleIcon size={18} />}
              label="Continue with Google"
            />
            <AuthOption
              leading={<AeroplanBadge size={20} />}
              label="Continue with Aeroplan"
              badge="Sync miles"
            />
          </AuthOptionGroup>
        </section>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--color-border-hairline)]" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Or
          </span>
          <span className="h-px flex-1 bg-[var(--color-border-hairline)]" />
        </div>

        <button
          type="button"
          aria-label="Sign in with email"
          className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-elevated)] text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-white/80"
        >
          <MailIcon size={16} />
          <span>Sign in with email</span>
        </button>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8 pb-2">
          <Link
            href="/onboarding/permissions"
            className="text-[13px] font-medium leading-[1.5] text-[var(--color-text-primary)] underline underline-offset-2"
          >
            Continue as guest
          </Link>
          <p className="inline-flex items-center gap-1.5 text-[11px] leading-[1.5] tracking-[0.025em] text-[var(--color-text-secondary)]">
            <ShieldCheckIcon size={12} />
            <span>Secured by YVR · We never share your data</span>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
