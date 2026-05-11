import { AuroraBackground } from "./AuroraBackground";

type AppShellProps = {
  children: React.ReactNode;
};

/**
 * Mobile-first viewport shell. Caps the layout at a phone-width column on
 * larger screens, applies safe-area insets, and hosts the global background.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
      <AuroraBackground />
      <div
        className="flex flex-1 flex-col"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
