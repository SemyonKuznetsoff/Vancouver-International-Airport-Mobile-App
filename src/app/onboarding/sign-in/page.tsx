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

        <section className="mt-8 flex flex-col gap-4">
          <Eyebrow>Personal Concierge</Eyebrow>
          <Heading size="title">
            Keep your
            <br />
            <em>trip ready.</em>
          </Heading>
          <p className="text-[14px] leading-[1.55] text-[var(--color-text-secondary)]">
            Sign in to sync flights, boarding passes, and preferences.
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
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Or
          </span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <button
          type="button"
          aria-label="Sign in with email"
          className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-white/80"
        >
          <MailIcon size={16} />
          <span>Sign in with email</span>
        </button>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8 pb-2">
          <Button variant="ghost" href="/onboarding/permissions">
            Continue as guest
          </Button>
          <p className="inline-flex items-center gap-1.5 text-[11px] leading-[1.5] tracking-[0.025em] text-[var(--color-text-secondary)]">
            <ShieldCheckIcon size={12} />
            <span>Stored on your device · Never shared with airlines</span>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
