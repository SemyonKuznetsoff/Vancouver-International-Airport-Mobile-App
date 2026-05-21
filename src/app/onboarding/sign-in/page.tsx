import { getAuthProviderAvailability } from "@/lib/auth/providers";

import { SignInClient } from "./SignInClient";

/**
 * Server component: reads auth provider availability from env vars
 * server-side and hands a plain-boolean availability map down to the
 * client. No secrets cross the boundary.
 */
export default function SignInPage() {
  const availability = getAuthProviderAvailability();
  return <SignInClient availability={availability} />;
}
