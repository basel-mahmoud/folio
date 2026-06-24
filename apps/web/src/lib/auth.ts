/**
 * Server-side auth. Identity comes from Clerk (cookie session on web, or a
 * Bearer session JWT from the Expo app); authorization + ownership come from our
 * own database under RLS. The local `users` row is lazily upserted inside a
 * withUser() transaction so the insert satisfies the RLS WITH CHECK policy.
 */
import "server-only";
import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { users } from "@/lib/db/schema";
import { withUser } from "@/lib/db/client";

export class ApiAuthError extends Error {
  status = 401;
  constructor(message = "Authentication required") {
    super(message);
    this.name = "ApiAuthError";
  }
}

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

/** Resolve the current user and lazily mirror them locally. Memoised per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const cu = await currentUser();
  const email =
    cu?.primaryEmailAddress?.emailAddress ??
    cu?.emailAddresses?.[0]?.emailAddress ??
    "";
  const name =
    [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") ||
    cu?.username ||
    null;
  const imageUrl = cu?.imageUrl ?? null;

  await withUser(userId, (tx) =>
    tx
      .insert(users)
      .values({ id: userId, email, name, imageUrl })
      .onConflictDoUpdate({
        target: users.id,
        set: { email, name, imageUrl, updatedAt: new Date() },
      }),
  );

  return { id: userId, email, name, imageUrl };
});

/** For API routes: return the authed user id or throw ApiAuthError (→ 401). */
export async function requireApiUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new ApiAuthError();
  return user;
}
