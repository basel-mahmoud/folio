import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk authenticates both web sessions (cookie) and mobile requests
 * (Authorization: Bearer <session jwt>), populating `auth()` in API routes.
 * No routes are force-protected here — each API route authorises itself via
 * getCurrentUser(); public pages (/, /u/<handle>) stay open.
 *
 * Until Clerk keys are configured the middleware is a no-op so the marketing
 * placeholder deploys without secrets.
 */
const handler = process.env.CLERK_SECRET_KEY
  ? clerkMiddleware()
  : () => NextResponse.next();

export default handler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
