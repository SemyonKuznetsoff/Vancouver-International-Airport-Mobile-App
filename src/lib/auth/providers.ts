import "server-only";

/**
 * Server-only helper that reports which auth providers are configured
 * in the current environment. The booleans are safe to serialize to
 * client components — they say nothing about the secrets themselves.
 *
 * A provider is "available" only when *all* of its required env vars
 * are present and non-empty. Anything missing keeps the provider in
 * the disabled / "Soon" state on the sign-in screen so we never ship
 * a row that looks active but fails on click.
 *
 * Apple, email, and Aeroplan intentionally have no env-var path yet
 * — they cannot be flipped on by editing `.env` alone, and live as
 * `false` until real provider config (Apple Developer JWT signing
 * key, SMTP, official Aeroplan OAuth) ships in a follow-up branch.
 */
export type AuthProviderAvailability = {
  google: boolean;
  apple: false;
  email: false;
  aeroplan: false;
};

function hasEnv(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0;
}

export function getAuthProviderAvailability(): AuthProviderAvailability {
  return {
    google: hasEnv("AUTH_GOOGLE_ID") && hasEnv("AUTH_GOOGLE_SECRET"),
    apple: false,
    email: false,
    aeroplan: false,
  };
}
