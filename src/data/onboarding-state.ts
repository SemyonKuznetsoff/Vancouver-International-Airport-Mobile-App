/**
 * Local-only onboarding state.
 *
 * Persists the choices a user makes during the four-screen onboarding
 * flow (`/`, `/onboarding/sign-in`, `/onboarding/preferences`,
 * `/onboarding/permissions`) so they survive a reload, and records
 * when the flow is complete. There is no backend, no account, and no
 * real OS permission grant behind any of these fields — the toggles
 * on `/onboarding/permissions` only record an *intent* to receive
 * wayfinding / notification prompts; the actual OS permission is
 * requested later by the feature that needs it.
 *
 * All writes go through `saveOnboardingState` / `completeOnboarding`
 * so the storage key and JSON shape stay in one place.
 */
"use client";

export type TravelMode =
  | "business"
  | "family"
  | "accessibility"
  | "first-timer";

export type Language = "en" | "fr" | "zh" | "ja";

export type OnboardingState = {
  completed?: boolean;
  completedAt?: string;
  travelMode?: TravelMode;
  language?: Language;
  wantsWayfinding?: boolean;
  wantsNotifications?: boolean;
  authMode?: "guest";
};

const STORAGE_KEY = "yvr.onboarding";

function readStorage(): OnboardingState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as OnboardingState)
      : {};
  } catch {
    return {};
  }
}

function writeStorage(next: OnboardingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be disabled (private mode, quota, etc.). Silently
    // skip — onboarding still navigates and the user is not blocked.
  }
}

export function loadOnboardingState(): OnboardingState {
  return readStorage();
}

export function saveOnboardingState(
  partial: Partial<OnboardingState>,
): OnboardingState {
  const next = { ...readStorage(), ...partial };
  writeStorage(next);
  return next;
}

export function completeOnboarding(
  partial: Partial<OnboardingState> = {},
): OnboardingState {
  return saveOnboardingState({
    ...partial,
    completed: true,
    completedAt: new Date().toISOString(),
  });
}
