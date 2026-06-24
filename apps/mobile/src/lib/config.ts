/**
 * Runtime config from Expo public env (EXPO_PUBLIC_*). When the Clerk key is
 * absent the app runs in local demo mode (no auth, sample portfolio) so the UI
 * is always runnable; with a key it does real auth + talks to the API.
 */
export const config = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? "https://folio-fawn-nu.vercel.app").replace(/\/$/, ""),
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
};

export const isAuthConfigured = config.clerkPublishableKey.length > 0;
