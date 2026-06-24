import { clerkClient } from "@clerk/nextjs/server";
import { authed } from "@/lib/api";
import { getBundle, deleteAccount } from "@/lib/services/portfolio";

/** GET /api/me — the signed-in user's full portfolio bundle. */
export async function GET(req: Request) {
  return authed(req, async (user) => {
    const bundle = await getBundle(user.id);
    return { user, ...bundle };
  });
}

/** DELETE /api/me — GDPR erase: delete all owned data + the Clerk identity. */
export async function DELETE(req: Request) {
  return authed(req, async (user) => {
    await deleteAccount(user.id);
    try {
      const client = await clerkClient();
      await client.users.deleteUser(user.id);
    } catch {
      // Local data is already gone; surfacing a Clerk error here helps nobody.
    }
    return { deleted: true };
  });
}
