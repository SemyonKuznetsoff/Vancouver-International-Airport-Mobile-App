import { AuroraBackground } from "./AuroraBackground";
import { BottomTabBar } from "./BottomTabBar";

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
};

/**
 * App shell for the logged-in main app. Like `AppShell` but reserves a
 * fixed-bottom region for `<BottomTabBar>` and lets the main content
 * scroll internally above the bar.
 *
 * Differences from `AppShell` (onboarding):
 * - Outer container uses `h-dvh` (not `min-h-dvh`) so the shell is
 *   exactly viewport height and content scrolls inside `<main>`.
 * - Bottom area is owned by `<BottomTabBar>`; consumers do not add
 *   their own bottom padding for the home indicator — the tab bar
 *   handles safe-area itself.
 * - Top inset still padded via `env(safe-area-inset-top)` so the
 *   status bar doesn't overlap content.
 *
 * **Do not use this on onboarding screens.** Onboarding uses
 * `<AppShell>` (no tab bar, longer-form layout, `min-h-dvh`).
 */
export function AppShellAuthed({
  children,
  badges,
  hideTabBar = false,
}: AppShellAuthedProps) {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col">
      <AuroraBackground />
      <main
        className="flex flex-1 flex-col overflow-y-auto"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {children}
      </main>
      {hideTabBar ? null : <BottomTabBar badges={badges} />}
    </div>
  );
}
