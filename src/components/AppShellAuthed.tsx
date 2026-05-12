import { AuroraBackground } from "./AuroraBackground";
import { BottomTabBar } from "./BottomTabBar";

type Tone = "aurora" | "warm";

type AppShellAuthedProps = {
  children: React.ReactNode;
  /**
   * Optional badge map forwarded to BottomTabBar.
   */
  badges?: React.ComponentProps<typeof BottomTabBar>["badges"];
  /**
   * Render without the tab bar when a screen needs a clean shell
   * temporarily (e.g. an onboarding-style flow inside the authed app).
   */
  hideTabBar?: boolean;
  /**
   * Page surface tone.
   *
   * - `aurora` (default) — cool mist page surface with the aurora
   *   radial gradients painted underneath. Used by Profile, Saved
   *   Trips, and future aurora-friendly screens.
   * - `warm` — opaque warm-cream page surface (`--color-bg-warm`), no
   *   aurora. Used by Home (No-Trip) per the Figma direction. Pair
   *   with `<Card tone="solid">` for inner surfaces.
   *
   * Sets `--color-bg-page` on the shell wrapper so the floating
   * `<BottomTabBar>` fades to the correct page colour.
   */
  tone?: Tone;
};

/**
 * App shell for the logged-in main app. Like `AppShell` but reserves a
 * fixed-bottom region for the floating `<BottomTabBar>` and lets the
 * main content scroll internally above the bar.
 *
 * Differences from `AppShell` (onboarding):
 * - Outer container uses `h-dvh` so the shell is exactly viewport
 *   height and content scrolls inside `<main>`.
 * - `<main>` reserves bottom padding so the last content block clears
 *   the floating nav. Consumers must not re-add bottom safe-area
 *   padding.
 * - Top inset is padded via `env(safe-area-inset-top)`.
 *
 * **Do not use this on onboarding screens.** Onboarding uses
 * `<AppShell>` (no tab bar, longer-form layout, `min-h-dvh`).
 */
export function AppShellAuthed({
  children,
  badges,
  hideTabBar = false,
  tone = "aurora",
}: AppShellAuthedProps) {
  const bgPage = tone === "warm" ? "var(--color-bg-warm)" : "var(--color-bg)";
  const wrapperBgClass =
    tone === "warm" ? "bg-[var(--color-bg-warm)]" : "";

  return (
    <div
      className={`relative mx-auto flex h-dvh w-full max-w-[430px] flex-col ${wrapperBgClass}`.trim()}
      style={{ ["--color-bg-page" as string]: bgPage }}
    >
      {tone === "aurora" ? <AuroraBackground /> : null}
      <main
        className="flex flex-1 flex-col overflow-y-auto"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
          paddingBottom: hideTabBar
            ? "max(env(safe-area-inset-bottom), 16px)"
            : "calc(96px + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </main>
      {hideTabBar ? null : <BottomTabBar badges={badges} />}
    </div>
  );
}
