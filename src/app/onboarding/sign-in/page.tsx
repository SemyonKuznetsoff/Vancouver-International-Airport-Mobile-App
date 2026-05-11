import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AuthOption, AuthOptionGroup } from "@/components/AuthOption";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  AeroplanBadge,
  AppleIcon,
  GoogleIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@/components/icons";

export default function SignInPage() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <ScreenHeader backHref="/" step="Step 2 of 3" />

        <section className="mt-12 flex flex-col gap-4">
          <Eyebrow>Personal Concierge</Eyebrow>
          <Heading size="title">
            Continue your
            <br />
            <em>journey.</em>
          </Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Sign in to sync trips, boarding passes, and preferences.
          </p>
        </section>

        <section className="mt-8">
          <AuthOptionGroup>
            <AuthOption
              leading={<AppleIcon size={18} />}
              label="Continue with Apple"
            />
            <AuthOption
              leading={<GoogleIcon size={18} />}
              label="Continue with Google"
            />
            <AuthOption
              leading={<AeroplanBadge size={20} />}
              label="Continue with Aeroplan"
            />
          </AuthOptionGroup>
        </section>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-micro font-normal uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Or
          </span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <Button
          variant="secondary"
          leadingIcon={<MailIcon size={16} />}
          aria-label="Sign in with email"
          className="mt-4"
        >
          Sign in with email
        </Button>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8 pb-2">
          <Link
            href="/onboarding/permissions"
            className="text-body-sm text-[var(--color-text-primary)] underline underline-offset-2"
          >
            Continue as guest
          </Link>
          <p className="inline-flex items-center gap-1.5 text-label tracking-[0.025em] text-[var(--color-text-secondary)]">
            <ShieldCheckIcon size={12} />
            <span>Secured by YVR · Your data stays private</span>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
