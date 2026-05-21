import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { getAuthProviderAvailability } from "@/lib/auth/providers";

/**
 * Auth.js v5 (NextAuth v5) configuration.
 *
 * Providers are registered *conditionally* from env vars so a fresh
 * checkout with no secrets ships a working sign-in screen where every
 * provider row reads "Soon" instead of a row that throws on click.
 *
 * No database adapter is wired up — sessions are JWT-only. We are not
 * persisting users yet; that lands in a follow-up branch alongside a
 * real account model.
 */
const availability = getAuthProviderAvailability();

const providers: NextAuthConfig["providers"] = [];

if (availability.google) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
});
